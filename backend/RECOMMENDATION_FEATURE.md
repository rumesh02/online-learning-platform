# ChatGPT Course Recommendation Feature

## Overview

This feature provides AI-powered course recommendations and personalized assistance using OpenAI's ChatGPT API. It helps students discover relevant courses based on their career goals and provides educational guidance.

## Features

1. **Course Recommendations**: Get AI-powered course suggestions based on student goals
2. **Personalized Assistance**: Ask questions and receive educational guidance
3. **Request Tracking**: Automatic logging of all API requests for monitoring
4. **Structured Prompts**: Intelligent prompt engineering for better results

## Setup Instructions

### 1. Install Dependencies

The OpenAI package has already been installed. If needed, run:

```bash
cd backend
npm install openai
```

### 2. Configure OpenAI API Key

Add your OpenAI API key to the `.env` file in the `backend` directory:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

To get an API key:

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy and paste it into your `.env` file

### 3. Start the Server

```bash
npm run dev
```

## API Endpoints

### 1. Get Course Recommendations

**Endpoint**: `POST /api/recommendations/courses`

**Authentication**: Required (Bearer Token)

**Request Body**:

```json
{
  "prompt": "I want to become a software engineer"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "recommendations": "- React Fundamentals\n- Node.js Backend\n- Database Design",
    "recommendedCourses": [...],
    "totalRequestCount": 1,
    "prompt": "I want to become a software engineer"
  }
}
```

### 2. Get Personalized Assistance

**Endpoint**: `POST /api/recommendations/assistance`

**Authentication**: Required (Bearer Token)

**Request Body**:

```json
{
  "question": "What programming language should I learn first?"
}
```

### 3. Get Request Statistics

**Endpoint**: `GET /api/recommendations/stats`

**Authentication**: Required (Bearer Token)

**Response**:

```json
{
  "success": true,
  "data": {
    "totalRequests": 5,
    "recentRequests": [...],
    "allRequests": [...]
  }
}
```

## How It Works

### Structured Prompt Engineering

Instead of sending raw user text to GPT, the system:

1. **Fetches all available courses** from the database
2. **Structures the data** into a formatted list
3. **Creates a comprehensive prompt** that includes:
   - All available courses with descriptions
   - Student's goal/question
   - Clear instructions for GPT
4. **Sends the structured prompt** to ChatGPT
5. **Parses the response** and matches it with actual course objects

### Example Prompt Structure

```
Available courses:
1. React Fundamentals - Web Development - Learn frontend development
2. Node.js Backend - Web Development - Learn server-side development
3. Database Design - Data Science - Learn MongoDB

Student goal:
"I want to become a software engineer"

From the available courses above, recommend the most relevant ones.
Return ONLY course titles in bullet points.
```

## Request Logging

All API requests are automatically logged in `backend/logs/api-requests.json` with:

- Timestamp
- Endpoint used
- User ID
- Prompt/question (first 100 characters)
- Success/failure status
- Error message (if any)
- **Total request count**

### Viewing Logs

**Option 1**: Use the stats endpoint

```bash
curl -X GET http://localhost:5000/api/recommendations/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Option 2**: Check the log file directly

```bash
cat backend/logs/api-requests.json
```

## Best Practices

### ✅ DO:

- Use descriptive prompts (e.g., "I want to become a full-stack developer")
- Structure prompts with clear goals
- Check the stats endpoint to monitor request count
- Keep prompts focused on course recommendations

### ❌ DON'T:

- Make API calls in loops (the implementation fetches all courses once)
- Send overly long prompts (keep under 500 characters)
- Make unnecessary API calls (results are structured efficiently)

## Error Handling

The system handles various errors:

1. **Missing API Key**: Returns error message
2. **Invalid Token**: Returns 401 Unauthorized
3. **OpenAI API Errors**: Logged and returned with appropriate message
4. **No Courses Available**: Returns 404 with message
5. **Invalid Prompts**: Returns 400 with validation error

## Testing

### Test Course Recommendations

```bash
# 1. Register and login to get a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'

# 2. Get recommendations (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/recommendations/courses \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"I want to become a software engineer"}'

# 3. Check request count
curl -X GET http://localhost:5000/api/recommendations/stats \
  -H "Authorization: Bearer TOKEN"
```

## Request Count for Submission

To get the total number of ChatGPT API requests made (for your final submission):

1. Call the stats endpoint: `GET /api/recommendations/stats`
2. Check the `totalRequests` field in the response
3. Alternatively, check `backend/logs/api-requests.json` directly

Example response:

```json
{
  "totalRequests": 15
}
```

This count is automatically incremented with each successful or failed API call.

## Troubleshooting

### "OpenAI API Error: Invalid API Key"

- Check that your API key is correctly set in `.env`
- Ensure the key starts with `sk-`
- Verify the key is active on OpenAI's platform

### "No courses available"

- Make sure you have courses in your database
- Check MongoDB connection
- Verify courses are created by instructors

### "Not authorized to access this route"

- Ensure you're sending the JWT token in the Authorization header
- Check token format: `Bearer YOUR_TOKEN`
- Verify token hasn't expired

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── recommendationController.js   # ChatGPT integration logic
│   ├── routes/
│   │   └── recommendationRoutes.js       # API routes
│   ├── utils/
│   │   └── apiLogger.js                  # Request logging utility
│   └── server.js                         # Updated with recommendation routes
├── logs/
│   └── api-requests.json                 # Auto-generated request logs
├── .env                                  # Your API key here
└── .env.example                          # Template for environment variables
```

## Next Steps

1. ✅ Add your OpenAI API key to `.env`
2. ✅ Start the server
3. ✅ Test the endpoints using curl or Postman
4. ✅ Integrate with your frontend
5. ✅ Monitor request count via `/stats` endpoint
6. ✅ Include request count in your final submission
