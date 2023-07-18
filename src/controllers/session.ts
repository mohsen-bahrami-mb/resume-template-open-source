// import models
import jwt from "jsonwebtoken";
import Session from "../models/session";
// import types
import Express from "express";
import Mongoose from "mongoose";

const expireTime = 1000 * 3600 * 24 * 60;

/** Before call this function, set >> 
 * @property "req.user.id"=ObjectId<User>, to set session.user_id.
 * @property "req.session.is_login"= [true | false]. By default it's false. To set user session state in login.
 * @property "req.session.issue"= ["register" | "login" | "visit"]. By default it's "visit".
 * @param setCookie To set cookie in res, automaticly. By defalet its false and deosn't send cookie.
 * @param session_content it's optional argument for set content in session as a string.
*/
export async function createSession(
    req: Express.Request, res: Express.Response, setCookie: boolean = false, session_content?: string
): Promise<void> {
    let user_id: Mongoose.Types.ObjectId | string | undefined;
    // set user_id for session
    if (req.user.id) user_id = req.user.id;
    // create session in db
    const newSession = new Session({
        user_id,
        is_login: req.session.is_login ?? false,
        expire_session: new Date(Date.now() + expireTime),
        issue: [(req.session.issue ?? "visit")],
        device: req.headers["user-agent"] ?? "unknown",
        ip: req.clientIp ?? "unknown",
        content: session_content
    });
    await newSession.save();
    // set session in req
    req.session = {
        issue: req.session.issue ?? "visit",
        is_login: req.session.is_login,
        id: newSession.id,
        expire_session: newSession.expire_session,
        device: newSession.device,
        ip: newSession.ip,
        user_id: newSession.user_id,
        content: JSON.parse(newSession.content)
    }
    // update cookie from jwt
    if (!setCookie) return;
    const token = jwt.sign({ session_id: newSession.id }, <string>process.env.JWT_SESSION_KEY);
    res.cookie("x-auth-token", token, { maxAge: expireTime });
}

/** Before call this function, set >> 
 * @property "req.user.id"=ObjectId<User>, to set session.user_id.
 * @property "req.session.is_login"= [true | false]. By default it's false. To set user session state in login.
 * @property "req.session.issue"= ["register" | "login" | "visit"]. By default it's "visit".
 * @param session Should define which session will update. Get this one from the database<Session.
 * @param setCookie To set cookie in res, automaticly. By defalet its false and deosn't send cookie.
 * @param session_content it's optional argument for set content in session as a string.
*/
export async function updateSession(
    req: Express.Request, res: Express.Response, session: any, setCookie: boolean = false, session_content?: string
): Promise<void> {
    // let is_login: boolean = false;
    // (add this line, becouse has error when repeat reload fastly)
    const contentString = session.content;
    // check expire time
    if (session.expire_session < new Date()) {
        req.session.is_login = false;
        req.session.issue = "logout";
        session.is_login = false;
        session.issue.push("loguot");
        await session.save();
        res.cookie("x-auth-token", "", { maxAge: Date.now() })
        return;
    }
    // set session in db
    if (req.user.id) session.user_id = req.user.id;
    if (session.issue.length > 25) session.issue.splice(0, (session.issue.length - 25))
    session.expire_session = new Date(Date.now() + expireTime);
    session.issue.push((req.session.issue ?? "visit"));
    session.is_login = req.session.is_login ?? session.is_login;
    session.device = req.headers["user-agent"] ?? "unknown";
    session.ip = req.clientIp ?? "unknown";
    // (add "{}" insted of `session.content` , becouse has error when repeat reload fastly)
    session.content = session_content && session_content?.length ? session_content : "{}";
    await session.save();
    // set session in req
    req.session = {
        issue: req.session.issue ?? "visit",
        id: session.id,
        user_id: session.user_id,
        expire_session: session.expire_session,
        is_login: session.is_login,
        device: session.device,
        ip: session.ip,
        // (add this line, becouse has error when repeat reload fastly)
        content: JSON.parse(contentString)
        // (remove this line, becouse has error when repeat reload fastly)
        // content: JSON.parse(session.content)
    }
    if (req.session.user_id) req.user.id = req.session.user_id;
    // update cookie from jwt
    if (!setCookie) return;
    const token = await req.cookies["x-auth-token"];
    res.cookie("x-auth-token", token, { maxAge: expireTime });
}

/** This `async` function has this state for call:
 * @state1: set `req` >> @Do logout self account session
 * @state2: set `req`, `user_id`, `!session_id` >> @Do logout all other account session
 * @state2: set `req`, `user_id`, `session_id` >> @Do logout account, a target session
*/
export async function logout(
    req: Express.Request, user_id?: Mongoose.Types.ObjectId, session_id?: Mongoose.Types.ObjectId
): Promise<void> {
    // logout all other account session
    if (user_id && !session_id)
        await Session.updateMany({ user_id }, { $set: { is_login: false } }, { new: true });
    // logout account, a target session
    else if (user_id && session_id)
        await Session.updateOne({ user_id, _id: session_id }, { $set: { is_login: false } }, { new: true });
    // logout self account session
    else req.session.is_login = false;
}