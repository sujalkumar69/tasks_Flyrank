const express = require('express');
const Database = require('better-sqlite3');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Serve Swagger UI documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Open / Create SQLite database file tasks.db
const db = new Database('tasks.db');

// Create 'tasks' table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

// Seed 3 example tasks ONLY if the table is empty
const rowCount = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;
if (rowCount === 0) {
  const insertStmt = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insertStmt.run('Learn Express', 0);
  insertStmt.run('Build CRUD API', 0);
  insertStmt.run('Test the API', 1);
  console.log('Seeded 3 initial tasks into SQLite database.');
}

// GET / -> Root endpoint returning API information
app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

// GET /health -> Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: "ok"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger UI documentation available at http://localhost:${PORT}/docs`);
});
