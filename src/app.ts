import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as logger from "morgan";

import config from "./config";
import { IJwtPayload } from "./models/user";
import resolvers from "./rootResolver";
import typeDefs from "./rootTypeDefs";

export interface IGraphQlContext {
    user: IJwtPayload;
}

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.graphql();
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
        const BASE_URL = "/";
        this.express.get(BASE_URL, (_, res) =>
            res.status(200).send({
                status: "Welcome to the Voting Backend!",
            }),
        );
    }

    private graphql(): void {
        const graphQLUriPath = "/graphql";

        const graphQL = new ApolloServer({
            schema: makeExecutableSchema({
                typeDefs,
                resolvers,
            }),
            context: ({req}) => {
                const token = req.headers.authorization || "";
                let jwtPayload: IJwtPayload;
                jwt.verify(token, config.jwt.secret, (_, jwtData) => {
                    jwtPayload = jwtData;
                });
                const context: IGraphQlContext = {
                    user: jwtPayload,
                };
                return context;
            },
        });
        graphQL.applyMiddleware({
            app: this.express,
            path: graphQLUriPath,
        });
    }
}

export default new App().express;
