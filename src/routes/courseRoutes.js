const express = require('express');
const router = express.Router();
const { Course, User, UserCourse } = require('../../database/models'); // index.js must export UserCourse singular

/* =====================================================
   STATIC ROUTES
===================================================== */

/**
 * GET ALL ENROLLMENTS WITH USERS & COURSES
 * GET /api/courses/enrollments/all
 */
router.get('/enrollments/all', async (req, res) => {
  try {
    const enrollments = await UserCourse.findAll({
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Course, attributes: ['id', 'title', 'description'] }
      ]
    });

    res.json({ success: true, enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
   COURSE CRUD ROUTES
===================================================== */

/**
 * CREATE COURSE
 * POST /api/courses
 */
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'title is required' });

    const course = await Course.create({ title, description });
    res.status(201).json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET ALL COURSES
 * GET /api/courses
 */
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET SINGLE COURSE
 * GET /api/courses/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * UPDATE COURSE
 * PUT /api/courses/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    await course.update({ title, description });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * DELETE COURSE
 * DELETE /api/courses/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    await course.destroy();
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
   ENROLL USER INTO COURSE (UUID version)
===================================================== */

/**
 * POST /api/courses/user-courses/enroll
 * Body: { userId: "UUID", courseId: "UUID" }
 */
router.post('/user-courses/enroll', async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({ success: false, message: 'Both userId and courseId are required' });
    }

    // Find user and course by UUID
    const user = await User.findByPk(userId);
    const course = await Course.findByPk(courseId);

    if (!user || !course) {
      return res.status(404).json({ success: false, message: 'User or Course not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = await UserCourse.findOne({
      where: { userId, courseId }
    });

    if (alreadyEnrolled) {
      return res.status(409).json({ success: false, message: 'User already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await UserCourse.create({ userId, courseId });

    res.status(201).json({
      success: true,
      message: 'User enrolled successfully',
      enrollment
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
