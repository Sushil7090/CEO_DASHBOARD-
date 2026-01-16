const express = require('express');
const router = express.Router();
const { Project } = require('../../database/models');
const authMiddleware = require('../middleware/auth.middleware');
  // GET ALL PROJECTS (JWT PROTECTED)
   //GET /api/projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['created_at', 'DESC']], // snake_case (underscored: true)
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
   //GET SINGLE PROJECT BY project_id (UUID)
   //GET /api/projects/:project_id
router.get('/:project_id', authMiddleware, async (req, res) => {
  try {
    const { project_id } = req.params;

    // basic UUID validation
    if (!project_id || project_id.length !== 36) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project_id format',
      });
    }

    const project = await Project.findOne({
      where: { project_id },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message,
    });
  }
});

   //CREATE NEW PROJECT (JWT PROTECTED)
   //POST /api/projects
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      project_name,
      client_name,
      project_status,
      category,
      sub_category,
      project_owner,
      start_date_planned,
      start_date_actual,
      end_date_planned,
      end_date_actual,
      total_budget,
      total_cost_to_date,
      total_revenue,
      currency,
      progress_percentage,
      priority,
      geography,
    } = req.body;

    // Required validation
    if (!project_name || !client_name || !project_owner) {
      return res.status(400).json({
        success: false,
        message: 'Project name, client name, and project owner are required',
      });
    }

    const newProject = await Project.create({
      project_name,
      client_name,
      project_status,
      category,
      sub_category,
      project_owner,
      start_date_planned,
      start_date_actual,
      end_date_planned,
      end_date_actual,
      total_budget,
      total_cost_to_date,
      total_revenue,
      currency,
      progress_percentage,
      priority,
      geography,
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
   //UPDATE PROJECT (ALL FIELDS)
   //PUT /api/projects/:project_id
   //Body: all project fields
router.put('/:project_id', authMiddleware, async (req, res) => {
  try {
    const { project_id } = req.params;

    // Find project
    const project = await Project.findOne({ where: { project_id } });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Update all fields dynamically
    await project.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message,
    });
  }
});
   //DELETE A PROJECT (JWT PROTECTED)
   //DELETE /api/projects/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project first
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Permanently delete the project
    await project.destroy();

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete Project Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting the project'
    });
  }
});


module.exports = router;
