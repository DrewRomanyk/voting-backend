import * as bodyParser from "body-parser";
import * as express from "express";
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
    }

    private routes(): void {
        const BASE_URL = "/api";
        this.express.get("/", (_, res) =>
            res.status(200).send({
                status: "Welcome to the Voting Backend!",
            }),
        );
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
