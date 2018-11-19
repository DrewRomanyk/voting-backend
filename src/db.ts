import chalk from "chalk";
import { Sequelize } from "sequelize-typescript";

import config from "./config";

export const createModels = (): Sequelize => {
    const sequelize = new Sequelize({
        url: config.db.uri,
        dialect: "postgres",
        port: 5432,
        operatorsAliases: false,
        timezone: "+00:00",
        logging: false,
    });
    sequelize.addModels([__dirname + "\\models"]);

    sequelize.authenticate()
    .then(() => {
        // tslint:disable-next-line:no-console
        console.log("Database connection:", chalk.greenBright("SUCCESS"));
    })
    .catch((error) => {
        // tslint:disable-next-line:no-console
        console.log("Database connection:", chalk.redBright("ERROR"), error);
    });

    return sequelize;
};
