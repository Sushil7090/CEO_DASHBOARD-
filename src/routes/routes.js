const express = require('express');
const router = express.Router();

// Import your individual route files
const authRoutes = require('./auth');          // login & signup
const courseRoutes = require('./courseRoutes'); // courses + enrollment

// Mount them on appropriate paths
router.use('/auth', authRoutes);      // => /api/auth/signup, /api/auth/login
router.use('/courses', courseRoutes); // => /api/courses/...

module.exports = router;
