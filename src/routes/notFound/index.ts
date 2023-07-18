// import modules
import express from "express";
import controller from "./controller";
// import middleware modules
// import modules types


const router = express.Router();

router.all("/", controller.notFound);

export default router;

