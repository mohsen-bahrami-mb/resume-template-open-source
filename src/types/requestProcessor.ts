// import modules types
import Express from "express";
import Mongoose from "mongoose";

export type AppResponse = {
    // type for send response. the method is in "/routes/controller.ts".
    res: Express.Response;
    success?: boolean;
    sCode?: number;
    message?: string;
    data?: {};
    req?: Express.Request;
    type?: "json" | "render" | "redirect" | "render-nodb" | "redirect-nodb";
    view?: string;
}

export type User = {
    // User types model for req.user
    id?: Mongoose.Types.ObjectId | string;
    username?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    phone?: string;
    email?: string;
    role?: string;
    verify?: string[];
    profile_photo?: string;
    birth_date?: Date;
    country?: string;
    description?: string;
}

export type Session = {
    // Session types model for req.uSession
    id?: Mongoose.Types.ObjectId | string;
    user_id?: Mongoose.Types.ObjectId | string;
    expire_session?: Date;
    issue?: "register" | "login" | "logout" | "visit" | "set-content" | "get-content";
    is_login?: boolean;
    device?: string;
    ip?: string;
    content?: { [key: string]: any }
}

//  for req.sContent
export type Content = (content?: { [key: string]: any } | string) => Promise<void | { [key: string]: any }> ;