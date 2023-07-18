// import modules
import express from "express";
import controller from "./controller";
// import middleware modules
// import modules types


const router = express.Router();

router.get("/home", controller.redirectToHome);
router.get("/", controller.redirectToResume);
router.get("/resume", controller.getResume);

export default router;

