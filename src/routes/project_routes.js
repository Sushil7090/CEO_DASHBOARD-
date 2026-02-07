const express = require('express');
const router = express.Router();

const {
  Project,
  ProjectTeamMember,
  User,
} = require('../../database/models');

const authMiddleware = require('../middleware/auth.middleware');

/* =========================
   HELPERS
========================= */
const isValidUUID = (id) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );

/* =========================
   GET PROJECT TEAM MEMBERS
   GET /api/projects/team-members/:project_id
========================= */
router.get('/team-members/:project_id', authMiddleware, async (req, res) => {
  try {
    const { project_id } = req.params;

    if (!isValidUUID(project_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project_id format',
      });
    }

    const teamMembers = await ProjectTeamMember.findAll({
      where: { project_id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Project team members fetched successfully',
      data: teamMembers,
    });
  } catch (error) {
    console.error('Get Team Members Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project team members',
      error: error.message,
    });
  }
});

/* =========================
   GET ALL PROJECTS
   GET /api/projects
========================= */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message,
    });
  }
});

/* =========================
   GET SINGLE PROJECT
   GET /api/projects/:project_id
========================= */
router.get('/:project_id', authMiddleware, async (req, res) => {
  try {
    const { project_id } = req.params;

    if (!isValidUUID(project_id)) {
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

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message,
    });
  }
});

/* =========================
   GET PROJECT WITH TEAM MEMBERS
   GET /api/projects/details/:project_id
========================= */
router.get('/details/:project_id', authMiddleware, async (req, res) => {
  try {
    const { project_id } = req.params;

    if (!isValidUUID(project_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project_id format',
      });
    }

    const project = await Project.findOne({
      where: { project_id },
      include: [
        {
          model: ProjectTeamMember,
          as: 'team_members',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            },
          ],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project details fetched successfully',
      data: project,
    });
  } catch (error) {
    console.error('Get Project Details Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project details',
      error: error.message,
    });
  }
});


/* =========================
   CREATE PROJECT
   POST /api/projects
========================= */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      project_name,
      client_name,
      project_owner,
      project_status,
      category,
      sub_category,
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

    if (!project_name || !client_name || !project_owner) {
      return res.status(400).json({
        success: false,
        message:
          'Project name, client name, and project owner are required',
      });
    }

    const newProject = await Project.create({
      project_name,
      client_name,
      project_owner,
      project_status,
      category,
      sub_category,
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

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message,
    });
  }
});

/* =========================
   UPDATE PROJECT
   PUT /api/projects/:project_id
========================= */
router.put('/:project_id', authMiddleware, async (req, res) => {
  try {
    const { project_id } = req.params;

    if (!isValidUUID(project_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project_id format',
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user',
      });
    }

    if (!['Admin', 'Manager'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only Admin or Manager can update projects',
      });
    }

    const project = await Project.findOne({ where: { project_id } });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await project.update(req.body);

    if (Array.isArray(req.body.team_members)) {
      await ProjectTeamMember.destroy({ where: { project_id } });

      for (const member of req.body.team_members) {
        const employee = await User.findOne({
          where: { id: member.user_id, role: 'Employee' },
        });

        if (!employee) {
          return res.status(400).json({
            success: false,
            message: `User ${member.user_id} is not a valid Employee`,
          });
        }

        await ProjectTeamMember.create({
          project_id,
          user_id: member.user_id,
          member_role: member.member_role,
          rate_per_hour: member.rate_per_hour,
          allocation_percentage: member.allocation_percentage,
        });
      }
    }

    const updatedProject = await Project.findOne({
      where: { project_id },
      include: [{ model: ProjectTeamMember, as: 'team_members' }],
    });

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject,
    });
  } catch (error) {
    console.error('Update Project Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message,
    });
  }
});

/* =========================
   DELETE PROJECT
   DELETE /api/projects/:project_id
========================= */
router.delete('/:project_id', authMiddleware, async (req, res) => {
  try {
    const { project_id } = req.params;

    if (!isValidUUID(project_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project_id format',
      });
    }

    const project = await Project.findOne({ where: { project_id } });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await project.destroy();

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete Project Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting the project',
    });
  }
});

/* =========================
   ADD PROJECT TEAM MEMBER
   POST /api/projects/team-members
========================= */
router.post('/team-members', authMiddleware, async (req, res) => {
  try {
    const {
      project_id,
      user_id,
      member_role,
      allocation_percentage,
      rate_per_hour,
      assigned_date,
    } = req.body;

    if (!project_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'project_id and user_id are required',
      });
    }

    const exists = await ProjectTeamMember.findOne({
      where: { project_id, user_id },
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'User already added to this project',
      });
    }

    const teamMember = await ProjectTeamMember.create({
      project_id,
      user_id,
      member_role,
      allocation_percentage,
      rate_per_hour,
      assigned_date,
    });

    return res.status(201).json({
      success: true,
      message: 'Project team member added successfully',
      data: teamMember,
    });
  } catch (error) {
    console.error('Add Team Member Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add project team member',
      error: error.message,
    });
  }
});

module.exports = router;
