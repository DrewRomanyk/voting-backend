import * as pgPromise from "pg-promise";
import config from "./config";

const pgp: pgPromise.IMain = pgPromise();
// Ensures that date & timestamps remain as ISO rather than javascript date
// https://github.com/brianc/node-pg-types/blob/master/lib/textParsers.js
pgp.pg.types.setTypeParser(1082, (val) => String(val)); // date
pgp.pg.types.setTypeParser(1184, (val) => String(val)); // timestamp /w timezone
const db: pgPromise.IDatabase<any> = pgp(config.db.uri);

export default db;
