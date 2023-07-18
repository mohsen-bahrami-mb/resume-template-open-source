// import modules types
import Express from "express";
import Mongoose from "mongoose";

export type UpdateRoute = {
    // type for send updateRoute. the method is in "/controller/route.ts".
    route: string | RegExp;
    newRoutePath?: string;
    newType?: "main" | "dynamic";
    is_protect_user?: boolean;
    users?: { operate: "add" | "remove", users: Mongoose.Types.ObjectId[] };
    content?: string;
}

export type Route = {
    // type for send aRoute  in global Express.Requset.
    access?: boolean;
    route?: string;
    issue?: string[];
    type?: string;
    is_protect_user?: boolean;
    users?: any[];
    content?: string;
}