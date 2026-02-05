const express = require('express');
const router = express.Router();
const { Project } = require('../../database/models');
const authMiddleware = require('../middleware/auth.middleware');
  // GET ALL PROJECTS
   //GET /api/projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['created_at', 'DESC']], 
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

    // UPDATE PROJECT 
    // PUT /api/projects/:project_id
router.put('/:project_id', authMiddleware, async (req, res) => {
  try {
    const { project_id } = req.params;
    const userId = req.user.id; 
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user',
      });
    }

    if (user.role === 'Employee') {
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

    // Handle team_members if provided
    if (req.body.team_members && Array.isArray(req.body.team_members)) 
    {
      await ProjectTeamMember.destroy({ where: { project_id } 
    });

    // Loop through new team_members array
      for (const member of req.body.team_members) {
        const employee = await User.findOne({
          where: { id: member.user_id, role: 'Employee' },
    });

      if (!employee) {
         return res.status(400).json
    ({
          success: false,
          message: `User ID ${member.user_id} is not a valid Employee`,
    });
    }

        await ProjectTeamMember.create
      ({
        project_id,
        user_id: member.user_id,
        member_role: member.member_role,
        rate_per_hour: member.rate_per_hour,
        allocation_percentage: member.allocation_percentage,
        });
      }
    }

    // Fetch updated project with team members
    const updatedProject = await Project.findOne({
      where: { project_id },
      include: [{ model: ProjectTeamMember, as: 'team_members' }],
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject,
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

   //DELETE A PROJECT 
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

   //GET PROJECT TEAM MEMBERS
   router.get('/team-members/:project_id', authMiddleware, async (req, res) => {
   try {
    const { project_id } = req.params;

    if (!project_id) {
      return res.status(400).json({
        success: false,
        message: 'project_id is required'
      });
    }

    const teamMembers = await ProjectTeamMember.findAll({
      where: { project_id },
      include: [
        {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Project team members fetched successfully',
      data: teamMembers
    });

  } catch (error) {
    console.error('Get Team Members Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project team members',
      error: error.message
    });
  }
});

    // ADD PROJECT TEAM MEMBER
    const { ProjectTeamMember, User } = require('../../database/models');
    router.post('/team-members', authMiddleware, async (req, res) => {
     try {
    const {
      project_id,
      user_id,
      member_role,
      allocation_percentage,
      rate_per_hour,
      assigned_date
    } = req.body;

    if (!project_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'project_id and user_id are required'
    });
    }

    const existingMember = await ProjectTeamMember.findOne({
      where: { project_id, user_id }
    });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: 'User already added to this project'
      });
    }

    const teamMember = await ProjectTeamMember.create({
      project_id,
      user_id,
      member_role,
      allocation_percentage,
      rate_per_hour,
      assigned_date
    });

    return res.status(201).json({
      success: true,
      message: 'Project team member added successfully',
      data: teamMember
    });

  } catch (error) {
    console.error('Add Team Member Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add project team member',
      error: error.message
    });
  }
});

module.exports = router;
