// import modules
import express from "express";
import controller from "./controller";
import validator from "./validator";
// import route
import fileManagerRouter from "../file-manager";
// import middleware
// import types


const router = express.Router();

router.get("/", controller.redirectToEditContent);
router.get("/content", controller.getContent);
router.put("/content", validator.contentValidator, controller.putContent);
router.post("/logout", controller.logout);
router.use("/file-manager", fileManagerRouter);

export default router;

