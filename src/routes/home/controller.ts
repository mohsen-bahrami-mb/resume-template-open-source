// import modules
import fs from "fs";
import path from "path";
// import controllers
import Controller, { response } from "../controller";
// import middleware
// import modules types
import Express from "express";

export default new (class extends Controller {
    // make all route logic as middleware function
    // redirect to / (home)
    async redirectToHome(req: Express.Request, res: Express.Response): Promise<void> {
        return response({
            res, success: true, sCode: 301, message: "redirect to / path", data: {},
            req, type: "redirect-nodb", view: "/"
        });
    }
    // get / (home)
    async redirectToResume(req: Express.Request, res: Express.Response): Promise<void> {
        return response({
            res, success: true, sCode: 302, message: "redirect to /resume path", data: {},
            req, type: "redirect-nodb", view: "/resume"
        });
    }
    // get resume
    async getResume(req: Express.Request, res: Express.Response): Promise<void> {
        const content =
            await (await fetch(req.protocol + "://" + req.hostname + ":" + process.env.PORT + "/APP/content.json"))
                .json();
        if (!fs.existsSync(path.join(__dirname, `./../../../views/resume/${content.theme}.ejs`)))
            return response({
                res, success: false, sCode: 404, message: "theme error - not fount theme page to render!",
                data: { err: ["صفحه‌ی تم مدنظر برای نمایش پیدا نشد"] },
                req, type: "render-nodb", view: "errors/notFound"
            });
        response({
            res, message: "get resume page", data: { content },
            req, type: "render-nodb", view: `resume/${content.theme}`
        });
    }

})();