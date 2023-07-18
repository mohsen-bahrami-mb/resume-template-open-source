// import modules
import Controller from "../controller";
// import middleware modules
import { response } from "../controller";
// import modules types
import Express from "express";

export default new (class extends Controller {
    // make all route logic as middleware function

    async getAny(req: Express.Request, res: Express.Response): Promise<void> {
        response({ res, success: true, sCode: 200, message: "we are good!", data: {} })
    }

})();