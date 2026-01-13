const express = require('express'); 
const router = express.Router();
const { Milestone } = require('../../database/models'); // adjust path if needed
const authMiddleware = require('../middleware/auth.middleware'); // optional JWT protection

// ==========================
// CREATE NEW MILESTONE
// POST /api/milestones
// ==========================
router.post('/', authMiddleware, async (req, res) => {
  try {
    const milestone = await Milestone.create(req.body);
    res.status(201).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create milestone',
      error: error.message
    });
  }
});

// ==========================
// GET ALL MILESTONES
// GET /api/milestones
// ==========================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const milestones = await Milestone.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({
      success: true,
      data: milestones
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestones',
      error: error.message
    });
  }
});

// ==========================
// GET MILESTONES BY PROJECT
// GET /api/milestones/project/:projectId
// ==========================
router.get('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const milestones = await Milestone.findAll({
      where: { project_id: req.params.projectId },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: milestones
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project milestones',
      error: error.message
    });
  }
});

// ==========================
// GET SINGLE MILESTONE
// GET /api/milestones/:milestoneId
// ==========================
router.get('/:milestoneId', authMiddleware, async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    res.json({
      success: true,
      data: milestone
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestone',
      error: error.message
    });
  }
});

// ==========================
// UPDATE MILESTONE
// PUT /api/milestones/:milestoneId
// ==========================
router.put('/:milestoneId', authMiddleware, async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    await milestone.update(req.body);

    res.json({
      success: true,
      message: 'Milestone updated successfully',
      data: milestone
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update milestone',
      error: error.message
    });
  }
});

// ==========================
// DELETE MILESTONE
// DELETE /api/milestones/:milestoneId
// ==========================
router.delete('/:milestoneId', authMiddleware, async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    await milestone.destroy();

    res.json({
      success: true,
      message: 'Milestone deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete milestone',
      error: error.message
    });
  }
});

module.exports = router;
