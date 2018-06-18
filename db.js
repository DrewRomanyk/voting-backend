const pgp = require("pg-promise")();
const config = require("./config");

const db = pgp(config.db.uri);

module.exports = db;
