// import controllers
import { getOneRoute, response } from "../../routes/controller";
// import models
import User from "../../models/user";
// import module types
import Express from "express";
import Mongoose from "mongoose";

export default async function checkRoute(req: Express.Request, res: Express.Response, patern: string | RegExp) {
    const { route, users, message } = await getOneRoute(<string>patern);
    if (!route) return response({
        res, success: false, sCode: 404, message,
        data: { err: [`اطلاعات آدرس "${patern}" در دیتابیس موجود نیست`] },
        req, type: "render", view: "errors/notFound"
    });
    req.aRoute.route = route.route;
    req.aRoute.issue = route.issue;
    req.aRoute.type = route.type;
    req.aRoute.is_protect_user = route.is_protect_user;
    req.aRoute.content = route.content;
    if (route.is_protect_user && !route.users.includes(<Mongoose.Types.ObjectId>req.user.id)) return response({
        res, success: false, sCode: 401, message: `access denied`,
        data: { err: [`شما به آدرس "${patern}" دسترسی ندارید`] },
        req, type: "render", view: "errors/accessDenied"
    });
    req.aRoute.access = true;
    const owner = await User.findOne({ _id: req.user.id, role: "owner" });
    if (owner) req.aRoute.users = users;
    return true;
}