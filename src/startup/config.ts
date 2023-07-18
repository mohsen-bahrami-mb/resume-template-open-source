// import modules
import path from "path";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import methodOverride from "method-override";
import requestIp from "request-ip";
import cookieParser from "cookie-parser";
import { allowCORS, extractJSON, helmetConfig } from "./configuration/appConfigSecurity";
// import middlewares
import content from "../middlewares/content";
// import modules types
import Express from "express";
import { CorsOptions } from "cors";

export default function (app: Express.Application): void {
    app.use(helmet(helmetConfig));
    app.use(requestIp.mw());
    app.use(cors(allowCORS as CorsOptions));
    app.use(express.json(extractJSON));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "../../public")));
    app.use(methodOverride("method"));
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "../../views"));
    app.use(cookieParser(process.env.C_S_SECRET));
    app.use((req, res, next) => { req.user = {}; req.aRoute = {}; next(); });       // add fist
    // app.use(content);                                                            // add second
}