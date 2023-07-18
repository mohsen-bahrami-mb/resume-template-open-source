// import modules
import jwt from "jsonwebtoken";
// import models
import Session from "../models/session";
import { response } from "../routes/controller";
// import types
import Express from "express";

export default function checkValidateErr(
    req: Express.Request, res: Express.Response, next: Express.NextFunction, err: string[],
    type?: "redirect-nodb" | "json" | "render" | "redirect" | "render-nodb", view?: string
): void {
    const noQueryUrl = req.originalUrl.replace(/(.*)(\?.*)/g, "$1");
    if (err.length) return response({
        res, success: false, sCode: 400, message: "validation error",
        data: { err: [...err, "لطفا یکبار صفحه را بوسیله لینک خط بعدی بازنشانی کنید و سپس مجددا تغییرات را انجام دهید", `<a class='text-white fw-bold' href='${noQueryUrl}'>click to refresh</a>`] },
        req, type: (type ?? "redirect-nodb"), view: (view ?? noQueryUrl)
    });
    next();
}