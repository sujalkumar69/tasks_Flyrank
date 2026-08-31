# Task CRUD API (Containerized PostgreSQL Backed)

A robust, production-ready RESTful CRUD API built with **Node.js**, **Express.js**, and **PostgreSQL** — fully containerized using **Docker** and **Docker Compose**.

---

## 1. Goal & Overview

This project is Assignment A3 of the FlyRank Internship Backend Track. It completes the storage evolution:
* **A1**: In-memory storage (cleared on restart)
* **A2**: SQLite database file (`tasks.db`)
* **A3**: **Containerized PostgreSQL Database** (`postgres:16-alpine`) + Docker Compose

The entire stack — application server and relational database — starts with **one single command**: `docker compose up`.

---

## 2. Features

* **Containerized PostgreSQL Stack**: Database runs in a dedicated Docker container; data persists safely in a named Docker volume (`taskdata`).
* **One-Command Startup**: Spin up both the Express API and Postgres DB with `docker compose up`.
* **Zero Hardcoded Secrets**: Connection configuration lives in a git-ignored `.env` file (`.env.example` provided).
* **Parameterized SQL Queries**: All queries use `$1`, `$2` placeholders via `node-postgres` (`pg`), protecting against SQL injection attacks.
* **Auto-Table & First-Run Seeding**: On initial startup, the `tasks` table is created automatically, and 3 example tasks are seeded if the table is empty.
* **Standard HTTP Status Codes & Error Handling**: Returns `200`, `201`, `204`, `400`, and `404` with clean JSON error messages.
* **Interactive Swagger UI**: OpenAPI 3 documentation accessible at `/docs`.

---

## 3. Tech Stack

* **Language & Server**: Node.js (v20+), Express.js (v5)
* **Database**: PostgreSQL 16 (running via official `postgres:16-alpine` Docker container)
* **Driver**: `pg` (node-postgres pool)
* **Configuration**: `dotenv` (`.env`)
* **Containerization**: Docker, Docker Compose (`compose.yaml`)
* **API Documentation**: OpenAPI 3.0, Swagger UI Express

---

## 4. Quick Start (One Command)

### Step 1: Clone & Configure Environment Secrets
Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

`.env` content:
```ini
DATABASE_URL=postgres://postgres:dev@localhost:5432/tasks
PORT=3000
```

### Step 2: Start the Entire Stack with Docker Compose
Run:

```bash
docker compose up --build
```

Docker will build the Express app container (`api`) and pull the Postgres database container (`db`), start both services, connect them automatically inside the container network, create the table, and seed initial data.

To stop the stack:
```bash
docker compose down
```

> **Data Persistence**: Stopping or destroying containers (`docker compose down`) preserves all your tasks because database files live in the `taskdata` Docker volume.

---

## 5. API Endpoints

| Method | Endpoint     | Description                    | Success Code | Error Codes |
| ------ | ------------ | ------------------------------ | ------------ | ----------- |
| GET    | `/`          | API metadata and storage mode  | `200 OK`     | -           |
| GET    | `/health`    | Health check & DB connection   | `200 OK`     | `500`       |
| GET    | `/tasks`     | List all tasks                 | `200 OK`     | `500`       |
| GET    | `/tasks/:id` | Get details of a single task   | `200 OK`     | `400`, `404`|
| POST   | `/tasks`     | Create a new task              | `201 Created`| `400`       |
| PUT    | `/tasks/:id` | Update an existing task        | `200 OK`     | `400`, `404`|
| DELETE | `/tasks/:id` | Delete a task by ID            | `204 No Content` | `400`, `404`|
| GET    | `/docs`      | Interactive Swagger UI docs    | `200 OK`     | -           |

---

## 6. Verification & Curl Examples

### Health Check (`GET /health`)
```bash
curl -i http://localhost:3000/health
```
**Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "status": "ok",
  "db": "ok"
}
```

### List Tasks (`GET /tasks`)
```bash
curl -i http://localhost:3000/tasks
```
**Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {"id":1,"title":"Learn Express","done":false},
  {"id":2,"title":"Build CRUD API","done":false},
  {"id":3,"title":"Test the API","done":true}
]
```

### Create Task (`POST /tasks`)
```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Containerize stack with Docker\"}"
```
**Response**:
```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "id": 4,
  "title": "Containerize stack with Docker",
  "done": false
}
```

### Update Task (`PUT /tasks/4`)
```bash
curl -i -X PUT http://localhost:3000/tasks/4 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Containerize stack with Docker Compose\",\"done\":true}"
```
**Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "id": 4,
  "title": "Containerize stack with Docker Compose",
  "done": true
}
```

### Delete Task (`DELETE /tasks/4`)
```bash
curl -i -X DELETE http://localhost:3000/tasks/4
```
**Response**:
```http
HTTP/1.1 204 No Content
```

### Invalid ID / Not Found Test (`GET /tasks/999`)
```bash
curl -i http://localhost:3000/tasks/999
```
**Response**:
```http
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{
  "error": "Task 999 not found"
}
```

---

## 7. Database Verification (`psql`)

You can inspect the running PostgreSQL database inside the container at any time:

```bash
docker exec -it taskdb psql -U postgres -d tasks -c "\dt"
```
```text
         List of relations
 Schema |  Name  | Type  |  Owner   
--------+--------+-------+----------
 public | tasks  | table | postgres
```

Query task records directly:
```bash
docker exec -it taskdb psql -U postgres -d tasks -c "SELECT * FROM tasks;"
```

---

## 8. Database Persistence Explanation

In Docker, container filesystems are ephemeral — if a container is removed, any data written inside it disappears. 

To solve this, we use a named Docker volume (`taskdata:/var/lib/postgresql/data`).
* **Why volumes exist**: The volume mounts storage from the host machine into the container's Postgres data directory.
* **Proof of persistence**: When you run `docker compose down` and later `docker compose up`, your created tasks are still present because Postgres data is preserved on disk in the `taskdata` volume.
