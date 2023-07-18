// import modules
import express from "express";
// import routes
import homeRouter from "./home";
import editRouter from "./edit";
import loginRouter from "./login";
import notFoundRouter from "./notFound";
// import anyRouter from "./any";
// import middleware
import errorApp from "../middlewares/error";
import session from "../middlewares/session";
import isLogin from "../middlewares/isLogin";
import isUnknownUser from "../middlewares/isUnknownUser";
import { accessRoute } from "../middlewares/routeControl";
// import types


const router = express.Router();
// add session to all routes
// router.use(session)
// call routers
router.use("/", homeRouter);
router.use("/edit", isLogin, editRouter);
router.use("/login", isUnknownUser, loginRouter);
// router.use("/any", anyRouter);

router.use("/*", notFoundRouter);
router.use(errorApp);

export default router;