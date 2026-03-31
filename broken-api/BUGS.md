# BUGS.md

Document each bug you find and fix in the format below.

---

## Bug #1

- File & Line: config/db.js & line-6
- **What Was Wrong: Mongo uri are not string
- Root Cause: In db.js file mongodb uri are simple text not a string
- Fix Applied: add a back tic in Mongodb uri link

---

## Bug #2

- **File & Line: config/db.js & line - 6
- **What Was Wrong: Wrong env variable name 
- **Root Cause: use wrong variable name 
- **Fix Applied: i use right varible name

---

## Bug #3

- **File & Line:controller/authController.js & line - 25 and 50
- **What Was Wrong: when a new user create or login then we got 200 status code that was wrong
- **Root Cause: wrong status code
- **Fix Applied: i use 201 for create new user login the exist user

---

## Bug #4

- **File & Line: controller/taskController 56 & 84
- **What Was Wrong: status code are 403 for Unauthorize
- **Root Cause: wrong status code
- **Fix Applied: i set status code 401

---

## Bug #5

- **File & Line: middleware/auth.js & line-16
- **What Was Wrong: JWT is signed with JWT_SECRET but verified with JWT_SECRET_KEY
- **Root Cause: wrong environment variable name
- **Fix Applied: i fix environment variable name 
