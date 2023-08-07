// import modules
import fs from "fs";
import path from "path";
import fse from "fs-extra"
// import models
import FileDB from "../models/file";
// import types
import { FileManager } from "../types/appType";

export let FMDB = false;
/** accept file manager database */
export default function acceptFMDB() { FMDB = true }

/** 
 * @arguments `path` should be without `/public` 
 * @returns :{success: `boolean`; file: `undefined | string`; message: `string[]`;}
*/
export async function deleteProfilePhoto(pathI: string) {
    const validPath = pathI.replace(/^\/+/g, "");
    const pathJoin = path.join(__dirname + "./../../public/" + validPath);
    // delete file
    let result;
    await new Promise((resolve, reject) => fs.unlink(pathJoin,
        (err) => { if (err) return reject(false); return resolve(true); }))
        .then((t) => { }).catch((f) => result = {
            success: false, file: undefined,
            message: ["مشکلی در پردازش فایل بوجود آمده، از صحت مسیر فایل اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
        });
    if (result) return result;
    return { success: true, file: pathI, message: ["عکس پروفایل با موفقیت حذف شد"] };
}

/** 
 * @arguments `path` should be without `/public`
 * @returns :{
 * success: `boolean`;
 * dir: `[string<file name>, string<file path>, string<"file" | "dir">, number<file size in byte>][] | undefined`;
 * message: `string[]`;
 * } 
*/
export async function readDir(pathI: string) {
    const validPath = path.join("/" + pathI.replace(/^\/+/g, "").replace(/\/+$/g, "")).replace(/\\/g, "/");
    const pathJoin = path.join(__dirname + "./../../public/" + validPath);
    const regexDir = new RegExp("(" + validPath + ")" + "(\/?.*)", "g");
    const files = FMDB && await FileDB.find().or([{ path: regexDir }, { path_reduce_file: regexDir }]);
    let result: FileManager.ReadDir = { success: false, message: [] };
    await new Promise((resolve, reject) => fs.readdir(pathJoin, (err, detail) => {
        if (err) return reject(false);
        let result: [string, string, string, number, {}?][] = [];
        if (detail) detail.map(v => {
            const dir = fs.statSync(pathJoin + "/" + v);
            const path = validPath.length > 1 ? (validPath + "/" + v) : ("/" + v);
            if (dir.isDirectory()) result.push([v, path, "dir", dir.size]);
            else {
                const file = files && files.filter(f => f.path === path || f.path_reduce_file === path);
                result.push([v, path, "file", dir.size, (file ? file : undefined)]);
            }
        });
        return resolve(result);
    })).then((detail: any) => result = {
        success: true, dir: detail,
        message: ["نمایش محتویات دایرکتوری(فولدر)"]
    }).catch((f) => result = {
        success: false, dir: undefined,
        message: ["مشکلی در پردازش دایرکتوری(فولدر) بوجود آمده، از صحت مسیر دایرکتوری(فولدر) اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
    });
    return result;
}

/** 
 * @arguments `path` should be without `/public`
 * @returns :{success: `boolean`; dir: `string | undefined`; message: `string[]`;} 
*/
export async function createDir(pathI: string) {
    const validPath = path.join("/" + pathI.trim().replace(/ /g, "-").replace(/^\/+/g, "").replace(/\/+$/g, "")).replace(/\\/g, "/");
    const pathJoin = path.join(__dirname + "./../../public/" + validPath);
    let result: FileManager.CreateDir = { success: false, message: [] };
    await new Promise((resolve, reject) => fs.mkdir(pathJoin, { recursive: true },
        (err, path) => { if (!path) return reject(false); return resolve(path); }))
        .then((path: any) => result = {
            success: true, dir: path,
            message: ["دایرکتوری(فولدر) با موفقیت ساخته شد"]
        }).catch((f) => result = {
            success: false, dir: undefined,
            message: ["مشکلی در پردازش دایرکتوری(فولدر) بوجود آمده، از صحت مسیر دایرکتوری(فولدر) اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
        });
    return result;
}

/** 
 * @arguments `path` should be without `/public` 
 * @returns :{success: `boolean`; file: `undefined | File<dbModel>`; dir: `undefined | string`; message: `string[]`;}
*/
export async function renameOne(oldPath: string, newPath: string, dir: boolean) {
    const validOldPath = path.join("/" + oldPath.replace(/^\/+/g, "").replace(/\/+$/g, "")).replace(/\\/g, "/");
    const validNewPath = path.join("/" + newPath.trim().replace(/ /g, "-").replace(/^\/+/g, "").replace(/\/+$/g, "")).replace(/\\/g, "/");
    const validOldPathRec = path.join(__dirname + "./../../public/" + validOldPath);
    const validNewPathRec = path.join(__dirname + "./../../public/" + validNewPath);
    // check the path is file or dir. then do process
    if (!dir) {
        // it is file
        // check is file
        if (!fs.existsSync(validOldPathRec) || fs.statSync(validOldPathRec).isDirectory()
            || fs.existsSync(validNewPathRec)) return {
                success: false, file: undefined, dir: undefined,
                message: ["مشکلی در پردازش فایل بوجود آمده، از صحت مسیر فایل اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
            };
        // search oldPath in database
        const file = FMDB && await FileDB.findOne().or([{ path: validOldPath }, { path_reduce_file: validOldPath }]);
        if (FMDB && !file) return {
            success: false, file: undefined, dir: undefined,
            message: ["آدرس فایل در دیتابیس یافت نشد"]
        };
        // rename file
        let result;
        await new Promise((resolve, reject) => fs.rename(validOldPathRec, validNewPathRec, (err) => {
            // copy last path with detail to new path
            if (err) fse.copy(validOldPathRec, validNewPathRec)
                // remove last path with detail
                .then(() => fse.rm(validOldPathRec, { recursive: true, force: true })
                    .then(() => resolve(true)).catch(() => reject(false)))
                .catch(() => reject(false));
            else return resolve(true);
        })).then((t) => { }).catch((f) => result = {
            // set false result
            success: false, file: undefined, dir: undefined,
            message: ["مشکلی در پردازش فایل بوجود آمده، از صحت مسیر فایل اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
        });
        if (result) return result;
        // rename path in database
        if (FMDB && file) {
            file.path = file.path === validOldPath ? validNewPath : file.path;
            file.path_reduce_file = file.path_reduce_file === validOldPath ? validNewPath : file.path_reduce_file;
            await file.save();
        }
        return {
            success: true, file: (file ? file : { path: newPath }), dir: undefined,
            message: ["نام فایل با موفقیت به‌روزرسانی شد"]
        };
    } else {
        // it is dir
        // check is directory
        if (!fs.existsSync(validOldPathRec) || !fs.statSync(validOldPathRec).isDirectory()
            || fs.existsSync(validNewPathRec)) return {
                success: false, file: undefined, dir: undefined,
                message: ["مشکلی در پردازش دایرکتوری(فولدر) بوجود آمده، از صحت مسیر دایرکتوری(فولدر) اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
            };
        // search oldPath in database
        const regexDir = new RegExp("(" + validOldPath + ")" + "(\/?.*)", "g");
        const fileInDir = FMDB && await FileDB.find().or([{ path: regexDir }, { path_reduce_file: regexDir }]);
        if (FMDB && fileInDir && fileInDir.length) {
            // rename directory
            let result;
            await new Promise((resolve, reject) => fs.rename(validOldPathRec, validNewPathRec, (err) => {
                // copy last path with detail to new path
                if (err) fse.copy(validOldPathRec, validNewPathRec)
                    // remove last path with detail
                    .then(() => fse.rm(validOldPathRec, { recursive: true, force: true })
                        .then(() => resolve(true)).catch(() => reject(false)))
                    .catch(() => reject(false));
                else return resolve(true);
            })).then((t) => { }).catch((f) => result = {
                // set false result
                success: false, file: undefined, dir: undefined,
                message: ["مشکلی در پردازش دایرکتوری(فولدر) بوجود آمده، از صحت مسیر دایرکتوری(فولدر) اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
            });
            if (result) return result;
            // rename path in database
            await Promise.all(fileInDir.map(async f => {
                f.path = f.path?.match(regexDir) ?
                    f.path.replace(regexDir, "*$2").replace("*", path.join("/" + validNewPath)) : f.path;
                f.path_reduce_file = f.path_reduce_file?.match(regexDir) ?
                    f.path_reduce_file.replace(regexDir, "*$2").replace("*", path.join("/" + validNewPath))
                    : f.path_reduce_file;
                await f.save();
            }));
            return { success: true, file: fileInDir, dir: newPath, message: ["نام دایرکتوری(فولدر) با موفقیت به‌روزرسانی شد"] };
        }
        // rename directory
        let result;
        await new Promise((resolve, reject) => fs.rename(validOldPathRec, validNewPathRec, (err) => {
            // copy last path with detail to new path
            if (err) fse.copy(validOldPathRec, validNewPathRec)
                .then(() => fse.rm(validOldPathRec, { recursive: true, force: true })
                    // remove last path with detail
                    .then(() => resolve(true)).catch(() => reject(false)))
                .catch(() => reject(false));
            else return resolve(true);
        })).then((t) => { }).catch((f) => result = {
            // set false result
            success: false, file: undefined, dir: undefined,
            message: ["مشکلی در پردازش دایرکتوری(فولدر) بوجود آمده، از صحت مسیر دایرکتوری(فولدر) اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
        });
        if (result) return result;
        return { success: true, file: undefined, dir: newPath, message: ["نام دایرکتوری(فولدر) با موفقیت به‌روزرسانی شد"] };
    }
}

/** 
 * @arguments `path` should be without `/public` 
 * @returns :{success: `boolean`; file: `undefined | File<dbModel>[]`; dir: `undefined | string`; message: `string[]`;}
*/
export async function deleteOne(pathI: string, dir: boolean) {
    const validPath = path.join("/" + pathI.replace(/^\/+/g, "").replace(/\/+$/g, "")).replace(/\\/g, "/");
    const pathJoin = path.join(__dirname + "./../../public/" + validPath);
    if (!dir) {
        // check is file
        if (!fs.existsSync(pathJoin) || fs.statSync(pathJoin).isDirectory()) return {
            success: false, file: undefined, dir: undefined,
            message: ["مشکلی در پردازش دایرکتوری(فولدر) بوجود آمده، از صحت مسیر دایرکتوری(فولدر) اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
        };
        // search path in database
        const file = FMDB && await FileDB.findOne().or([{ path: validPath }, { path_reduce_file: validPath }]);
        if (FMDB && !file) return { success: false, file: undefined, message: ["آدرس فایل در دیتابیس یافت نشد"] };
        // delete file
        let result;
        await new Promise((resolve, reject) => fs.unlink(pathJoin,
            (err) => { if (err) return reject(false); return resolve(true); }))
            .then((t) => { }).catch((f) => result = {
                success: false, file: undefined,
                message: ["مشکلی در پردازش فایل بوجود آمده، از صحت مسیر فایل اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
            });
        if (result) return result;
        // delete path in database
        let message = ["فایل با موفقیت حذف شد"];
        if (FMDB && file) {
            file.path = file.path === validPath ? "" : file.path;
            file.path_reduce_file = file.path_reduce_file === validPath ? "" : file.path_reduce_file;
            file.path === "" && file.path_reduce_file === "" ? await file.deleteOne() : await file.save();
            file.path === "" && file.path_reduce_file === "" ? message.push("آدرس فایل با موفقیت از دیتابیس حذف شد")
                : message.push("فایل داری یک نسخه دیگر در دیتابیس است");
            return { success: true, file: [file], dir: pathI, message };
        } else {
            return { success: true, file: undefined, dir: pathI, message };
        }
    } else {
        // it is directory
        const regexDir = new RegExp("(" + validPath + ")" + "(\/?.*)", "g");
        const fileInDir = FMDB && await FileDB.find().or([{ path: regexDir }, { path_reduce_file: regexDir }]);
        // check is directory
        if (!fs.existsSync(pathJoin) || !fs.statSync(pathJoin).isDirectory()) return {
            success: false, file: undefined, dir: undefined,
            message: ["مشکلی در پردازش دایرکتوری(فولدر) بوجود آمده، از صحت مسیر دایرکتوری(فولدر) اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
        };
        // check it has files in directory
        if (FMDB && fileInDir && fileInDir.length) {
            // remove directory
            let result;
            await fse.rm(pathJoin, { recursive: true, force: true })
                .then((t) => { }).catch((f) => result = {
                    success: false, file: undefined, dir: undefined,
                    message: ["مشکلی در پردازش دایرکتوری(فولدر) بوجود آمده، از صحت مسیر دایرکتوری(فولدر) اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
                });
            if (result) return result;
            // remove path in database
            await Promise.all(fileInDir.map(async f => {
                f.path = f.path?.match(regexDir) ? "" : f.path;
                f.path_reduce_file = f.path_reduce_file?.match(regexDir) ? "" : f.path_reduce_file;
                if (!f.path.length && !f.path_reduce_file.length) return await f.deleteOne();
                await f.save();
            }));
            return {
                success: true, file: fileInDir, dir: pathI,
                message: ["دایرکتوری(فولدر) و تمام فایل های درون آن با موفقیت حذف شدند"]
            };

        }
        // remove directory
        let result: FileManager.DeleteOne = { success: false, message: [] };
        await fse.rm(pathJoin, { recursive: true, force: true })
            .then((t) => result = {
                success: true, file: undefined, dir: pathI,
                message: ["دایرکتوری(فولدر) و تمام فایل های درون آن با موفقیت حذف شدند"]

            }).catch((f) => result = {
                success: false, file: undefined, dir: undefined,
                message: ["مشکلی در پردازش دایرکتوری(فولدر) بوجود آمده، از صحت مسیر دایرکتوری(فولدر) اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
            });
        return result;
    }
}

/** 
 * @arguments `path` should be without `/public` 
 * @returns :{success: `boolean`; file: `undefined | File<dbModel>`; dir: `undefined | string`; message: `string[]`;}
*/
export async function copyOne(oldPath: string, newPath: string, keep = true) {
    const validOldPath = path.join("/" + oldPath.replace(/^\/+/g, "").replace(/\/+$/g, "")).replace(/\\/g, "/");
    const validNewPath = path.join("/" + newPath.trim().replace(/ /g, "-").replace(/^\/+/g, "").replace(/\/+$/g, "")).replace(/\\/g, "/");
    const validOldPathRec = path.join(__dirname + "./../../public/" + validOldPath);
    const validNewPathRec = path.join(__dirname + "./../../public/" + validNewPath);
    // check pathes
    if (!fs.existsSync(validOldPathRec) || fs.existsSync(validNewPathRec)) return {
        success: false, file: undefined, dir: undefined,
        message: ["مشکلی در پردازش دایرکتوری(فولدر) بوجود آمده، از صحت مسیر دایرکتوری(فولدر) اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
    };
    // search oldPath in database
    const regexDir = new RegExp("(" + validOldPath + ")" + "(\/?.*)", "g");
    const fileInDir = FMDB && await FileDB.find().or([{ path: regexDir }, { path_reduce_file: regexDir }]);
    let result;
    await new Promise((resolve, reject) => {
        // copy last path with detail to new path
        fse.copy(validOldPathRec, validNewPathRec)
            .then(() => {
                // remove last path with detail
                if (!keep) fse.rm(validOldPathRec, { recursive: true, force: true })
                    .then(() => resolve(true)).catch(() => reject(false));
                else resolve(true)
            })
            .catch(() => reject(false));
    }).then((t) => { }).catch((f) => result = {
        // set false result
        success: false, file: undefined, dir: undefined,
        message: ["مشکلی در پردازش دایرکتوری(فولدر) بوجود آمده، از صحت مسیر دایرکتوری(فولدر) اطمینان حاصل کنید یا نام را تغییر دهید و یکبار دیگر امتحان کنید"]
    });
    if (result) return result;
    if (FMDB && fileInDir && fileInDir.length) {
        // rename path in database
        await Promise.all(fileInDir.map(async f => {
            if (f.path.match(regexDir)) {
                const newFile = new FileDB({ path: f.path.replace(regexDir, `${validNewPath}$2`) })
                await newFile.save();
                if (!keep) f.path = ""
                if (!f.path.length && !f.path_reduce_file.length) await f.deleteOne();
                else await f.save();
            }
            else if (f.path_reduce_file.match(regexDir)) {
                const newFile = new FileDB({
                    path_reduce_file: f.path_reduce_file.replace(regexDir, `${validNewPath}$2`)
                });
                await newFile.save();
                if (!keep) f.path_reduce_file = ""
                if (!f.path.length && !f.path_reduce_file.length) return await f.deleteOne();
                await f.save();
            }
        }));
        return { success: true, file: fileInDir, dir: newPath, message: ["نام دایرکتوری(فولدر) با موفقیت به‌روزرسانی شد"] };
    }
    return { success: true, file: undefined, dir: newPath, message: ["نام دایرکتوری(فولدر) با موفقیت به‌روزرسانی شد"] };
}