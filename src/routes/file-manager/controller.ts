// import modules
// import controllers
import { FMDB } from "../../controllers/file";
import Controller, {
    getOneRoute, response, updateOtherAccount, updateSelfAccount,
    updateRoute, renameOne, readDir, createDir, deleteOne, copyOne
} from "../controller";
// import middleware
// import models
import File from "../../models/file";
// import types
import Express from "express";

export default new (class extends Controller {
    // make all route logic as middleware function

    /** API: get a dir detail or a file */
    async APIGetOne(req: Express.Request, res: Express.Response): Promise<void> {
        if (!req.params.dir_path || req.params.dir_path === "::" || req.params.dir_path === "") {
            // go to root directory
            const dirDetail = await readDir("/");
            if (!dirDetail.success) return response({
                res, success: false, sCode: 400, message: "cannot find directory",
                data: { url: req.originalUrl, err: dirDetail.message }
            });
            return response({
                res, message: "root file manager directory", data: {
                    dir: dirDetail.dir, dir_description: ["name", "path", "is dir or file", "size(byte)", "file doc in db ?"],
                    url: req.originalUrl, msg: dirDetail.message
                }
            });
        } else {
            // go to target directory
            const dirPath = req.params.dir_path.replace(/\:\:/g, "/");
            const dirDetail = await readDir(dirPath);
            if (!dirDetail.success) return response({
                res, success: false, sCode: 400, message: "cannot find directory",
                data: { url: req.originalUrl, err: dirDetail.message }
            });
            return response({
                res, message: "find directory and show detail", data: {
                    dir: dirDetail.dir, dir_description: ["name", "path", "is dir or file", "size(byte)", "file doc in db ?"],
                    url: req.originalUrl, msg: dirDetail.message
                }
            });
        }
    }
    /** get a dir detail or a file */
    async getOne(req: Express.Request, res: Express.Response): Promise<void> {
        if (!req.params.dir_path || req.params.dir_path === "::" || req.params.dir_path === "") {
            // go to root directory
            const dirDetail = await readDir("/");
            if (!dirDetail.success) return response({
                res, success: false, sCode: 400, message: "cannot find directory",
                data: { url: req.originalUrl, err: dirDetail.message },
                req, type: FMDB ? "render" : "render-nodb", view: "fileManager/dir"
            });
            return response({
                res, message: "root file manager directory", data: {
                    dir: dirDetail.dir, dir_description: ["name", "path", "is dir or file", "size(byte)", "file doc in db ?"],
                    url: req.originalUrl, msg: dirDetail.message
                }, req, type: FMDB ? "render" : "render-nodb", view: "fileManager/dir"
            });
        } else {
            // go to target directory
            const dirPath = req.params.dir_path.replace(/\:\:/g, "/");
            const dirDetail = await readDir(dirPath);
            if (!dirDetail.success) return response({
                res, success: false, sCode: 400, message: "cannot find directory",
                data: { url: req.originalUrl, err: dirDetail.message },
                req, type: FMDB ? "render" : "render-nodb", view: "fileManager/dir"
            });
            return response({
                res, message: "find directory and show detail", data: {
                    dir: dirDetail.dir, dir_description: ["name", "path", "is dir or file", "size(byte)", "file doc in db ?"],
                    url: req.originalUrl, msg: dirDetail.message
                }, req, type: FMDB ? "render" : "render-nodb", view: "fileManager/dir"
            });
        }
    }
    /** create a dir or a file */
    async posCreateOne(req: Express.Request, res: Express.Response): Promise<void> {
        const noQueryUrl = req.originalUrl.replace(/(.*)(\?.*)/g, "$1");
        const dirPath = req.params.dir_path?.replace(/\:\:/g, "/");
        if (req.query._upload === "true") {
            if (!req.files?.length) return response({
                res, success: false, sCode: 400, message: "files could not upload!",
                data: { url: noQueryUrl, err: ["فایلی دریافت نشد، یک فایل انخاب کنید"] },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
            if (FMDB) (req.files as globalThis.Express.Multer.File[]).forEach(async f => {
                const file = new File({ path: f.path });
                await file.save();
            });
            response({
                res, message: "upload new files",
                data: { url: noQueryUrl, files: req.files, msg: ["فایل ها با موفقیت آپلود شدند"] },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
        }
        else if (!req.params.dir_path || req.params.dir_path === "::" || req.params.dir_path === "") {
            // go to root directory
            const newDirName = req.body._name;
            if (!newDirName) return response({
                res, success: false, sCode: 400, message: "cannot read data",
                data: { url: noQueryUrl, err: ["فیلد _name دریافت نشد"] }, req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
            const newDir = await createDir(newDirName);
            if (!newDir.success) return response({
                res, success: false, sCode: 400, message: "cannot create directory",
                data: { url: noQueryUrl, err: newDir.message }, req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
            return response({
                res, message: "create directorry in root file manager directory",
                data: { url: noQueryUrl, msg: newDir.message }, req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
        } else {
            // go to target directory
            const newDirName = req.body._name;
            if (!newDirName) return response({
                res, success: false, sCode: 400, message: "cannot read data",
                data: { url: noQueryUrl, err: ["فیلد _name دریافت نشد"] }, req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
            const newDir = await createDir((dirPath + "/" + newDirName));
            if (!newDir.success) return response({
                res, success: false, sCode: 400, message: "cannot create directory",
                data: { url: noQueryUrl, err: newDir.message },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
            return response({
                res, message: "create directory",
                data: { url: noQueryUrl, msg: newDir.message },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
        }
    }
    /** rename a dir or a file */
    async putRenameOne(req: Express.Request, res: Express.Response): Promise<void> {
        const noQueryUrl = req.originalUrl.replace(/(.*)(\?.*)/g, "$1");
        const dirQuery = req.query.dir === "false" ? false : req.query.dir === "true" ? true : undefined;
        const dirName = req.body._name;
        const newDirName = req.body._new_name.join("");
        if (!dirName || !newDirName) return response({
            res, success: false, sCode: 400, message: "cannot read '_name' or '_new_name'!!! set both!",
            data: { url: noQueryUrl, err: ["فایل یا دایرکتوری مدنظر را انتخاب کنید و نام جدید آن را نیز وارد کنید"] },
            req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
        });
        if (dirQuery === undefined) return response({
            res, success: false, sCode: 400, message: "cannot read query(?dir=), set 'true' of 'false'",
            data: { url: noQueryUrl, err: ["عدم تشخیص تایپ عملیات"] },
            req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
        });
        if (!req.params.dir_path || req.params.dir_path === "::" || req.params.dir_path === "") {
            // go to root directory
            const changeDirName = await renameOne(dirName, newDirName, dirQuery);
            if (!changeDirName.success) return response({
                res, success: false, sCode: 400, message: "cannot renname directory",
                data: { url: noQueryUrl, err: changeDirName.message },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
            return response({
                res, message: "create directorry in root file manager directory",
                data: { url: noQueryUrl, msg: changeDirName.message },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
        } else {
            // go to target directory
            const dirPath = req.params.dir_path.replace(/\:\:/g, "/");
            const changeDirName = await renameOne(dirName, newDirName, dirQuery);
            if (!changeDirName.success) return response({
                res, success: false, sCode: 400, message: "cannot create directory",
                data: { url: noQueryUrl, err: changeDirName.message },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
            return response({
                res, message: "create directory",
                data: { url: noQueryUrl, msg: changeDirName.message },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
        }
    }
    /** delete a dir or a file */
    async deleteOne(req: Express.Request, res: Express.Response): Promise<void> {
        const noQueryUrl = req.originalUrl.replace(/(.*)(\?.*)/g, "$1");
        const dirQuery = req.query.dir === "false" ? false : req.query.dir === "true" ? true : undefined;
        const dirName = req.body._name;
        if (!dirName) return response({
            res, success: false, sCode: 400, message: "cannot read '_name' or '_new_name'!!! set both!",
            data: { url: noQueryUrl, err: ["فایل یا دایرکتوری مدنظر را انتخاب کنید و سپس اقدام به حذف کنید"] },
            req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
        });
        if (dirQuery === undefined) return response({
            res, success: false, sCode: 400, message: "cannot read query(?dir=), set 'true' of 'false'",
            data: { url: noQueryUrl, err: ["عدم تشخیص تایپ عملیات"] },
            req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
        });
        if (!req.params.dir_path || req.params.dir_path === "::" || req.params.dir_path === "") {
            // go to root directory
            const deleteItem = await deleteOne(dirName, dirQuery);
            if (!deleteItem.success) return response({
                res, success: false, sCode: 400, message: "cannot delete directory or file",
                data: { url: noQueryUrl, err: deleteItem.message },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
            if (deleteItem.file && deleteItem.file.length) {
                const fileId: any[] = deleteItem.file.filter((f: any) => f.path === "" && f.path_reduce_file === "")
                    .map((f: any) => f._id.toString());
            }
            return response({
                res, message: "delete directory or file in root file manager directory",
                data: { url: noQueryUrl, msg: deleteItem.message },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
        } else {
            // go to target directory
            const dirPath = req.params.dir_path.replace(/\:\:/g, "/");
            const deleteItem = await deleteOne(dirName, dirQuery);
            if (!deleteItem.success) return response({
                res, success: false, sCode: 400, message: "cannot delete directory or file",
                data: { url: noQueryUrl, err: deleteItem.message },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
            if (deleteItem.file && deleteItem.file.length) {
                const fileId: any[] = deleteItem.file.filter((f: any) => f.path === "" && f.path_reduce_file === "")
                    .map((f: any) => f._id.toString());
            }
            return response({
                res, message: "delete directory or file",
                data: { url: noQueryUrl, msg: deleteItem.message },
                req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl
            });
        }
    }
    /** copy a dir or a file */
    async postCopyOne(req: Express.Request, res: Express.Response): Promise<void> {
        let { base_path, dist_path, keep } = req.body;
        dist_path = dist_path.join("");
        const keepBoolean = keep === "false" ? false : keep === "true" ? true : true;
        const noQueryUrl = req.originalUrl.replace(/(.*)(\?.*)/g, "$1");
        if (!base_path || !dist_path) return response({
            res, success: false, sCode: 400, message: "cannot read base or dist path",
            data: { url: noQueryUrl.replace("/copy", "/dir"), err: ["مسیر مبدأ و مقصد را برای کپی کردن فایل یا دایرکتوری مشخص کنید"] },
            req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl.replace("/copy", "/dir")
        });
        const copy = await copyOne(base_path, dist_path, keepBoolean);
        if (!copy.success) return response({
            res, success: false, sCode: 400, message: "cannot copy directory/file",
            data: { url: noQueryUrl.replace("/copy", "/dir"), err: copy.message },
            req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl.replace("/copy", "/dir")
        });
        return response({
            res, message: "successfully copy directory/file",
            data: { url: noQueryUrl.replace("/copy", "/dir"), msg: copy.message },
            req, type: FMDB ? "redirect" : "redirect-nodb", view: noQueryUrl.replace("/copy", "/dir")
        });
    }

})();