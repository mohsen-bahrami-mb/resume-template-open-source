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
    const expireTime = 1000 * 3600 * 24 * 3;
    const token = req.cookies["x-auth-token"] ?? "";
    const password = process.env.OWNER_PASSWORD;
    let decoded: string | jwt.JwtPayload;
    try {
        decoded = <jwt.JwtPayload>jwt.verify(token, <string>process.env.JWT_SESSION_KEY);
        if (decoded.password !== password) throw new Error();
    } catch (error) {
        res.cookie("x-auth-token", "", { maxAge: Date.now() - 100000 });
        return response({
            res, success: false, sCode: 401, message: "access denaid",
            data: { err: ["نیاز است که در سایت لاگین کنید"] },
            req, type: "redirect-nodb", view: "/login"
        });
    }
    res.cookie("x-auth-token", token, { maxAge: expireTime });
    next();
}