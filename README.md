# Task CRUD API

A simple, beginner-friendly RESTful CRUD API built with Node.js and Express.js for managing a task list.

---

## 1. Project Description

The **Task API** allows users to perform complete CRUD (Create, Read, Update, Delete) operations on tasks. Each task object consists of an `id`, a `title`, and a `done` status. The API runs locally without any database dependency, using an in-memory JavaScript array to store items during runtime.

---

## 2. Features

* **Complete CRUD Operations**: Create, view, update, and delete tasks.
* **Input Validation**: Rejects missing, empty, or whitespace-only task titles with HTTP 400 Bad Request.
* **Standard HTTP Status Codes**: Returns `200`, `201`, `204`, `400`, and `404` appropriately.
* **Interactive API Documentation**: Embedded Swagger UI accessible at `/docs`.
* **Zero Database Overhead**: Simple and lightweight setup for rapid learning and interview demonstrations.

---

## 3. Technologies

* **Node.js**: JavaScript runtime environment.
* **Express.js**: Fast, unopinionated web framework for Node.js.
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
* **HTTP 400 Bad Request**: Returned when request body fails validation (e.g. missing title, empty string, invalid data types).
* **HTTP 404 Not Found**: Returned when attempting to fetch, update, or delete a task ID that does not exist.

---

## 7. Curl Examples

### GET /tasks (List All Tasks)
```bash
curl -i http://localhost:3000/tasks
```
**Expected Output:**
```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {"id":1,"title":"Learn Express","done":false},
  {"id":2,"title":"Build CRUD API","done":false},
  {"id":3,"title":"Test the API","done":true}
]
```

### POST /tasks (Create Task)
```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy milk\"}"
```
**Expected Output:**
```text
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":4,"title":"Buy milk","done":false}
```

### PUT /tasks/4 (Update Task)
```bash
curl -i -X PUT http://localhost:3000/tasks/4 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy organic milk\",\"done\":true}"
```
**Expected Output:**
```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id":4,"title":"Buy organic milk","done":true}
```

### DELETE /tasks/4 (Delete Task)
```bash
curl -i -X DELETE http://localhost:3000/tasks/4
```
**Expected Output:**
```text
HTTP/1.1 204 No Content
```

---

## 8. Swagger Documentation

Interactive API documentation is available at:

[http://localhost:3000/docs](http://localhost:3000/docs)

> **Swagger UI Screenshot Placeholder**:
> Replace the image below with your screenshot of the Swagger UI.
>
> ![Swagger UI Screenshot](swagger-screenshot.png)

---

## 9. In-Memory Storage Note

> **Note**: This application deliberately uses an in-memory JavaScript array for data storage. No database or persistent file storage is attached. All created, updated, or deleted tasks will reset to the original 3 example tasks whenever the Express server process restarts.
