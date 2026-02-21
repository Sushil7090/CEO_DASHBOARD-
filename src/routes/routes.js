const express = require('express');
const router = express.Router();

// 🔥 LOAD CRON JOB FIRST
require("./mailstoneremainder");  
// Make sure file name EXACTLY matches:
// src/cron/milestoneReminder.js

const authRoutes = require('./auth');
const usersRoutes = require('./userRoutes');
const projectRoutes = require('./project_routes');
const milestoneRoutes = require('./milestone_routes');
const saleTeamRoutes = require('./saleTeam_routes'); 
const saleDealRoutes = require('./saleDeal_routes');
const saleActivityRoutes = require('./saleActivity_routes'); 
const invoiceRoutes = require('./invoiceTable_routes');
const expenseRoutes = require('./expenseTable_routes');
const dashboardRoutes = require('./dashboard_routes');
const phaseRoutes = require('./phase_routes');

// ROUTES
router.use('/phases', phaseRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/projects', projectRoutes);
router.use('/milestones', milestoneRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/sales-team', saleTeamRoutes); 
router.use('/sales-deal', saleDealRoutes);
router.use('/sales-activities', saleActivityRoutes); 
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
