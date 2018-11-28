import * as bodyParser from "body-parser";
import * as express from "express";
import * as i18next from "i18next";
import * as i18nextBackend from "i18next-node-fs-backend";
import * as i18nextMiddleware from "i18next-express-middleware";

import * as logger from "morgan";
import { Sequelize } from "sequelize-typescript";

import categoryRouter from "./routes/category";
import userRouter from "./routes/user";
import { createModels } from "./db";

class App {
    public express: express.Application;
    public db: Sequelize;

    constructor() {
        this.express = express();
        this.db = createModels();
        this.db.sync();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.express.use(logger("dev"));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use((_, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept",
            );
            next();
        });
        i18next.use(i18nextBackend).use(i18nextMiddleware.LanguageDetector).init({
            backend: {
                loadPath: __dirname + "/../locales/{{lng}}/{{ns}}.json",
                addPath: __dirname + "/../locales/{{lng}}/{{ns}}.missing.json",
            },
            fallbackLng: "en",
            preload: ["en", "es"],
            saveMissing: true,
        });
        this.express.use(i18nextMiddleware.handle(i18next));
    }

    private routes(): void {
        const BASE_URL = "/api";
        this.express.get("/", (req, res) => {
            res.status(200).send({
                status: req.t("base.welcome"),
            });
        });
        this.express.get(BASE_URL, (_, res) =>
            res.status(200).send({
                status: "Welcome to the Voting Backend API!",
            }),
        );
        this.express.use(`${BASE_URL}/category`, categoryRouter);
        this.express.use(`${BASE_URL}/user`, userRouter);
    }
}

export default new App().express;
