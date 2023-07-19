// import modules
import { logger } from "../logger";
// import middlewares
import { response } from "../../routes/controller";
// import modules types
import Express from "express";
import requestIp from "request-ip"

/** allowCORS module - start */
// get white list of environment variables
const allowString: string = <string>process.env.CORS_ALLOW_ORIGIN;
const CORSwhiteList: string[] = allowString.split(",");

export const allowCORS = {
    origin: function (origin: string, callBack: (err: null | string, state?: boolean) => void) {
        // a function to check origin in CORS process
        if (CORSwhiteList.indexOf(origin) !== -1 || CORSwhiteList.indexOf("*") !== -1) callBack(null, true);
        else callBack(`Not allowed by CORS: ${origin}`);
    }
};
/** allowCORS module - end */

/** helmet config module - start */
export const helmetConfig = {
    contentSecurityPolicy: {
        directives: {
            'script-src': ["'self'", <string>process.env.Content_Security_Policy_script_src],
            'img-src': "'self' https: data:",
            'media-src': "'self' https: data:"
        }
    }
};
/** helmet config module - end */

/** extractJSON module - start */
export const extractJSON = {
    verify: function (
        // check json. is it json?
        req: Express.Request & requestIp.Request,
        res: Express.Response,
        buf: Buffer,
        encoding: string
    ) {
        new Promise((resolve, reject) => {
            if (JSON.parse(buf.toString())) resolve(true);
            else reject(false);
        })
            .then((v) => { })
            .catch((err) => {
                // send ip and error to log file. then return a appropriate response
                logger.error({
                    label: "WRONG JSON",
                    message: `ip: (${req.clientIp}) try to send wrong json - ${err.stack}`
                });
                return response({
                    res, sCode: 422, success: false, message: "server resive wrog json",
                    data: { err: [process.env.NODE_ENV === "development" ? err.stack : err.message] },
                    req, type: "render", view: "errors/serverError"
                })
            });
    }
};
/** extractJSON module - end */
