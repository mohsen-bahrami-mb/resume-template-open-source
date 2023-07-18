// import modules
import express from "express";
import controller from "./controller";
// import middleware modules
import { accessRoute, accessRouteParam } from "../../middlewares/routeControl";
import { uploadFileManager } from "../../middlewares/upload";
// import modules types

/** This route add in other routes, like `owner` or `admin`,
 *  actually it doesn't a alone route, it's DEPENDENT route. */
const router = express.Router();

// file manager routes
router.get("/api/dir/:dir_path?", /** accessRouteParam, */ controller.APIGetOne);
router.get("/dir/:dir_path?", /** accessRouteParam, */ controller.getOne);
router.post("/dir/:dir_path?", /** accessRouteParam, */ uploadFileManager, controller.posCreateOne);
router.put("/dir/:dir_path?", /** accessRouteParam, */ controller.putRenameOne);
router.delete("/dir/:dir_path?", /** accessRouteParam, */ controller.deleteOne);
// copy oprator
router.post("/copy/:dir_path?", /** accessRouteParam, */ controller.postCopyOne);

export default router;

