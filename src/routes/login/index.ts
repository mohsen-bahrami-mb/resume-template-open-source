// import modules
import express from "express";
import controller from "./controller";
// import middleware modules
// import modules types


const router = express.Router();

router.get("/", controller.getLogin);
router.post("/", controller.postLogin);

export default router;

