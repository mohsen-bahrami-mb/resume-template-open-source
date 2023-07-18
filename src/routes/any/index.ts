// import modules
import express from "express";
import controller from "./controller";
import validator from "./validator";
// import middleware modules
// import modules types


const router = express.Router();

router.get("/",
    validator.anyValidator,
    controller.getAny
);

export default router;

