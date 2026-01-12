const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const usersRoutes = require('./userRoutes');
const projectRoutes = require('./project_routes'); // 👈 MUST MATCH FILE NAME

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/projects', projectRoutes); // 👈 MUST EXIST

module.exports = router;
