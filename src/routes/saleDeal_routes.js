// routes/salesDeal_routes.js

const express = require('express');
const router = express.Router();
const { SalesDeal } = require('../../database/models');
const authMiddleware = require('../middleware/auth.middleware');

/* =====================================================
   CREATE SALES DEAL
   POST /api/sales-deals
===================================================== */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const deal = await SalesDeal.create(req.body);
    res.status(201).json({ success: true, data: deal });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create sales deal',
      error: error.message
    });
  }
});

/* =====================================================
   GET ALL SALES DEALS
   GET /api/sales-deals
   Optional filters:
   ?pipeline_stage=&sales_rep_id=&project_id=&region=
===================================================== */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const where = {};
    const {
      pipeline_stage,
      sales_rep_id,
      project_id,
      region
    } = req.query;

    if (pipeline_stage) where.pipeline_stage = pipeline_stage;
    if (sales_rep_id) where.sales_rep_id = sales_rep_id;
    if (project_id) where.project_id = project_id;
    if (region) where.region = region;

    const deals = await SalesDeal.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, count: deals.length, data: deals });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales deals',
      error: error.message
    });
  }
});

/* =====================================================
   GET SINGLE SALES DEAL BY ID
   GET /api/sales-deals/:deal_id
===================================================== */
router.get('/:deal_id', authMiddleware, async (req, res) => {
  try {
    const deal = await SalesDeal.findByPk(req.params.deal_id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Sales deal not found'
      });
    }

    res.json({ success: true, data: deal });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales deal',
      error: error.message
    });
  }
});

/* =====================================================
   UPDATE SALES DEAL
   PUT /api/sales-deals/:deal_id
===================================================== */
router.put('/:deal_id', authMiddleware, async (req, res) => {
  try {
    const deal = await SalesDeal.findByPk(req.params.deal_id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Sales deal not found'
      });
    }

    await deal.update(req.body);

    res.json({
      success: true,
      message: 'Sales deal updated successfully',
      data: deal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update sales deal',
      error: error.message
    });
  }
});

/* =====================================================
   DELETE SALES DEAL
   DELETE /api/sales-deals/:deal_id
===================================================== */
router.delete('/:deal_id', authMiddleware, async (req, res) => {
  try {
    const deal = await SalesDeal.findByPk(req.params.deal_id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Sales deal not found'
      });
    }

    await deal.destroy();

    res.json({
      success: true,
      message: 'Sales deal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete sales deal',
      error: error.message
    });
  }
});

module.exports = router;
