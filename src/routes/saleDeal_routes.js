const express = require('express');
const router = express.Router();
const { SalesDeal } = require('../../database/models');
const { Op } = require('sequelize');
   //CREATE NEW DEAL
   //POST /api/sales-deals
router.post('/', async (req, res) => {
  try {
    const deal = await SalesDeal.create(req.body);
    res.status(201).json({ success: true, data: deal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

  //GET ALL DEALS (Pipeline Filters)
//   GET /api/sales-deals?stage=Negotiation&status=Open

router.get('/', async (req, res) => {
  try {
    const { stage, status } = req.query;

    const where = {};
    if (stage) where.pipeline_stage = stage;
    if (status) where.deal_status = status;

    const deals = await SalesDeal.findAll({ where });
    res.json({ success: true, count: deals.length, data: deals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

   // GET SINGLE DEAL
  // GET /api/sales-deals/:id
router.get('/:id', async (req, res) => {
  try {
    const deal = await SalesDeal.findByPk(req.params.id);
    if (!deal)
      return res.status(404).json({ success: false, message: 'Deal not found' });

    res.json({ success: true, data: deal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

   //UPDATE DEAL
   //PUT /api/sales-deals/:id
router.put('/:id', async (req, res) => {
  try {
    const deal = await SalesDeal.findByPk(req.params.id);
    if (!deal)
      return res.status(404).json({ success: false, message: 'Deal not found' });

    await deal.update(req.body);
    res.json({ success: true, data: deal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

   // DELETE DEAL
   //DELETE /api/sales-deals/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await SalesDeal.destroy({ where: { deal_id: req.params.id } });
    if (!deleted)
      return res.status(404).json({ success: false, message: 'Deal not found' });

    res.json({ success: true, message: 'Deal deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

   //MOVE TO NEXT PIPELINE STAGE
   //PATCH /api/sales-deals/:id/next-stage
router.patch('/:id/next-stage', async (req, res) => {
  try {
    const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'];
    const deal = await SalesDeal.findByPk(req.params.id);

    if (!deal)
      return res.status(404).json({ success: false, message: 'Deal not found' });

    const currentIndex = stages.indexOf(deal.pipeline_stage);
    if (currentIndex === -1 || currentIndex === stages.length - 1)
      return res.status(400).json({ success: false, message: 'Already at final stage' });

    deal.pipeline_stage = stages[currentIndex + 1];
    await deal.save();

    res.json({ success: true, data: deal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

   // DEALS BY SALES REP
   //GET /api/sales-deals/sales-rep/:sales_rep_id
router.get('/sales-rep/:sales_rep_id', async (req, res) => {
  try {
    const deals = await SalesDeal.findAll({
      where: { sales_rep_id: req.params.sales_rep_id }
    });

    res.json({ success: true, count: deals.length, data: deals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

   //WIN / LOSS ANALYSIS
   //GET /api/sales-deals/analysis/win-loss
router.get('/analysis/win-loss', async (req, res) => {
  try {
    const WON_STAGE = 'Negotiation';

    const won = await SalesDeal.count({
      where: { pipeline_stage: WON_STAGE }
    });

    const total = await SalesDeal.count();

    const lost = total - won;

    res.json({
      success: true,
      data: {
        total_deals: total,
        won,
        lost,
        win_rate: total
          ? ((won / total) * 100).toFixed(2) + '%'
          : '0%'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

   //SEARCH DEALS
   //GET /api/sales-deals/search?q=CRM
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;

    const deals = await SalesDeal.findAll({
      where: {
        [Op.or]: [
          { deal_name: { [Op.like]: `%${q}%` } },
          { client_name: { [Op.like]: `%${q}%` } }
        ]
      }
    });

    res.json({ success: true, count: deals.length, data: deals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
