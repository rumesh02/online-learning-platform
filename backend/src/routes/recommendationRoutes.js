const express = require('express');
const router = express.Router();
const {
  getCourseRecommendations,
  getPersonalizedAssistance,
  getRequestStats
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// POST /api/recommendations/courses - Get course recommendations
router.post('/courses', getCourseRecommendations);

// POST /api/recommendations/assistance - Get personalized assistance
router.post('/assistance', getPersonalizedAssistance);

// GET /api/recommendations/stats - Get API request statistics
router.get('/stats', getRequestStats);

module.exports = router;
