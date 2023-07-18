// import modules
import jwt from "jsonwebtoken";
// import models
import Session from "../models/session";
// import types

export default async function checkJwt(token?: string) {
    let result;
    if (!token) {
        return result = {
            session: undefined,
            clearCookie: false,
            message: "has no token"
        }
    } else {
        let decoded: string | jwt.JwtPayload;
        try {
            decoded = await <jwt.JwtPayload>jwt.verify(token, <string>process.env.JWT_SESSION_KEY);
        } catch {
            return result = {
                session: undefined,
                clearCookie: true,
                message: "wrong token"
            }
        }
        // check "user_id" & "is_login"
        const session = await Session.findById(decoded.session_id);
        if (!session) return result = {
            session: undefined,
            clearCookie: true,
            message: "invalide token"
        }
        return result = {
            session,
            clearCookie: false,
            message: "session token"
        }
    }
}