// import modules
import autoBind from "auto-bind";
// import controllers
import response from "../controllers/response";
import checkValidateErr from "../controllers/validator";
import { createUsername } from "../controllers/createUniqueName";
import devicesLimit from "../controllers/devicesLimit";
import checkJwt from "../controllers/checkJwt";
import { createSession, updateSession, logout } from "../controllers/session";
import { updateSelfAccount, updateOtherAccount } from "../controllers/account";
import { createRoute, updateRoute, getManyRoute, getOneRoute, deleteOneRoute } from "../controllers/route";
import { deleteProfilePhoto, renameOne, readDir, createDir, deleteOne, copyOne } from "../controllers/file";
// import middlewares
// import modules types
// import models

// export other modules
export {
    response, checkValidateErr, createUsername, createSession, updateSession, logout, updateSelfAccount, updateOtherAccount,
    devicesLimit, checkJwt, createRoute, updateRoute, getManyRoute, getOneRoute, deleteOneRoute, deleteProfilePhoto,
    renameOne, readDir, createDir, deleteOne, copyOne
};

// export main modules
export default class {
    constructor() {
        /**
         * "auto-bind" package:
         * bind "this" to middlewares functionality, when use in routes.
         * when use "this" at Inheritance,
         * needs to use this "Class" to run these functions or any functions in childerns.
        */
        autoBind(this);
        () => { }
    }
}