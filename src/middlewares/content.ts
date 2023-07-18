// import module types
import Express from "express";
// import models
import Session from "../models/session";
// import controllers
import { createSession, updateSession } from "../routes/controller";

/**
 * pass `content` module as middleware before all routes. this module create:
 * @create `req.session` object
 * @create `req.content` function
 * then this middleware needs `session` in database. use `session` middleware before routes.
 * @CAREFUL if app has some code files in public, they are not use this module. then to filter all of public files befor call `session` middleware, WRITE all of them in `/src/startup/checkRoute > publicRoute`
*/
export default async function content(
    req: Express.Request, res: Express.Response, next: Express.NextFunction,
) {
    // create session object in req
    req.session = {};
    // create content function in req
    /** This is an ASYNC FUNCTION!!! It returns an object
     * @function req.content() >> Returns all content as an object 
     * @function req.content(string) >> Write "content key" as a string, to parse its value. If want to set more than one key, write all of them and separate with a white space.
     * @function req.content(object) >> set content object with key(property) and value 
    */
    req.content = async function (content?: { [key: string]: any } | string): Promise<void | { [key: string]: any }> {
        if (typeof content === "object") {
            // set content
            const newContent = content
            const contentStr = JSON.stringify(newContent);
            // update or create session with this content
            const session = await Session.findById(req.session.id);
            req.session.issue = "set-content";
            if (!session) {
                await createSession(req, res);
            }
            else {
                await updateSession(req, res, session, false, contentStr);
            }
        }
        if (typeof content === "string") {
            // get content
            let keys = content.split(" ").filter(v => v !== "");
            const newContent: { [key: string]: any } = {};
            keys.forEach((c: string) => newContent[c] = req.session.content?.[c]);
            // (remove this line, becouse has error when repeat reload fastly)
            // req.session.issue = "get-content";
            // const session = await Session.findById(req.session.id)
            // await updateSession(req, res, session, false, "{}");
            req.session.content = newContent;
            return newContent;
        }
        // get the object data
        return req.session?.content;
    }
    next();
}