import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";

import auth from "./routes/auth";
import candidateRouter from "./routes/candidate";
// import categoryRouter from "./routes/category";
// import issueRouter from "./routes/issue";
// import partyRouter from "./routes/party";
// import positionRouter from "./routes/position";
// import topicRouter from "./routes/topic";
// import topicSummaryRouter from "./routes/topicSummary";
// import userRouter from "./routes/user";

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
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
        this.express.get(BASE_URL, (_, res) =>
            res.status(200).send({
                status: "Welcome to the Voting Backend!",
            }),
        );
        this.express.use(`${BASE_URL}/auth`, auth.router);
        //this.express.use(`${BASE_URL}/category`, categoryRouter);
        // this.express.use(`${BASE_URL}/topic`, topicRouter);
        // this.express.use(`${BASE_URL}/issue`, issueRouter);
        this.express.use(`${BASE_URL}/candidate`, candidateRouter);
        // this.express.use(`${BASE_URL}/topic_summary`, topicSummaryRouter);
        // this.express.use(`${BASE_URL}/position`, positionRouter);
        // this.express.use(`${BASE_URL}/party`, partyRouter);
        // this.express.use(`${BASE_URL}/user`, auth.authorize, userRouter);
    }
}

export default new App().express;
