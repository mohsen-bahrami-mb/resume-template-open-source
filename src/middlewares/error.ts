// import modules
import { logger } from "../startup/logger";
import { response } from "../routes/controller";
// import module types
import Express from "express";
import multer from "multer";

export default function errorApp(err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction): void {
    // send response if it has multer error
    if (err instanceof multer.MulterError) return response({
        res, sCode: 400, success: false, message: "transfer file error",
        data: { err: [process.env.NODE_ENV === "development" ? err.stack : err.message] },
        req, type: "redirect-nodb", view: req.originalUrl
    });
    // log error in server app and send appropreate response
    logger.error({
        label: "SERVER ERROR",
        message: err.stack
    });
    return response({
        res, sCode: 500, success: false, message: "server error: something failed",
        data: { err: [process.env.NODE_ENV === "development" ? err.stack : err.message] },
        req, type: "render-nodb", view: "errors/serverError"
    });
}