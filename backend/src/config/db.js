const pgPromise = require('pg-promise');
require('dotenv').config();

const pgp = pgPromise();

const db = pgp({
  connectionString: `postgresql://postgres:1234@${process.env.POSTGRES_DB}:5432/postgres`,
});

module.exports = db;
