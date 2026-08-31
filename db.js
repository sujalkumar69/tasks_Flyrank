require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:dev@localhost:5432/tasks',
});

/**
 * Initializes database schema and seeds initial data if table is empty.
 */
async function initDb() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT FALSE
    );
  `;
  await pool.query(createTableQuery);

  const countResult = await pool.query('SELECT COUNT(*) FROM tasks');
  const count = parseInt(countResult.rows[0].count, 10);

  if (count === 0) {
    const seedQuery = `
      INSERT INTO tasks (title, done) VALUES 
      ('Learn Express', false),
      ('Build CRUD API', false),
      ('Test the API', true);
    `;
    await pool.query(seedQuery);
    console.log('Seeded 3 initial tasks into PostgreSQL database.');
  }
}

module.exports = {
  pool,
  initDb,
};
