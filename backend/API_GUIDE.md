# Authentication API Documentation

## Setup

1. Copy `.env.example` to `.env` and update the values
2. Make sure MongoDB is running
3. Install dependencies: `npm install`
4. Run the server: `npm run dev`

## API Endpoints

### Base URL: `http://localhost:5000`

### 1. Register User

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

_Note: role can be "student" or "instructor" (default: "student")_
_Note: username must be unique and can only contain letters, numbers, and underscores_

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### 2. Login User

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### 3. Get Current User

**GET** `/api/auth/me`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

## Testing with curl

### Register a Student:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"username\":\"johndoe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"role\":\"student\"}"
```

### Register an Instructor:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Smith\",\"username\":\"janesmith\",\"email\":\"jane@example.com\",\"password\":\"password123\",\"role\":\"instructor\"}"
```

### Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"johndoe\",\"password\":\"password123\"}"
```

### Get Current User (replace TOKEN with actual token):

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## RBAC Test Routes (Demonstrating Role-Based Access Control)

### 4. Dashboard (All Authenticated Users)

**GET** `/api/test/dashboard`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Description:** Accessible by both students and instructors

### 5. Instructor-Only Route

**GET** `/api/test/instructor-only`

**Headers:**

```
Authorization: Bearer <instructor_jwt_token>
```

**Description:** Only accessible by users with 'instructor' role

### 6. Student-Only Route

**GET** `/api/test/student-only`

**Headers:**

```
Authorization: Bearer <student_jwt_token>
```

**Description:** Only accessible by users with 'student' role

### Testing RBAC with curl:

```bash
# Test dashboard (works for any authenticated user)
curl -X GET http://localhost:5000/api/test/dashboard \
  -H "Authorization: Bearer TOKEN"

# Test instructor-only route (should fail with student token)
curl -X GET http://localhost:5000/api/test/instructor-only \
  -H "Authorization: Bearer INSTRUCTOR_TOKEN"

# Test student-only route (should fail with instructor token)
curl -X GET http://localhost:5000/api/test/student-only \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

## Features Implemented

✅ User registration with email validation
✅ Password hashing with bcrypt
✅ JWT-based authentication
✅ Role-based access control (Student/Instructor)
✅ Protected routes
✅ Input validation with express-validator
✅ Secure password comparison
✅ Token expiration (7 days default)
