const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store with 3 initial tasks
let tasks = [
  {
    id: 1,
    title: "Learn Express",
    done: false
  },
  {
    id: 2,
    title: "Build CRUD API",
    done: false
  },
  {
    id: 3,
    title: "Test the API",
    done: true
  }
];

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

// GET /tasks -> List all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id -> Get task by ID
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      error: `Task ${taskId} not found`
    });
  }

  res.json(task);
});

// POST /tasks -> Create a new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  // Validation: title must exist, be a string, and not be empty/whitespace
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: "Title is required and cannot be empty or whitespace"
    });
  }

  // Generate next available ID
  const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

  const newTask = {
    id: nextId,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id -> Update a task by ID
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      error: `Task ${taskId} not found`
    });
  }

  const { title, done } = req.body;

  // Reject empty body or bodies missing both fields
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

  // Apply updates
  if (title !== undefined) {
    task.title = title.trim();
  }
  if (done !== undefined) {
    task.done = done;
  }

  res.json(task);
});

// DELETE /tasks/:id -> Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const index = tasks.findIndex(t => t.id === taskId);

  if (index === -1) {
    return res.status(404).json({
      error: `Task ${taskId} not found`
    });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
