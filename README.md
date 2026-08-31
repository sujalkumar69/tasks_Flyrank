# Task CRUD API (SQLite Backed)

A simple, beginner-friendly RESTful CRUD API built with Node.js, Express.js, and a persistent **SQLite database (`tasks.db`)**.

---

## 1. Project Description

The **Task API** allows users to perform complete CRUD (Create, Read, Update, Delete) operations on tasks. Each task object consists of an `id`, a `title`, and a `done` status. Unlike memory-based storage, all tasks are saved to a local SQLite database (`tasks.db`), ensuring data survives server restarts.

---

## 2. Features

* **Persistent SQLite Database**: Data lives on disk in `tasks.db` and persists across server restarts.
* **Complete CRUD Operations**: Create, view, update, and delete tasks using standard SQL queries (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
* **Parameterized Queries**: All database queries use `?` placeholders to protect against SQL injection attacks.
* **Input Validation**: Rejects missing, empty, or whitespace-only task titles with `400 Bad Request`.
* **Standard HTTP Status Codes**: Returns `200`, `201`, `204`, `400`, and `404` appropriately.
* **Interactive API Documentation**: Embedded Swagger UI accessible at `/docs`.

---

## 3. Technologies

* **Node.js**: JavaScript runtime environment.
* **Express.js**: Web framework for Node.js.
* **better-sqlite3**: Synchronous, high-performance SQLite library for Node.js.
* **Swagger UI Express**: Middleware for serving auto-generated OpenAPI 3 interactive documentation.
* **OpenAPI 3.0**: Standardized API specification format (`openapi.json`).

---

## 4. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

---

## 5. Running the API

Start the Express server on `http://localhost:3000`:

```bash
npm start
```

When started for the first time, `tasks.db` is automatically created, the `tasks` table is initialized, and 3 example tasks are seeded automatically.

---

## 6. API Endpoints

| Method | Endpoint     | Description                    | Status Code |
| ------ | ------------ | ------------------------------ | ----------- |
| GET    | `/`          | API metadata and links         | `200 OK`    |
| GET    | `/health`    | Health check status            | `200 OK`    |
| GET    | `/tasks`     | List all tasks                 | `200 OK`    |
| GET    | `/tasks/:id` | Get details of a single task   | `200 OK`    |
| POST   | `/tasks`     | Create a new task              | `201 Created` |
| PUT    | `/tasks/:id` | Update an existing task        | `200 OK`    |
| DELETE | `/tasks/:id` | Delete a task by ID            | `204 No Content` |

### Error Codes
* **HTTP 400 Bad Request**: Returned when request body fails validation (missing title, empty string, invalid boolean).
* **HTTP 404 Not Found**: Returned when attempting to fetch, update, or delete a task ID that does not exist in the database.

---

## 7. SQL Exploration (Stage 4)

We tested and verified queries by hand in SQLite / DB Browser:

* **Executed Query**:
  ```sql
  SELECT COUNT(*) FROM tasks;
  ```
* **Returned Result**:
  `count: 3` — Returned the total number of task rows currently stored in `tasks.db`.

---

## 8. Curl Examples

### GET /tasks (List All Tasks)
```bash
curl -i http://localhost:3000/tasks
```

### POST /tasks (Create Task)
```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy milk\"}"
```

### PUT /tasks/4 (Update Task)
```bash
curl -i -X PUT http://localhost:3000/tasks/4 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy organic milk\",\"done\":true}"
```

### DELETE /tasks/4 (Delete Task)
```bash
curl -i -X DELETE http://localhost:3000/tasks/4
```

---

## 9. Swagger Documentation

Interactive API documentation is available at:

[http://localhost:3000/docs](http://localhost:3000/docs)

> **Swagger UI Screenshot Placeholder**:
> ![Swagger UI Screenshot](swagger-screenshot.png)

---

## 10. Why SQLite & Persistence

* **Why SQLite?**: SQLite is a serverless, zero-configuration, file-based relational database. It is ideal for local development, desktop apps, and lightweight backend services because it requires no database server process or network setup.
* **Database File Location**: The database lives in `tasks.db` at the root of the project. It is automatically created on first startup and ignored by Git (`.gitignore`) so every new clone starts with a clean database.
