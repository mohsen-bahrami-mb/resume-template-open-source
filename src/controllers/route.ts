// import controllers
// import models
import User from "../models/user";
import Route from "../models/route";
// import module types
import Express from "express";
import { UpdateRoute } from "../types/appType";

/** Create Route function
 * @arguments `route`, `type` and `content` are necessary.
 * @param type `main` type is what routes are create in app. `dynamic` type is what routes are create by `owner`, `admins` or `usesrs`.
 * @param content All data for a route in there. SUGGEST: set a JSON for main type routes, set HTML for dynamic type routes.
 * @param is_protect_user If set `true`, should add which users has access in to this route in `updateRoute` function. 
 * @by_default `is_protect_user:false` . Also `owner` roule and who user create this route has access (when `is_protect_user:false`, `users` in `updateRoute` have no effect).
 * @param req If you want to read `req.user.id`, set this one. 
 * @return : {route: `newRoute | undefined`, message: `string`}
*/
export async function createRoute(
    route: string, type: "main" | "dynamic", content: string, is_protect_user = false, req?: Express.Request
) {
    // set users who have access
    const owner = await User.findOne({ role: "owner" });
    if (!owner) return { route: undefined, message: `cannot find owner - 'createRoute' failed - route: ${route}` }
    const users = req && req.user.id && req.user.id != (owner?.id) ? [owner?.id, req.user.id] : [owner?.id];
    // check route already is in database
    const hasRoute = await Route.findOne({ route });
    if (hasRoute) return { route: undefined, message: `failed to create new route: "${route}" - it was already in database` };
    // create new route in 
    const newRoute = new Route({ issue: ["create"], route, type, is_protect_user, users, content });
    await newRoute.save();
    return { route: newRoute, message: "successfully create new route" };
}

/** Update Route function. it gets an object.
 * @property `route` is necessary.
 * @param newRoutePath has accessibility to change `route path`
 * @param newType `main` type is what routes are create in app. `dynamic` type is what routes are create by `owner`, `admins` or `usesrs`.
 * @param content All data for a route in there. SUGGEST: set a JSON for main type routes, set HTML for dynamic type routes.
 * @param is_protect_user If set `true`, should add which users has access in to this route in `users` property.
 * @param users Set which user has access to this route in an `array`
 * @by_default `owner` roule and who user create this route has access (when `is_protect_user:false`, `users` have no effect). You can change it.
 * @return : {route: `updateRouteObject | undefined`, message: `string`}
*/
export async function updateRoute({ route, newRoutePath, newType, is_protect_user, users, content }: UpdateRoute) {
    const updateRoute = await Route.findOne({ route });
    if (!updateRoute) return { route: undefined, message: "not found route to update" };
    updateRoute.route = newRoutePath ?? updateRoute.route;
    updateRoute.type = newType ?? updateRoute.type;
    updateRoute.issue.push("update");
    if (updateRoute.issue.length > 25) updateRoute.issue.splice(0, (updateRoute.issue.length - 25));
    updateRoute.is_protect_user = is_protect_user ?? updateRoute.is_protect_user;
    if (users?.operate === "add") updateRoute.users = [...updateRoute.users, ...users.users];
    if (users?.operate === "remove") updateRoute.users =
        updateRoute.users.filter(u => !users.users.map(us => us.toString()).includes(u.toString()));
    updateRoute.content = content ?? updateRoute.content;
    await updateRoute.save();
    return { route: updateRoute, message: "successfully update route" };
}

/** Get One Route function
 * @arguments `route` is necessary.
 * @return : {route: `getOneRoute | undefined`, message: `string`}
*/
export async function getOneRoute(route: string | RegExp) {
    const getOneRoute = await Route.findOne({ route });
    if (!getOneRoute) return { route: undefined, message: `not found route in database: ${route}` };
    const users = await User.find({ _id: { $in: getOneRoute.users } })
        .select("_id username first_name last_name phone email role");
    return { route: getOneRoute, users, message: `successfully get route ${route}` };
}

/** Get all Route function
 * @arguments `sort` its necessary. `1` returns `a` before `b`. `-1` returns `b` before `a`
 * @return : {route: `getAllRoute | undefined`, message: `string`}
*/
export async function getManyRoute(sort: 1 | -1, routeQuery = {}, skip = 0, limit = 0) {
    const getAllRoute = await Route.find(routeQuery).sort({ route: sort }).skip(skip).limit(limit);
    if (!getAllRoute) return { route: undefined, message: "not found any route to get" };
    return { route: getAllRoute, message: "successfully get all route" };
}

/** Delete One Route function
 * @arguments `route` is necessary.
 * @return : {route: `deleteOneRoute | undefined`, message: `string`}
*/
export async function deleteOneRoute(route: string | RegExp) {
    const deleteOneRoute = await Route.findOneAndDelete({ route });
    if (!deleteOneRoute) return { route: undefined, message: "not found route to delete" };
    return { route: deleteOneRoute, message: "successfully delete route" };
}