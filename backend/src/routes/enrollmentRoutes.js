const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  enrollInCourse,
  getMyEnrollments,
  getCourseEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment
} = require('../controllers/enrollmentController');

const router = express.Router();

// Student routes
router.post('/:courseId', protect, authorize('student'), enrollInCourse);
router.get('/my-enrollments', protect, authorize('student'), getMyEnrollments);
router.patch('/:enrollmentId/status', protect, authorize('student'), updateEnrollmentStatus);
router.delete('/:enrollmentId', protect, authorize('student'), deleteEnrollment);

// Instructor routes
router.get('/course/:courseId', protect, authorize('instructor'), getCourseEnrollments);

module.exports = router;
