// import middlewares
import path from "path";
import upload from "./configuration/uploadConfiguration";
// import types
import Express from "express";


export const uploadImgProfile = upload("public/profile-photo/", [11000000], ["image/jpeg", "image/pjpeg", "image/png"]);

export async function uploadFileManager(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    if (req.query._upload === "true") {
        const validPath = path.join((req.params.dir_path ? req.params.dir_path.replace(/\:\:/g, "/") : "")
            .replace(/^\/+/g, "").replace(/\/+$/g, ""));
        return upload(("public/" + validPath + "/")).array("_upload")(req, res, next);
    } else return next();
}