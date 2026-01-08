const express = require('express');
const router = express.Router();

const {
  Course,
  User,
  UserCourse
} = require('../../database/models');

/* =====================================================
   STATIC ROUTES (MUST BE FIRST)
===================================================== */

/**
 * GET ALL ENROLLMENTS WITH USERS & COURSES
 * GET /api/courses/enrollments/all
 */
router.get('/enrollments/all', async (req, res) => {
  try {
    const enrollments = await UserCourse.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Course,
          attributes: ['id', 'title', 'description']
        }
      ]
    });

    res.json({
      success: true,
      enrollments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
   COURSE COLLECTION ROUTES
===================================================== */

/**
 * CREATE COURSE
 * POST /api/courses
 */
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'title is required'
      });
    }

    const course = await Course.create({ title, description });

    res.status(201).json({
      success: true,
      course
    });
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

/* =====================================================
   COURSE ITEM ROUTES (DYNAMIC — LAST)
===================================================== */

/**
 * GET SINGLE COURSE
 * GET /api/courses/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

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
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.update({ title, description });

    res.json({
      success: true,
      course
    });
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

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.destroy();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * ENROLL USER INTO COURSE
 * POST /api/courses/:id/enroll
 */
router.post('/:id/enroll', async (req, res) => {
  try {
    const { userId } = req.body;
    const courseId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const user = await User.findByPk(userId);
    const course = await Course.findByPk(courseId);

    if (!user || !course) {
      return res.status(404).json({
        success: false,
        message: 'User or Course not found'
      });
    }

    const alreadyEnrolled = await UserCourse.findOne({
      where: { userId, courseId }
    });

    if (alreadyEnrolled) {
      return res.status(409).json({
        success: false,
        message: 'User already enrolled in this course'
      });
    }

    const enrollment = await UserCourse.create({
      userId,
      courseId
    });

    res.status(201).json({
      success: true,
      message: 'User enrolled successfully',
      enrollment
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
