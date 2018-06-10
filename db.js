const pgp = require('pg-promise')();
const secrets = require('./secrets');

const db = pgp(secrets.db.connectionUrl);

module.exports = db;