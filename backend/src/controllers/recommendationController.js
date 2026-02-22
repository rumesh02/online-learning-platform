const OpenAI = require('openai');
const Course = require('../models/Course');
const apiLogger = require('../utils/apiLogger');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * @desc    Get course recommendations based on user prompt
 * @route   POST /api/recommendations/courses
 * @access  Private
 */
exports.getCourseRecommendations = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.id;

    // Validate prompt
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a prompt for course recommendations'
      });
    }

    // Fetch all available courses from database
    const courses = await Course.find({})
      .populate('instructor', 'name email')
      .select('title category description');

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No courses available at the moment'
      });
    }

    // Structure the courses list for GPT
    const coursesList = courses.map((course, index) => 
      `${index + 1}. ${course.title} - ${course.category} - ${course.description}`
    ).join('\n');

    // Create structured prompt for ChatGPT
    const structuredPrompt = `Available courses:
${coursesList}

Student goal:
"${prompt}"

From the available courses above, recommend the most relevant ones based on the student's goal.
Return ONLY course titles in bullet points (use - for bullets).
Format: - Course Title
Recommend between 3 to 5 courses if available.`;

    // Make API call to ChatGPT
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful course recommendation assistant. You analyze student goals and recommend the most relevant courses from a provided list. Only recommend courses that exist in the provided list. Be concise and only return course titles in bullet points.'
          },
          {
            role: 'user',
            content: structuredPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      // Log successful request
      const requestCount = apiLogger.logRequest(
        'getCourseRecommendations',
        userId,
        prompt,
        true,
        null
      );

      // Extract recommendations from response
      const recommendations = completion.choices[0].message.content;

      // Parse the recommendations to get course titles
      const recommendedTitles = recommendations
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());

      // Find full course details for recommended courses
      const recommendedCourses = courses.filter(course =>
        recommendedTitles.some(title => 
          course.title.toLowerCase().includes(title.toLowerCase()) ||
          title.toLowerCase().includes(course.title.toLowerCase())
        )
      );

      res.status(200).json({
        success: true,
        data: {
          recommendations: recommendations,
          recommendedCourses: recommendedCourses,
          totalRequestCount: requestCount,
          prompt: prompt
        },
        message: 'Course recommendations generated successfully'
      });

    } catch (apiError) {
      // Log failed request
      apiLogger.logRequest(
        'getCourseRecommendations',
        userId,
        prompt,
        false,
        apiError
      );

      console.error('OpenAI API Error:', apiError);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate recommendations from ChatGPT',
        error: process.env.NODE_ENV === 'development' ? apiError.message : undefined
      });
    }

  } catch (error) {
    console.error('Error in getCourseRecommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get personalized assistance from ChatGPT
 * @route   POST /api/recommendations/assistance
 * @access  Private
 */
exports.getPersonalizedAssistance = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user.id;

    // Validate question
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question for assistance'
      });
    }

    // Make API call to ChatGPT
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful educational assistant for an online learning platform. Provide helpful, concise, and educational responses to student questions about learning, courses, and career guidance.'
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      });

      // Log successful request
      const requestCount = apiLogger.logRequest(
        'getPersonalizedAssistance',
        userId,
        question,
        true,
        null
      );

      const response = completion.choices[0].message.content;

      res.status(200).json({
        success: true,
        data: {
          response: response,
          totalRequestCount: requestCount,
          question: question
        },
        message: 'Assistance provided successfully'
      });

    } catch (apiError) {
      // Log failed request
      apiLogger.logRequest(
        'getPersonalizedAssistance',
        userId,
        question,
        false,
        apiError
      );

      console.error('OpenAI API Error:', apiError);
      return res.status(500).json({
        success: false,
        message: 'Failed to get assistance from ChatGPT',
        error: process.env.NODE_ENV === 'development' ? apiError.message : undefined
      });
    }

  } catch (error) {
    console.error('Error in getPersonalizedAssistance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while providing assistance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get API request statistics
 * @route   GET /api/recommendations/stats
 * @access  Private (Admin only if you have role-based access)
 */
exports.getRequestStats = async (req, res) => {
  try {
    const stats = apiLogger.getRequestLogs();

    res.status(200).json({
      success: true,
      data: {
        totalRequests: stats.totalCount,
        recentRequests: stats.requests.slice(-10).reverse(), // Last 10 requests
        allRequests: stats.requests
      },
      message: 'API request statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error in getRequestStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
