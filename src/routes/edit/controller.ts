// import modules
import fs from "fs"
import fsx from "fs-extra"
import path from "path";
import Controller from "../controller";
// import middleware modules
import { response } from "../controller";
// import modules types
import Express from "express";
// import content
// import content from "../../content.json";

export default new (class extends Controller {
    // make all route logic as middleware function

    async redirectToEditContent(req: Express.Request, res: Express.Response): Promise<void> {
        response({
            res, success: true, sCode: 200, message: "redirect to /edit/content", data: {},
            req, type: "redirect-nodb", view: "/edit/content"
        });
    }

    async getContent(req: Express.Request, res: Express.Response): Promise<void> {
        const content =
            await (await fetch(req.protocol + "://" + req.hostname + (process.env.NODE_ENV === "development" ?
                ":" + process.env.PORT : "") + "/APP/content.json")).json();
        response({
            res, success: true, sCode: 200, message: "get content", data: { content, msg: ["محیط ویرایش صفحه رزومه"] },
            req, type: "render-nodb", view: "edit/content"
        });
    }

    async putContent(req: Express.Request, res: Express.Response): Promise<void> {
        let { HTML_resume, HTML_head, HTML_head_first, HTML_head_last, HTML_body_first, HTML_body_last,
            profile_photo, full_name, job_name, contact, personal, skills, theme, theme_config } = req.body;
        // set new content object
        let newContent: { [key: string]: any } = {};
        newContent.personal = {};
        newContent.HTML_head = {};
        newContent.contact = { other: [] };
        newContent.skills = [];
        // set string values
        newContent.HTML_resume = HTML_resume?.toString() ?? null;
        newContent.profile_photo = profile_photo?.toString() ?? null;
        newContent.full_name = full_name?.toString() ?? null;
        newContent.job_name = job_name?.toString() ?? null;
        newContent.theme = theme?.toString() ?? null;
        // set theme configs
        newContent.theme_config = theme_config;
        // return console.log(newContent.theme_config)
        // set newContent.HTML_head object
        newContent.HTML_head.title = HTML_head?.title?.toString() ?? null;
        newContent.HTML_head.open_graph = HTML_head?.open_graph?.toString() ?? null;
        newContent.HTML_head.description = HTML_head?.description?.toString() ?? null;
        newContent.HTML_head.keywords = HTML_head?.keywords?.toString() ?? null;
        newContent.HTML_head.theme_color = HTML_head?.theme_color?.toString() ?? null;
        newContent.HTML_head.favicon = HTML_head?.favicon?.toString() ?? null;
        // set newContent.HTML_(head/body)_(first/last)
        newContent.HTML_head_first = HTML_head_first?.toString() ?? null;
        newContent.HTML_head_last = HTML_head_last?.toString() ?? null;
        newContent.HTML_body_first = HTML_body_first?.toString() ?? null;
        newContent.HTML_body_last = HTML_body_last?.toString() ?? null;
        // set newContent.skills array
        newContent.skills = skills ?? null;
        // set newContent.contact object
        newContent.contact.phone = contact?.phone.toString() ?? null;
        newContent.contact.email = contact?.email.toString() ?? null;
        newContent.contact.website = contact?.website.toString() ?? null;
        newContent.contact.location = contact?.location.toString() ?? null;
        newContent.contact.other = contact?.other ?? null;
        // set newContent.personal object
        newContent.personal.birth_date = personal?.birth_date.toString() ?? null;
        newContent.personal.gender = personal?.gender.toString() ?? null;
        newContent.personal.marital = personal?.marital.toString() ?? null;
        fsx.writeFileSync(path.join(__dirname, "../../../public/APP/content.json"), JSON.stringify(newContent));
        response({
            res, success: true, sCode: 200, message: "get content", data: { msg: ["صفحه رزومه با موفقیت آپدیت شد"] },
            req, type: "redirect-nodb", view: "/edit/content"
        });
    }

    async logout(req: Express.Request, res: Express.Response): Promise<void> {
        res.cookie("x-auth-token", "", { maxAge: Date.now() - 100000 });
        response({
            res, message: "logout user", data: { msg: ["کاربر از صفحه ویرایش لاگ اوت شد"] },
            req, type: "redirect-nodb", view: "/login"
        });
    }

})();