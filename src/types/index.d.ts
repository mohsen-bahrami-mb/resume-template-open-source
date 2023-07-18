/** add variables to global object
 * use "var" insted "const" or "let"
 * if use ts-node needs: add --files flag >> ts-node --files ./index.ts
 * if use nodemon, needs to set "nodemonConfig"
 * if it doesn't work, set this in "tsconfig.json" >> "typeRoots": ["./node_modules/@types", "./types"],
*/

import { User, Session, Content } from "./requestProcessor";
import { Route } from "./routeController";

/* eslint-disable no-var */
declare global {
    var appRoutes: any[];
    namespace Express {
        export interface Request {
            user: User;
            session: Session;                                                       /** delete in this project */
            /** This is an ASYNC FUNCTION!!! It returns an object
             * @function req.content() >> Returns all content as an object 
             * @function req.content(string) >> Write "content key" as a string, to parse its value. If want to set more than one key, write all of them and separate with a white space.
             * @function req.content(object) >> set content object with key(property) and value 
            */
            content: Content;                                                       /** delete in this project */
            aRoute: Route;                                                          /** delete in this project */
        }
    }
}

export { };
