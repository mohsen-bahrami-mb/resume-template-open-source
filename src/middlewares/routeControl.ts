// import controllers
// import middlewares
import checkRoute from "./configuration/routeControlConfiguration";
// import models
// import module types
import Express from "express";

export async function accessRoute(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    const routeRegExp = req.originalUrl.replace(/(.*\/.*)(\?.*=.*)$/g, "$1").replace(/\/$/g, "");
    const result = await checkRoute(req, res, routeRegExp);
    if (result) next();
}

export async function accessRouteParam(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    const routeRegExp = req.originalUrl.replace(/(.*\/.*)(\?.*=.*)$/g, "$1");
    const routePatern = routeRegExp.substring(0, (routeRegExp.length - req.path.length)) + req.route.path;
    const result = await checkRoute(req, res, routePatern);
    if (result) next();
}