// import controller
import { checkValidateErr } from "../controller";
// import modules
// import types
import Express from "express";

export default class {
    // make all route validator

    static async anyValidator(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
        let err: string[] = [];
        let { } = req.body;
        (async () => {
            new Promise((resolve, reject) => {
                if ("" === "") resolve(true);
                else reject("contact should be an object");
            }).catch((v) => { err.push(v) });
        })().finally(() => checkValidateErr(req, res, next, err) );
    }
};