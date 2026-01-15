const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const usersRoutes = require('./userRoutes');
const projectRoutes = require('./project_routes');
const milestoneRoutes = require('./milestone_routes');
const saleTeamRoutes = require('./saleTeam_routes'); // ✅ Updated file name
const saleDealRoutes = require('./saleDeal_routes');
const saleActivityRoutes = require('./saleActivity_routes'); // ✅ Added

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/projects', projectRoutes);
router.use('/milestones', milestoneRoutes);
router.use('/sales-team', saleTeamRoutes); // ✅ Added
router.use('/sales-deal', saleDealRoutes);
router.use('/sales-activities', saleActivityRoutes); // ✅ Added

module.exports = router;
