const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');           // /api/auth
const courseRoutes = require('./courseRoutes'); // /api/courses
const usersRoutes = require('./userRoutes');   // /api/users

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/users', usersRoutes);

module.exports = router;
