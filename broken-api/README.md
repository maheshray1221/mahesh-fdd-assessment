# Zephvion Task API — FDD Assessment (Task 2)

This is a Node.js / Express / MongoDB REST API for task management.
A junior developer made some changes before going on leave. Several things are now broken.

Your job: **find and fix all the bugs, then document them in `BUGS.md`.**

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your values
cp .env.example .env

# 3. Run the dev server
npm run dev

# 4. Run the test suite to see what's failing
npm test
```

> **Note:** You need a running MongoDB instance. Update `MONGO_URI` in your `.env` accordingly.

---

## API Endpoints

| Method | Route                  | Access        | Description              |
|--------|------------------------|---------------|--------------------------|
| POST   | /api/auth/register     | Public        | Register a new user      |
| POST   | /api/auth/login        | Public        | Login and get token      |
| GET    | /api/tasks             | Private       | Get all your tasks       |
| POST   | /api/tasks             | Private       | Create a task            |
| GET    | /api/tasks/:id         | Private       | Get a task by ID         |
| PUT    | /api/tasks/:id         | Private       | Update a task            |
| DELETE | /api/tasks/:id         | Private       | Delete a task            |
| GET    | /api/users/profile     | Private       | Get your profile         |
| GET    | /api/users             | Admin only    | Get all users            |

---

## Project Structure

```
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── taskController.js
│   └── userController.js
├── middleware/
│   └── auth.js             # JWT protect middleware
├── models/
│   ├── User.js
│   └── Task.js
├── routes/
│   ├── auth.js
│   ├── tasks.js
│   └── users.js
├── tests/
│   └── api.test.js
├── server.js
├── .env.example
└── BUGS.md                 ← Fill this in after fixing all bugs
```

---

## BUGS.md Template

Create a `BUGS.md` file in the root of the repo. For each bug you find, add an entry:

```
## Bug #N

- **File & Line:**
- **What Was Wrong:**
- **Root Cause:**
- **Fix Applied:**
```

There are at least **5 intentional bugs** in this codebase. Good luck.
