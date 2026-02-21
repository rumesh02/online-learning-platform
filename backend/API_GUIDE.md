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
✅ Token expiration (7 days default)✅ ChatGPT-powered course recommendations
✅ Personalized AI assistance
✅ API request logging and tracking

## ChatGPT Recommendation API

### Setup

Add your OpenAI API key to the `.env` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### 7. Get Course Recommendations

**POST** `/api/recommendations/courses`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "prompt": "I want to become a software engineer"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "recommendations": "- React Fundamentals\n- Node.js Backend\n- Database Design",
    "recommendedCourses": [
      {
        "_id": "course_id_1",
        "title": "React Fundamentals",
        "category": "Web Development",
        "description": "Learn frontend development",
        "instructor": {
          "_id": "instructor_id",
          "name": "Jane Smith",
          "email": "jane@example.com"
        }
      }
    ],
    "totalRequestCount": 1,
    "prompt": "I want to become a software engineer"
  },
  "message": "Course recommendations generated successfully"
}
```

**curl Example:**

```bash
curl -X POST http://localhost:5000/api/recommendations/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"prompt\":\"I want to become a software engineer\"}"
```

### 8. Get Personalized Assistance

**POST** `/api/recommendations/assistance`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "question": "What programming language should I learn first?"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "response": "For beginners, I recommend starting with Python...",
    "totalRequestCount": 2,
    "question": "What programming language should I learn first?"
  },
  "message": "Assistance provided successfully"
}
```

**curl Example:**

```bash
curl -X POST http://localhost:5000/api/recommendations/assistance \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"What programming language should I learn first?\"}"
```

### 9. Get API Request Statistics

**GET** `/api/recommendations/stats`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Description:** Retrieves statistics about all ChatGPT API requests made. Essential for tracking request count for final submission.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "totalRequests": 5,
    "recentRequests": [
      {
        "timestamp": "2026-02-21T10:30:00.000Z",
        "endpoint": "getCourseRecommendations",
        "userId": "user_id",
        "prompt": "I want to become a software engineer",
        "success": true,
        "error": null
      }
    ],
    "allRequests": []
  },
  "message": "API request statistics retrieved successfully"
}
```

**curl Example:**

```bash
curl -X GET http://localhost:5000/api/recommendations/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Important Notes for ChatGPT API:

1. **Request Logging**: All API calls to ChatGPT are automatically logged in `backend/logs/api-requests.json`
2. **No Loops**: The implementation fetches all courses once and structures them in a single prompt - no loops used
3. **Structured Prompts**: User input is combined with available course data to create structured prompts
4. **Request Count**: Use the `/stats` endpoint to get the total number of requests for your submission
5. **Authentication Required**: All recommendation endpoints require a valid JWT token
