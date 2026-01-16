const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { Invoice } = require('../../database/models');
   //Create New Invoice
   //POST /api/invoices
router.post('/', async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    });
  }
});

   //Get All Invoices (with filters)
   //GET /api/invoices?status=&fromDate=&toDate=
router.get('/', async (req, res) => {
  try {
    const { status, fromDate, toDate } = req.query;

    const where = {};

    if (status) {
      where.invoice_status = status;
    }

    if (fromDate && toDate) {
      where.invoice_date = {
        [Op.between]: [fromDate, toDate]
      };
    }

    const invoices = await Invoice.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    });
  }
});
    //Get Single Invoice
   //GET /api/invoices/:id
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message
    });
  }
});

   //Update Invoice
   //PUT /api/invoices/:id

router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    await invoice.update(req.body);

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice',
      error: error.message
    });
  }
});

   //Delete Invoice
   //DELETE /api/invoices/:id
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    await invoice.destroy();

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete invoice',
      error: error.message
    });
  }
});

   //Get Invoices by Project
   //GET /api/invoices/project/:projectId

router.get('/project/:projectId', async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { project_id: req.params.projectId },
      order: [['invoice_date', 'DESC']]
    });

    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project invoices',
      error: error.message
    });
  }
});
   //Get Overdue Invoices
   //GET /api/invoices/overdue
router.get('/status/overdue', async (req, res) => {
  try {
    const today = new Date();

    const invoices = await Invoice.findAll({
      where: {
        due_date: { [Op.lt]: today },
        invoice_status: { [Op.not]: 'Paid' }
      }
    });

    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overdue invoices',
      error: error.message
    });
  }
});

   //Get Invoice Statistics
   //GET /api/invoices/stats/summary
router.get('/stats/summary', async (req, res) => {
  try {
    const totalInvoices = await Invoice.count();
    const paidInvoices = await Invoice.count({ where: { invoice_status: 'Paid' } });
    const overdueInvoices = await Invoice.count({
      where: {
        due_date: { [Op.lt]: new Date() },
        invoice_status: { [Op.not]: 'Paid' }
      }
    });

    res.json({
      success: true,
      data: {
        totalInvoices,
        paidInvoices,
        overdueInvoices
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice statistics',
      error: error.message
    });
  }
});

module.exports = router;
