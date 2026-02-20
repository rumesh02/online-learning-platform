const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Example: Route accessible by all authenticated users
router.get('/dashboard', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome ${req.user.name}! This is accessible by all authenticated users.`,
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    }
  });
});

// Example: Route accessible only by instructors
router.get('/instructor-only', protect, authorize('instructor'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This route is only accessible by instructors',
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    }
  });
});

// Example: Route accessible only by students
router.get('/student-only', protect, authorize('student'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This route is only accessible by students',
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    }
  });
});

module.exports = router;
