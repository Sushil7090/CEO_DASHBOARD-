const express = require('express');
const router = express.Router();
const { SalesActivity } = require('../../database/models');

// Create / Log Activity
// POST /api/sales-activities
router.post('/', /* verifyToken, */ async (req, res) => {
  try {
    const activity = await SalesActivity.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Sales activity logged successfully',
      data: activity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create sales activity',
    });
  }
});

// Get All Activities for a Deal
// GET /api/sales-activities/deal/:deal_id
router.get('/deal/:deal_id', /* verifyToken, */ async (req, res) => {
  try {
    const { deal_id } = req.params;

    const activities = await SalesActivity.findAll({
      where: { deal_id },
      order: [['activity_date', 'DESC']],
    });

    return res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities for deal',
    });
  }
});


// Get Activities by Sales Rep
// GET /api/sales-activities/sales-rep/:sales_rep_id
router.get('/sales-rep/:sales_rep_id', /* verifyToken, */ async (req, res) => {
  try {
    const { sales_rep_id } = req.params;

    const activities = await SalesActivity.findAll({
      where: { sales_rep_id },
      order: [['activity_date', 'DESC']],
    });

    return res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities for sales rep',
    });
  }
});

//  Get Single Activity
// GET /api/sales-activities/:activity_id
router.get('/:activity_id', /* verifyToken, */ async (req, res) => {
  try {
    const { activity_id } = req.params;

    const activity = await SalesActivity.findByPk(activity_id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Sales activity not found',
      });
    }

    return res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity',
    });
  }
});
// Update Activity
// PUT /api/sales-activities/:activity_id
router.put('/:activity_id', /* verifyToken, */ async (req, res) => {
  try {
    const { activity_id } = req.params;

    const [updated] = await SalesActivity.update(req.body, {
      where: { activity_id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Sales activity not found',
      });
    }

    const updatedActivity = await SalesActivity.findByPk(activity_id);

    return res.json({
      success: true,
      message: 'Sales activity updated successfully',
      data: updatedActivity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update activity',
    });
  }
});

//  Delete Activity
// DELETE /api/sales-activities/:activity_id
router.delete('/:activity_id', /* verifyToken, */ async (req, res) => {
  try {
    const { activity_id } = req.params;

    const deleted = await SalesActivity.destroy({
      where: { activity_id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Sales activity not found',
      });
    }

    return res.json({
      success: true,
      message: 'Sales activity deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete activity',
    });
  }
});
//  Activity Timeline (Deal-based)
// GET /api/sales-activities/timeline/:deal_id

router.get('/timeline/:deal_id', /* verifyToken, */ async (req, res) => {
  try {
    const { deal_id } = req.params;

    const timeline = await SalesActivity.findAll({
      where: { deal_id },
      order: [['activity_date', 'ASC']],
    });

    return res.json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity timeline',
    });
  }
});

module.exports = router;
