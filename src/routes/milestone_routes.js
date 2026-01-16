const express = require('express'); 
const router = express.Router();
const { Milestone } = require('../../database/models');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Detect a date-like field safely:
 * - DATE type
 * - STRING field containing "date", "due", "end", "deadline"
 */
const getDateField = () => {
  const attrs = Milestone.rawAttributes;

  for (const key in attrs) {
    const type = attrs[key].type.key;
    const name = key.toLowerCase();

    if (
      type === 'DATE' ||
      (type === 'STRING' &&
        (name.includes('date') ||
         name.includes('due') ||
         name.includes('end') ||
         name.includes('deadline')))
    ) {
      return key;
    }
  }
  return null;
};
// CREATE NEW MILESTONE
// POST /api/milestones
router.post('/', authMiddleware, async (req, res) => {
  try {
    const milestone = await Milestone.create(req.body);
    res.status(201).json({ success: true, data: milestone });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create milestone',
      error: error.message
    });
  }
});

// GET ALL MILESTONES
// GET /api/milestones
router.get('/', authMiddleware, async (req, res) => {
  try {
    const milestones = await Milestone.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: milestones });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestones',
      error: error.message
    });
  }
});

// GET MILESTONES BY PROJECT
// GET /api/milestones/project/:projectId
router.get('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const milestones = await Milestone.findAll({
      where: { project_id: req.params.projectId },
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: milestones });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project milestones',
      error: error.message
    });
  }
});

// GET MILESTONE STATISTICS
// GET /api/milestones/stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const milestones = await Milestone.findAll();

    const total = milestones.length;

    const completed = milestones.filter(
      m => m.status && m.status.toLowerCase() === 'completed'
    ).length;

    const pending = milestones.filter(
      m => !m.status || m.status.toLowerCase() === 'pending'
    ).length;

    const dateField = getDateField();
    const now = new Date();

    let overdue = 0;
    if (dateField) {
      overdue = milestones.filter(m => {
        const rawDate = m[dateField];
        if (!rawDate) return false;

        const parsed = new Date(rawDate);
        return !isNaN(parsed) && parsed < now;
      }).length;
    }

    res.json({
      success: true,
      data: {
        total_milestones: total,
        completed_milestones: completed,
        pending_milestones: pending,
        overdue_milestones: overdue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestone statistics',
      error: error.message
    });
  }
});
// GET OVERDUE MILESTONES
// GET /api/milestones/overdue
router.get('/overdue', authMiddleware, async (req, res) => {
  try {
    const dateField = getDateField();

    if (!dateField) {
      return res.status(400).json({
        success: false,
        message: 'No date-like field found in milestone model'
      });
    }

    const milestones = await Milestone.findAll();
    const now = new Date();

    const overdue = milestones
      .filter(m => {
        const rawDate = m[dateField];
        if (!rawDate) return false;

        const parsed = new Date(rawDate);
        return !isNaN(parsed) && parsed < now;
      })
      .map(m => {
        const due = new Date(m[dateField]);
        const daysOverdue = Math.floor(
          (now - due) / (1000 * 60 * 60 * 24)
        );

        return {
          ...m.toJSON(),
          days_overdue: daysOverdue
        };
      })
      .sort((a, b) => new Date(a[dateField]) - new Date(b[dateField]));

    res.json({
      success: true,
      date_field_used: dateField,
      data: overdue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overdue milestones',
      error: error.message
    });
  }
});
// GET SINGLE MILESTONE
// GET /api/milestones/:milestoneId
router.get('/:milestoneId', authMiddleware, async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    res.json({ success: true, data: milestone });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestone',
      error: error.message
    });
  }
});

// UPDATE MILESTONE
// PUT /api/milestones/:milestoneId
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
    res.status(500).json({
      success: false,
      message: 'Failed to update milestone',
      error: error.message
    });
  }
});
// DELETE MILESTONE
// DELETE /api/milestones/:milestoneId
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
    res.status(500).json({
      success: false,
      message: 'Failed to delete milestone',
      error: error.message
    });
  }
});

module.exports = router;
