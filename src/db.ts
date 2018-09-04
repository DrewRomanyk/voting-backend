import * as pgPromise from "pg-promise";
import config from "./config";

const pgp: pgPromise.IMain = pgPromise();
const db: pgPromise.IDatabase<any> = pgp(config.db.uri);

export default db;
