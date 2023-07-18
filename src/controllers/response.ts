// import modules
// import middlewares
// import modules types
import * as AppType from "../types/appType";

/** A controller to send response in certain structure
 * @param view If ("type" == notSet | "json" ) >> in defaul is JSON response (res.json).
 * @param view If ("type" == "render") >> set "req" property. then set view file ".ejs" from "views" directory on "view" property (res.render). 
 * @param view If ("type" == "redirect") >> set "req" property. then set "route" or "url" on "view" property (res.redirect). 
 * @param success It is "string", when: type = "redirect". And it is "boolean" when: type: "render" or "json"
 * @param data It is "string", when >> type = "redirect". And it is "js object" when: type: "render" or "json"
*/
export default function response({
    res, success = true, sCode = 200,
    message, data,
    req, type = "json", view
}: AppType.AppResponse): void {
    if (type === "json") {
        // send JSON response
        res.status(sCode).json({ message, success, data });
    }
    else if (req && type === "render" && typeof view === "string") {
        // send RENDER response
        (async () => {
            // set content on session
            return await req?.content("message success data");
        })().then(v => {
            // send response
            res.status(sCode).render(view, {
                message: v?.message ? v.message : message,
                success: v?.success ? v.success : success,
                data: v?.data ? { ...data, ...v.data } : data
            });
        });
    }
    else if (req && type === "redirect" && typeof view === "string") {
        // send REDIRECT response
        (async () => {
            // set content on session
            return await req?.content({ message, success, data });
        })().then(v => {
            // send response
            res.status(sCode).redirect(view);
        });
    }
    else if (req && type === "render-nodb" && typeof view === "string") {
        // send RENDER response (no database data!!!)
        res.status(sCode).render(view, {message, success, data });
    }
    else if (req && type === "redirect-nodb" && typeof view === "string") {
        // send REDIRECT response (no database data!!!)
        res.status(sCode).redirect(view);
    }
    else {
        // send ERROR on concole, when use wrong of this function
        throw new Error(`received wrong response function - please check properties: 
            > for json response at least you need to: { res }
            > for render response at least you need to: { res, type: "render", view: </route>}
            > for redirect response at least you need to: { req, res, type: "redirect", view: <view file>}
        `)
    }

}