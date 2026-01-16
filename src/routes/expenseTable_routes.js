const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Expense } = require('../../database/models');

//  Create New Expense
// POST /api/expenses
router.post('/', async (req, res) => {
  try {
    const expense = await Expense.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message,
    });
  }
});

//  Get All Expenses (with optional filters)
// GET /api/expenses?status=&fromDate=&toDate=
router.get('/', async (req, res) => {
  try {
    const { status, fromDate, toDate } = req.query;
    const where = {};

    if (status) where.payment_status = status;
    if (fromDate && toDate) where.expense_date = { [Op.between]: [fromDate, toDate] };

    const expenses = await Expense.findAll({
      where,
      order: [['expense_date', 'DESC']],
    });

    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses',
      error: error.message,
    });
  }
});

//  Get Single Expense
// GET /api/expenses/:id
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expense',
      error: error.message,
    });
  }
});

// Update Expense
// PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await expense.update(req.body);

    res.json({ success: true, message: 'Expense updated', data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update expense', error: error.message });
  }
});

// Delete Expense
// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });

    await expense.destroy();

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete expense', error: error.message });
  }
});

//  Get Expenses by Project
// GET /api/expenses/project/:projectId
router.get('/project/:projectId', async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { project_id: req.params.projectId },
      order: [['expense_date', 'DESC']],
    });

    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project expenses', error: error.message });
  }
});

// Approve Expense
// PATCH /api/expenses/:id/approve
router.patch('/:id/approve', async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });

    await expense.update({ payment_status: 'Approved' });

    res.json({ success: true, message: 'Expense approved', data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve expense', error: error.message });
  }
});

// Reject Expense
// PATCH /api/expenses/:id/reject
router.patch('/:id/reject', async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });

    await expense.update({ payment_status: 'Rejected' });

    res.json({ success: true, message: 'Expense rejected', data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reject expense', error: error.message });
  }
});

module.exports = router;
