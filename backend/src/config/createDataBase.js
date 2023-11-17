const pgPromise = require('pg-promise');
const db = require('./db');

async function createTables() {
  try {

    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        birthday DATE NOT NULL,
        phone_number VARCHAR(15) NOT NULL,
        password VARCHAR(255) NOT NULL,
        picture VARCHAR(255)
      )
    `);

    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

module.exports = createTables;