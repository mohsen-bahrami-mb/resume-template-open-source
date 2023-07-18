// import modules
import { publicRoute } from "../startup/checkRoute";
// import controllers
import { checkJwt, createSession, updateSession } from "../routes/controller";
// import types
import Express from "express";

/** This middleware check all session for all user. Even the  guest users. */
export default async function session(
    req: Express.Request, res: Express.Response, next: Express.NextFunction,
): Promise<void> {
    // check is app route
    let isAppRoute = false;
    globalThis.appRoutes.forEach(r => { if (r.exec(req.originalUrl)?.[0]) isAppRoute = true; });
    if (!isAppRoute) return next();
    // // check is public route (if top way it does not work use this)
    // let isPublicRoute = false;
    // publicRoutes.forEach((r: any) => { if (req.originalUrl.match(r)) isPublicRoute = true; });
    // if (isPublicRoute) return next();

    // check token and session
    const token = await req.cookies["x-auth-token"];
    if (token) {
        const { session, clearCookie } = await checkJwt(token);
        if (clearCookie) res.cookie("x-auth-token", "", { maxAge: Date.now() });
        if (session) {
            await updateSession(req, res, session, true);
            next();
        } else {
            await createSession(req, res, true);
            next();
        }
    } else {
        await createSession(req, res, true);
        next();
    }
}