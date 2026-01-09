const express = require('express');
const router = express.Router();
const { User } = require('../../database/models'); 
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// ✅ Correct middleware import
const authenticateJWT = require('../middleware/auth.middleware');
const { UserCourse, Course } = require('../../database/models');


console.log('usersRoutes.js loaded'); // 🔹 Debug

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Users route works!' });
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email']
    });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE user
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(409).json({ success: false, message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      user: { id: user.id, firstName, lastName, email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
/* =====================================================
   SUBSCRIBE TO COURSE (JWT PROTECTED)
   POST /api/users/subscribe
===================================================== */
router.post('/subscribe', authenticateJWT, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'courseId is required'
      });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await UserCourse.create({
      userId,
      courseId
    });

    res.status(201).json({
      success: true,
      message: 'Course subscribed successfully'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


module.exports = router;
