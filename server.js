require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve Swagger UI documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// GET / -> Root endpoint returning API information
app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    storage: "PostgreSQL",
    endpoints: ["/tasks", "/health", "/docs"]
  });
});

// GET /health -> Health check endpoint (verifies DB connectivity)
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: "ok",
      db: "ok"
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      db: "disconnected",
      error: err.message
    });
  }
});

// GET /tasks -> List all tasks from PostgreSQL database
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, done FROM tasks ORDER BY id ASC');
    const tasks = result.rows.map(r => ({
      id: r.id,
      title: r.title,
      done: Boolean(r.done)
    }));
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /tasks/:id -> Get task by ID using parameterized query ($1)
app.get('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    const result = await pool.query('SELECT id, title, done FROM tasks WHERE id = $1', [taskId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Task ${taskId} not found` });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      title: row.title,
      done: Boolean(row.done)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks -> Insert new task into PostgreSQL database
app.post('/tasks', async (req, res) => {
  const { title } = req.body;

  // Validation: title must exist, be a string, and not be empty/whitespace
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: "Title is required and cannot be empty or whitespace"
    });
  }

  const cleanTitle = title.trim();
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING id, title, done',
      [cleanTitle, false]
    );
    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      title: row.title,
      done: Boolean(row.done)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /tasks/:id -> Update task in PostgreSQL database
app.put('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    const checkResult = await pool.query('SELECT id, title, done FROM tasks WHERE id = $1', [taskId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: `Task ${taskId} not found` });
    }

    const row = checkResult.rows[0];
    const { title, done } = req.body;

    // Validation: at least one field must be provided
    if (title === undefined && done === undefined) {
      return res.status(400).json({
        error: "At least one field (title or done) must be provided for update"
      });
    }

    // Validate title if supplied
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          error: "Title cannot be empty or whitespace"
        });
      }
    }

    // Validate done if supplied
    if (done !== undefined) {
      if (typeof done !== 'boolean') {
        return res.status(400).json({
          error: "Done must be a boolean"
        });
      }
    }

    const newTitle = title !== undefined ? title.trim() : row.title;
    const newDone = done !== undefined ? done : row.done;

    const updateResult = await pool.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING id, title, done',
      [newTitle, newDone, taskId]
    );

    const updatedRow = updateResult.rows[0];
    res.json({
      id: updatedRow.id,
      title: updatedRow.title,
      done: Boolean(updatedRow.done)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tasks/:id -> Delete task from PostgreSQL database
app.delete('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    const deleteResult = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [taskId]);
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: `Task ${taskId} not found` });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    await initDb();
    console.log('Database connected and initialized.');
  } catch (err) {
    console.error('Database connection warning (ensure PostgreSQL is running):', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI documentation available at http://localhost:${PORT}/docs`);
  });
}

startServer();
