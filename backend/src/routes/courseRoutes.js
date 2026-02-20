const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  createCourse,
  getAllCourses,
  getInstructorCourses
} = require('../controllers/courseController');

const router = express.Router();

// Validation rules for course creation
const courseValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('content').notEmpty().withMessage('Content is required')
];

// Public routes
router.get('/', getAllCourses);

// Protected routes - Instructor only
router.post('/', protect, authorize('instructor'), courseValidation, createCourse);
router.get('/my-courses', protect, authorize('instructor'), getInstructorCourses);

module.exports = router;
