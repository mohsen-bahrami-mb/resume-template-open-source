// import modules
import multer from "multer";
import { mkdirp } from "mkdirp"
// import module types
import Express from "express";

function setStorage(path: string) {
    return multer.diskStorage({
        destination: async function (req, file, callBack): Promise<void> {
            // set path directory
            await mkdirp(path);
            callBack(null, path);
        },
        filename: function (req, file, callBack): void {
            // set uniqe file name
            const uniqeName = new Date().getTime().toString(32) + "-" + file.originalname;
            callBack(null, uniqeName);
        },
    });
}

function setLimits(limits: [number]): multer.Options["limits"] {
    // a function to set limits for file
    return {
        fileSize: limits[0]
    }
}

function setFileFilter(fileTypesArray: string[]): multer.Options["fileFilter"] {
    // a function for set file filter
    // it get an array of types (mimetype) in parameter
    // see mimtypes at bottom
    return function (
        req: Express.Request,
        file: globalThis.Express.Multer.File,
        callBack: multer.FileFilterCallback
    ): void | multer.FileFilterCallback {
        const allowTypes: string[] = [...fileTypesArray];
        if (!allowTypes.includes(file.mimetype)) {
            const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE");
            error.message = `فقط فایل هایی با تایپ مشخص شده قابل دریافت هستند: ${allowTypes}`;
            error.stack = `just accept this file types: ${allowTypes}.      ` + error.stack;
            return callBack(error);
        }
        callBack(null, true);
    }
}

/**
 * @param pathToSave set path to save
 * @param limitsArray is an array to set limits. Each index number is for these items: 
 * @enum :limitsArray[ file size in Bytes ]
 * @param fileTypes is an array to set file mimetype. this is all mimetypes:
 * @enum :mimetype["image/gif", "image/jpeg", "image/pjpeg", "image/png", "image/svg+xml", "image/tiff", "image/webp", "audio/aac", "audio/mp3", "audio/mpeg", "audio/ogg", "audio/wav", "audio/webm", "video/mp4", "video/mpeg", "video/ogg", "video/quicktime", "video/webm", "video/x-ms-wmv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf", "application/x-javascript", "application/x-shockwave-flash", "application/zip", "application/x-rar-compressed", "application/octet-stream", "text/plain", "text/csv", "text/tab-separated-values"]
*/
export default function (pathToSave: string, limitsArray?: [number], fileTypes?: string[]
): multer.Multer {
    const storage = setStorage(pathToSave);
    let limits: multer.Options["limits"];
    let fileFilter: multer.Options["fileFilter"];
    if (limitsArray) limits = setLimits(limitsArray);
    if (fileTypes) fileFilter = setFileFilter(fileTypes);
    const upload = multer({ storage, limits, fileFilter });
    return upload;
}