// config environment variables
import * as dotenv from "dotenv";
dotenv.config();
// handle all errors, insted of "try-catch"
import "express-async-errors";
// create "logfile.log" & { logger } objcet
import "./startup/logger";
// import modules
import express from "express";
import debug from "debug";
import appConfig from "./startup/config";
// import db from "./startup/db";
import { createAppRoutes } from "./startup/checkRoute";
import router from "./routes";
// import controller
// import acceptFMDB from "./controllers/file";

// start app with these funcrion modules
const mainDebug = debug("app:main");
const app = express();
appConfig(app);
// db();
// accept file manager database
// acceptFMDB();

// checkMainRoute(mainRoute, false);
// checkMainRoute(mainRouteProtect, true);

// routes director
app.use("/", router);
createAppRoutes();

const port = process.env.PORT || 5000;
app.listen(port, () => mainDebug(`listen to port ${port}`));