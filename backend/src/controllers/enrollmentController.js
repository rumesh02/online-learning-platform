const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private (Student only)
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Create enrollment (duplicate will be prevented by unique index)
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId
    });

    await enrollment.populate('course', 'title category description');

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course!',
      data: enrollment
    });
  } catch (error) {
    // Handle duplicate enrollment error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course!'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student's enrolled courses
// @route   GET /api/enrollments/my-enrollments
// @access  Private (Student only)
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name email' }
      })
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get students enrolled in a specific course
// @route   GET /api/enrollments/course/:courseId
// @access  Private (Instructor only)
exports.getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'name email')
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update enrollment status
// @route   PATCH /api/enrollments/:enrollmentId/status
// @access  Private (Student only)
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { status } = req.body;

    const enrollment = await Enrollment.findOne({ 
      _id: enrollmentId, 
      student: req.user._id 
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.status = status;
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Enrollment status updated',
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:enrollmentId
// @access  Private (Student only)
exports.deleteEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findOneAndDelete({ 
      _id: enrollmentId, 
      student: req.user._id 
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
