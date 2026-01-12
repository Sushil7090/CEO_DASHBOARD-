const express = require('express');
const router = express.Router();
const { Project } = require('../../database/models');

/* =====================================================
   GET ALL PROJECTS
   GET /api/projects/
===================================================== */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['createdAt', 'DESC']], // latest projects first
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message,
    });
  }
});

/* =====================================================
   CREATE NEW PROJECT
   POST /api/projects/
===================================================== */
router.post('/', async (req, res) => {
  try {
    const {
      project_name,
      client_name,
      project_status,
      progress_percentage,
      priority,
      project_owner,
      geography,
      total_budget,
      total_cost_to_date,
      total_revenue,
      start_date,
      end_date,
    } = req.body;

    // Validate required fields
    if (!project_name || !client_name) {
      return res.status(400).json({
        success: false,
        message: 'Project name and client name are required',
      });
    }

    // Create the project (project_id is auto-generated)
    const newProject = await Project.create({
      project_name,
      client_name,
      project_status,
      progress_percentage,
      priority,
      project_owner,
      geography,
      total_budget,
      total_cost_to_date,
      total_revenue,
      start_date,
      end_date,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message,
    });
  }
});

module.exports = router;
