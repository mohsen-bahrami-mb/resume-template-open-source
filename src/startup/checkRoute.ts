// import modules
import debug from "debug";
import router from "../routes";
// import controllers
import { createRoute } from "../routes/controller";

const mainDebug = debug("app:main");

export const publicRoute = [
    "/style.css", "/script.js", "/bootstrap@5.3.0/bootstrap.bundle.min.js",
    "/bootstrap@5.3.0/bootstrap.bundle.js", "/bootstrap@5.3.0/bootstrap.min.css", "/bootstrap@5.3.0/bootstrap.css"
];
export const mainRoute = [
    "",                                       /** html content: ""   */
    "",                                                         /** json content: "{}" */
    "",                                                         /** json content: "{}" */ /** It self is JSON, but it controls a route has HTML content*/
];
export const mainRouteProtect = [];
export const dynamicRouteProtect = [];

export default async function checkMainRoute(route: string[], is_protect_user: boolean) {
    const uniqueIndex = route.filter((v, i, arr) => v !== "" && arr.indexOf(v) === i);
    const checkMainRoute = await Promise.all(uniqueIndex.map(async (r) => {
        // const content = r === "/" ? "" : "{}";
        const content = "{}";
        console.log(uniqueIndex)
        return await createRoute(r, "main", content, is_protect_user);
    }));
    const failedRoute = checkMainRoute.filter(r => r.route === undefined);
    if (failedRoute.length) {
        const errMessage = failedRoute.map((f, i) => (i + " - " + f.message));
        mainDebug(errMessage);
    }
}

globalThis.appRoutes = [];
export function createAppRoutes() {
    // check routes in layer level 1
    router.stack.forEach(({ route, handle, name, ...rest }) => {
        let mainRoute: RegExp | undefined = undefined;
        if (new RegExp(rest.regexp).exec("/^\/(.*)\/?(?=\/|$)/i")?.[0]) return;
        else mainRoute = new RegExp(rest.regexp);
        globalThis.appRoutes.push(new RegExp(mainRoute));
        // check routes in layer level 2
        if (handle.stack) handle.stack.forEach(({ route, handle, name, ...rest }: { [key: string]: any }) => {
            let mainString = mainRoute?.source.split("?");
            let continueRoute = new RegExp(rest.regexp);
            let continueString = new RegExp(rest.regexp).source.replace("^\\/", "");
            const newReg = new RegExp(mainString?.[0] + continueString, continueRoute.flags);
            if (rest.regexp) globalThis.appRoutes.push(newReg);
            // check routes in layer level 3
            if (handle.stack) handle.stack.forEach(({ route, handle, name, ...rest }: { [key: string]: any }) => {
                let mainString = newReg.source.split("?");
                let continueRoute = new RegExp(rest.regexp);
                let continueString = new RegExp(rest.regexp).source.replace("^\\/", "");
                const newReg2 = new RegExp(mainString?.[0] + continueString, continueRoute.flags);
                if (rest.regexp) globalThis.appRoutes.push(newReg2);
                // if had over layer level, add to this place and do it to last layer level 
                // check routes in layer level 4 ...
            });
        });
    })
}