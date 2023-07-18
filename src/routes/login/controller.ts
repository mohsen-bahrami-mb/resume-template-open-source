// import modules
import jwt from "jsonwebtoken";
// import controllers
import Controller from "../controller";
// import middleware modules
import { response } from "../controller";
// import modules types
import Express from "express";

export default new (class extends Controller {
    // make all route logic as middleware function

    async getLogin(req: Express.Request, res: Express.Response): Promise<void> {
        response({ res, message: "get login page", data: {}, req, type: "render-nodb", view: "auth/login" });
    }

    async postLogin(req: Express.Request, res: Express.Response): Promise<void> {
        let { password } = req.body;
        if (password !== process.env.OWNER_PASSWORD as string) return response({
            res, success: false, sCode: 400, message: "wrong password!", data: { err: ["رمز عبور اشتباه است"] },
            req, type: "render-nodb", view: "auth/login"
        });
        const token = jwt.sign({ password }, process.env.JWT_SESSION_KEY as string);
        const expireTime = 1000 * 3600 * 24 * 3;
        res.cookie("x-auth-token", token, { maxAge: expireTime });
        response({ res, message: "get login page", data: {}, req, type: "redirect-nodb", view: "/edit" });
    }

})();