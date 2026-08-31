# Task & Auth API (Supabase Auth & Containerized PostgreSQL)

A secure, production-grade RESTful API built with **Node.js**, **Express.js**, **PostgreSQL**, and **Supabase Auth**.

---

## 1. Goal & Overview

This project builds on previous storage assignments (A1–A3) by adding **User Authentication & Route Authorization (Assignment A4)** using **Supabase Auth** as the Identity Provider.

Key security practices implemented:
* **No Custom Cryptography**: Password hashing, salt generation, and JWT token signing are handled safely by Supabase Auth.
* **Token Verification Middleware**: Reusable Express middleware (`requireAuth`) verifies Bearer JWT signatures against Supabase before opening protected doors.
* **Swagger UI Bearer Authorization**: Interactive OpenAPI documentation at `/docs` with a working **Authorize** padlock button.

---

## 2. Environment Setup & Secrets

### Step 1: Create `.env` from Template

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

### Step 2: Supabase Credentials Setup

1. Create a free account & project at [supabase.com](https://supabase.com).
2. Open **Project Settings → API** and copy:
   - `SUPABASE_URL` (Project URL)
   - `SUPABASE_KEY` (Anon public key)
3. Open **Authentication → Providers → Email** and turn off **"Confirm email"** (enables immediate login after signup).
4. Update your local `.env` file:

```ini
DATABASE_URL=postgres://postgres:dev@localhost:5432/tasks
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

> **Security Check**: `.env` is listed in `.gitignore` and is never committed to Git.

---

## 3. Running the Server

### Option A: Local Node Server
```bash
npm install
npm start
```
Starts Express API on `http://localhost:3000`.

### Option B: Docker Compose (Full Stack)
```bash
docker compose up --build
```
Starts Express API and PostgreSQL container together.

---

## 4. API Reference Table

| Method | Endpoint | Purpose | Auth Header Required? | Status Codes |
| ------ | -------- | ------- | -------------------- | ------------ |
| POST   | `/auth/signup` | Create user account | None | `201 Created`, `400` |
| POST   | `/auth/login` | Authenticate & get JWT tokens | None | `200 OK`, `400`, `401` |
| POST   | `/auth/logout` | End user session | `Authorization: Bearer <token>` | `204 No Content`, `401` |
| GET    | `/public/info` | Open public information | None | `200 OK` |
| GET    | `/protected/profile` | Read user profile data | `Authorization: Bearer <token>` | `200 OK`, `401` |
| GET    | `/protected/dashboard` | Read user dashboard data | `Authorization: Bearer <token>` | `200 OK`, `401` |
| GET    | `/tasks` | List all tasks | None | `200 OK` |
| POST   | `/tasks` | Create task | None | `201 Created`, `400` |
| PUT    | `/tasks/:id` | Update task | None | `200 OK`, `400`, `404` |
| DELETE | `/tasks/:id` | Delete task | None | `204 No Content`, `404` |
| GET    | `/docs` | Interactive Swagger UI | None | `200 OK` |

---

## 5. Curl Testing Guide

### 1. Register User (`POST /auth/signup`)
```bash
curl -i -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"testuser@example.com\",\"password\":\"password123\"}"
```
**Response**: `201 Created`

### 2. Log In (`POST /auth/login`)
```bash
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"testuser@example.com\",\"password\":\"password123\"}"
```
**Response**: `200 OK` (Copy the returned `access_token` string).

### 3. Access Public Info (`GET /public/info`)
```bash
curl -i http://localhost:3000/public/info
```
**Response**: `200 OK` (`{"message":"Welcome stranger! This info is public."}`)

### 4. Access Protected Profile Without Token (`GET /protected/profile`)
```bash
curl -i http://localhost:3000/protected/profile
```
**Response**: `401 Unauthorized` (`{"error":"Access token required"}`)

### 5. Access Protected Profile With Valid Token
```bash
curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer <PASTE_YOUR_ACCESS_TOKEN_HERE>"
```
**Response**: `200 OK` with user `id`, `email`, and `created_at`.

### 6. Access Protected Profile With Invalid/Forged Token
```bash
curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer invalid_token_123"
```
**Response**: `401 Unauthorized` (`{"error":"Invalid or expired token"}`)

### 7. Log Out (`POST /auth/logout`)
```bash
curl -i -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer <PASTE_YOUR_ACCESS_TOKEN_HERE>"
```
**Response**: `204 No Content`

---

## 6. Swagger UI & Bearer Authorization

Visit [http://localhost:3000/docs](http://localhost:3000/docs) in your browser:

1. Click the **Authorize** button (padlock icon) at the top right of the Swagger UI.
2. Paste your JWT access token into the **Value** box and click **Authorize**.
3. Expand `/protected/profile` or `/protected/dashboard` and click **Try it out** -> **Execute**.
4. The request will automatically attach the `Authorization: Bearer <token>` header and return HTTP 200 OK.
