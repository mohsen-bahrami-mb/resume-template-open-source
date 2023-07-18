// import modules
import jwt from "jsonwebtoken";
// import controllers
import { response } from "../routes/controller";
// import models
// import types
import Express from "express";

export default async function (
    req: Express.Request, res: Express.Response, next: Express.NextFunction
): Promise<void> {
    // check is unknown user
    const expireTime = 1000 * 3600 * 24 * 3;
    const token = req.cookies["x-auth-token"] ?? "";
    const password = process.env.OWNER_PASSWORD;
    let decoded: string | jwt.JwtPayload;
    try {
        decoded = <jwt.JwtPayload>jwt.verify(token, <string>process.env.JWT_SESSION_KEY);
        if (decoded.password !== password) throw new Error();
    } catch (error) {
        res.cookie("x-auth-token", "", { maxAge: Date.now() - 100000 });
        return next();
    }
    res.cookie("x-auth-token", token, { maxAge: expireTime });
    response({
        res, success: true, sCode: 302, message: "redirect to dashboard",
        data: { msg: ["شما قبلا در پنل ویرایش لاگین کرده‌اید"] },
        req, type: "redirect-nodb", view: "/edit"
    });
}