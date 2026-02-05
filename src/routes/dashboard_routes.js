const express = require('express');
const router = express.Router();
const { Project, SalesDeal, Invoice, Expense, SalesTeam } =
  require('../../database/models');

 //  DASHBOARD OVERVIEW
router.get('/overview', async (req, res) => {
  try {
    const projects = await Project.findAll({ raw: true });
    const deals = await SalesDeal.findAll({ raw: true });
    const invoices = await Invoice.findAll({ raw: true });
    const reps = await SalesTeam.findAll({
      where: { is_active: true },
      raw: true
    });

    //HARD FORCE NUMBER (NO STRING SURVIVES)
    const forceNumber = (v) => {
      if (v === null || v === undefined) return 0;
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const n = parseFloat(v);
        return isNaN(n) ? 0 : n;
      }
      return 0;
    };

    let totalRevenue = 0;
    let totalCost = 0;
    let totalBudget = 0;

    for (const p of projects) {
      totalRevenue = forceNumber(totalRevenue) + forceNumber(p.total_revenue);
      totalCost    = forceNumber(totalCost)    + forceNumber(p.total_cost_to_date);
      totalBudget  = forceNumber(totalBudget)  + forceNumber(p.total_budget);
    }
    const totalProfit = forceNumber(totalRevenue) - forceNumber(totalCost);

    const averageROI =
      totalCost > 0
        ? Number(((totalProfit / totalCost) * 100).toFixed(2))
        : 0;

    // SALES 
    const totalDeals = deals.length;
    const wonDeals = deals.filter(d => d.pipeline_stage === 'Closed Won').length;
    const activeDeals = deals.filter(
      d => !['Closed Won', 'Closed Lost'].includes(d.pipeline_stage)
    ).length;

    //  INVOICES 
    const pendingInvoices = invoices.filter(i =>
      ['Sent', 'Viewed'].includes(i.invoice_status)
    ).length;

    const overdueInvoices = invoices.filter(
      i => i.invoice_status === 'Overdue'
    ).length;

    //  RESPONSE
    return res.json({
      success: true,
      data: {
        projects: {
          total: projects.length,
          in_progress: projects.filter(
            p => p.project_status === 'In Progress'
          ).length,
          completed: projects.filter(
            p => p.project_status === 'Completed'
          ).length
        },
        financial: {
          total_revenue: Number(totalRevenue.toFixed(2)),
          total_cost: Number(totalCost.toFixed(2)),
          total_budget: Number(totalBudget.toFixed(2)),
          total_profit: Number(totalProfit.toFixed(2)), // 🔥 NEVER NULL
          average_roi: averageROI,                      // 🔥 NEVER NaN
          currency: 'INR'
        },
        sales: {
          total_deals: totalDeals,
          closed_won: wonDeals,
          active_pipeline: activeDeals
        },
        invoices: {
          pending: pendingInvoices,
          overdue: overdueInvoices
        },
        team: {
          active_sales_reps: reps.length
        }
      }
    });

  } catch (err) {
    console.error('Dashboard Overview Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

 // FINANCIAL SUMMARY 
router.get('/financial-summary', async (req, res) => {
  try {
    const projects = await Project.findAll();
    const invoices = await Invoice.findAll();
    const expenses = await Expense.findAll();

       //PROJECT TOTALS

    let total_budget = 0;
    let total_cost = 0;
    let total_revenue = 0;

    let by_status = {};
    let by_category = {};

    projects.forEach(p => {
      const budget = Number(p.total_budget || 0);
      const cost = Number(p.total_cost || 0);
      const revenue = Number(p.total_revenue || 0);
      const status = p.status || 'Unknown';
      const category = p.category || 'Unknown';

      total_budget += budget;
      total_cost += cost;
      total_revenue += revenue;

      // by_status
      if (!by_status[status]) {
        by_status[status] = { budget: 0, cost: 0, revenue: 0 };
      }
      by_status[status].budget += budget;
      by_status[status].cost += cost;
      by_status[status].revenue += revenue;

      // by_category
      if (!by_category[category]) {
        by_category[category] = { budget: 0, cost: 0, revenue: 0 };
      }
      by_category[category].budget += budget;
      by_category[category].cost += cost;
      by_category[category].revenue += revenue;
    });

    const remaining_budget = total_budget - total_cost;
    const profit = total_revenue - total_cost;

    const profit_margin = total_revenue > 0
      ? ((profit / total_revenue) * 100).toFixed(2)
      : 0;

    const budget_utilization = total_budget > 0
      ? ((total_cost / total_budget) * 100).toFixed(2)
      : 0;

       //INVOICES

    let total_invoiced = 0;
    let total_paid = 0;
    let total_pending = 0;

    invoices.forEach(i => {
      const amount = Number(i.total_amount || i.amount || 0);
      total_invoiced += amount;

      if (['Paid', 'paid', 'PAID'].includes(i.invoice_status)) {
        total_paid += amount;
      } else {
        total_pending += amount;
      }
    });

      // EXPENSES
    let total_expenses = 0;
    let expense_by_category = {};

    expenses.forEach(e => {
      const amount = Number(e.amount || 0);
      const category = e.category || 'Unknown';

      total_expenses += amount;

      if (!expense_by_category[category]) {
        expense_by_category[category] = 0;
      }
      expense_by_category[category] += amount;
    });

       //FINAL RESPONSE

    res.json({
      success: true,
      data: {
        projects: {
          total_budget,
          total_cost,
          total_revenue,
          remaining_budget,
          profit,
          profit_margin,
          budget_utilization,
          by_status,
          by_category
        },
        invoices: {
          total_invoiced,
          total_paid,
          total_pending
        },
        expenses: {
          total_expenses,
          by_category: expense_by_category
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


 //SALES FUNNEL
router.get('/sales-funnel', async (req, res) => {
  try {
    const deals = await SalesDeal.findAll();

    let pipeline = {};
    let by_category = {};
    let by_region = {};

    let totalValue = 0;
    let winValue = 0;
    let lossValue = 0;
    let expectedRevenue = 0;

    deals.forEach(d => {
      const stage = d.pipeline_stage || 'Unknown';
      const value = Number(d.deal_value || 0);
      const category = d.category || 'Unknown';
      const region = d.region || 'Unknown';

         //PIPELINE
      
      if (!pipeline[stage]) {
        pipeline[stage] = { count: 0, value: 0 };
      }
      pipeline[stage].count++;
      pipeline[stage].value += value;

        // TOTAL DEAL VALUE
    
      totalValue += value;

      if (stage === 'Proposal') winValue += value;
      if (stage === 'Negotiation') lossValue += value;

        // EXPECTED REVENUE
        // Lead + Qualified
      if (['Lead', 'Qualified'].includes(stage)) {
        expectedRevenue += value;
      }

  
      // BY CATEGORY
      if (!by_category[category]) {
        by_category[category] = { count: 0, value: 0 };
      }
      by_category[category].count++;
      by_category[category].value += value;

        // BY REGION
      if (!by_region[region]) {
        by_region[region] = { count: 0, value: 0 };
      }
      by_region[region].count++;
      by_region[region].value += value;
    });

       //METRICS
    const metrics = {
      total_deals_value: totalValue,
      won_deals_value: winValue,
      lost_deals_value: lossValue,
      win_rate: totalValue ? ((winValue / totalValue) * 100).toFixed(2) : 0,
      loss_rate: totalValue ? ((lossValue / totalValue) * 100).toFixed(2) : 0,
      average_deal_size: deals.length
        ? (totalValue / deals.length).toFixed(2)
        : 0,
      expected_revenue: expectedRevenue
    };

       //FINAL RESPONSE   
    res.json({
      success: true,
      data: {
        pipeline,
        metrics,
        by_category,
        by_region
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

 // TEAM PERFORMANCE
router.get('/team-performance', async (req, res) => {
  try {

    const reps = await SalesTeam.findAll({ where: { is_active: true } });
    const deals = await SalesDeal.findAll();   // 🔥 FIXED

       //TOP PERFORMERS
    let top_performers = [];
    let totalRevenue = 0;

    reps.forEach(rep => {
      let repRevenue = 0;
      let repDeals = 0;

      deals.forEach(deal => {
        if (deal.sales_rep_id === rep.employee_id) {
          repRevenue += Number(deal.deal_value || 0);
          repDeals++;
        }
      });

      totalRevenue += repRevenue;

      top_performers.push({
        employee_id: rep.employee_id,
        employee_name: rep.employee_name,
        region: rep.region || 'Unknown',
        deals_closed: repDeals,
        total_revenue: repRevenue
      });
    });

    top_performers.sort((a, b) => b.total_revenue - a.total_revenue);

      // TARGET ACHIEVEMENT
    const target_achievement = {
      monthly: {
        total_target: 1000000,
        actual_revenue: totalRevenue,
        achievement_percentage: totalRevenue
          ? ((totalRevenue / 1000000) * 100).toFixed(2)
          : 0
      },
      quarterly: {
        total_target: 3000000,
        actual_revenue: totalRevenue,
        achievement_percentage: totalRevenue
          ? ((totalRevenue / 3000000) * 100).toFixed(2)
          : 0
      },
      yearly: {
        total_target: 12000000,
        actual_revenue: totalRevenue,
        achievement_percentage: totalRevenue
          ? ((totalRevenue / 12000000) * 100).toFixed(2)
          : 0
      }
    };

       //BY REGION
    let by_region = {};

    deals.forEach(d => {
      const region = d.region || 'Unknown';

      if (!by_region[region]) {
        by_region[region] = { revenue: 0, deals_count: 0 };
      }

      by_region[region].revenue += Number(d.deal_value || 0);
      by_region[region].deals_count++;
    });

    Object.keys(by_region).forEach(r => {
      by_region[r].percentage = totalRevenue
        ? ((by_region[r].revenue / totalRevenue) * 100).toFixed(2)
        : 0;
    });

      // BY CATEGORY
    let by_category = {};

    deals.forEach(d => {
      const category = d.category || 'Unknown';

      if (!by_category[category]) {
        by_category[category] = { revenue: 0, deals_count: 0 };
      }

      by_category[category].revenue += Number(d.deal_value || 0);
      by_category[category].deals_count++;
    });

    Object.keys(by_category).forEach(c => {
      by_category[c].percentage = totalRevenue
        ? ((by_category[c].revenue / totalRevenue) * 100).toFixed(2)
        : 0;
    });

       //TEAM METRICS
    const team_metrics = {
      average_deal_size_per_rep: reps.length
        ? (totalRevenue / reps.length).toFixed(2)
        : 0,
      average_days_in_pipeline: 30
    };

      // FINAL RESPONSE
    res.json({
      success: true,
      data: {
        top_performers,
        target_achievement,
        by_region,
        by_category,
        team_metrics
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

  //5:PROJECT HEALTH
router.get('/project-health', async (req, res) => {
  try {

    const projects = await Project.findAll();

    let on_time = 0;
    let delayed = 0;
    let total_delay_days = 0;

    let under_budget = 0;
    let on_budget = 0;
    let over_budget = 0;

    let total_progress = 0;
    let near_completion = 0;
    let needs_attention = 0;

    let status_distribution = {};
    let at_risk_projects = [];

    projects.forEach(p => {
      const budget = Number(p.total_budget || 0);
      const cost = Number(p.total_cost || 0);
      const progress = Number(p.progress_percentage || 0);
      const project_status = p.project_status || 'Unknown';

        // TIMELINE STATUS
      if (p.end_date_actual && p.end_date_planned) {
        const delay_days =
          (new Date(p.end_date_actual) - new Date(p.end_date_planned)) /
          (1000 * 60 * 60 * 24);

        if (delay_days <= 0) {
          on_time++;
        } else {
          delayed++;
          total_delay_days += delay_days;
        }

          // AT RISK PROJECTS
        if (delay_days > 0 || cost > budget || progress < 40) {
          at_risk_projects.push({
            project_id: p.project_id,
            project_name: p.project_name,
            project_status,
            budget,
            cost,
            delay_days: Math.max(0, Math.round(delay_days)),
            progress_percentage: progress
          });
        }
      }

         //BUDGET STATUS
      if (cost < budget) under_budget++;
      else if (cost === budget) on_budget++;
      else over_budget++;

       //  PROGRESS METRICS
      total_progress += progress;
      if (progress >= 90) near_completion++;
      if (progress < 30) needs_attention++;

         //STATUS DISTRIBUTION
      if (!status_distribution[project_status]) {
        status_distribution[project_status] = 0;
      }
      status_distribution[project_status]++;
    });

    const average_delay_days = delayed
      ? (total_delay_days / delayed).toFixed(2)
      : 0;

    const average_progress = projects.length
      ? (total_progress / projects.length).toFixed(2)
      : 0;


      // FINAL RESPONSE
    res.json({
      success: true,
      data: {
        timeline_status: {
          on_time,
          delayed,
          average_delay_days
        },
        budget_status: {
          under_budget,
          on_budget,
          over_budget
        },
        at_risk_projects,
        progress_metrics: {
          average_progress,
          near_completion,
          needs_attention
        },
        status_distribution
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

  //6:PAYMENT STATUS
router.get('/payment-status', async (req, res) => {
  try {

    const invoices = await Invoice.findAll();
    const today = new Date();

    let pending = { count: 0, amount: 0 };
    let overdue = {
      count: 0,
      amount: 0,
      average_days_overdue: 0,
      list: []
    };

    let upcoming = {
      next_30_days: 0,
      next_60_days: 0,
      next_90_days: 0
    };

    let by_status = {};
    let total_delay_days = 0;
    let paid_count = 0;

    invoices.forEach(i => {
      const amount = Number(i.total_amount || i.invoice_amount || i.amount || 0);
      const status = i.invoice_status || 'Unknown';
      const dueDate = i.due_date ? new Date(i.due_date) : null;

         //BY STATUS
      if (!by_status[status]) {
        by_status[status] = { count: 0, amount: 0 };
      }
      by_status[status].count++;
      by_status[status].amount += amount;

         //PENDING INVOICES  
      if (['Pending', 'Unpaid', 'Sent', 'Viewed'].includes(status)) {
        pending.count++;
        pending.amount += amount;
      }

        // OVERDUE INVOICES
      if (
        dueDate &&
        dueDate < today &&
        !['Paid', 'PAID', 'paid'].includes(status)
      ) {
        const delay_days = Math.ceil(
          (today - dueDate) / (1000 * 60 * 60 * 24)
        );

        overdue.count++;
        overdue.amount += amount;
        total_delay_days += delay_days;

        overdue.list.push({
          invoice_id: i.invoice_id,
          invoice_number: i.invoice_number,
          client_name: i.client_name,
          due_date: i.due_date,
          amount,
          days_overdue: delay_days
        });
      }

        // UPCOMING PAYMENTS
      if (dueDate && dueDate > today) {
        const diffDays = Math.ceil(
          (dueDate - today) / (1000 * 60 * 60 * 24)
        );

        if (diffDays <= 30) upcoming.next_30_days += amount;
        else if (diffDays <= 60) upcoming.next_60_days += amount;
        else if (diffDays <= 90) upcoming.next_90_days += amount;
      }

        // PAYMENT METRICS
      if (['Paid', 'PAID', 'paid'].includes(status)) {
        paid_count++;
        if (i.payment_date && dueDate) {
          const delay =
            (new Date(i.payment_date) - dueDate) /
            (1000 * 60 * 60 * 24);
          if (delay > 0) total_delay_days += delay;
        }
      }
    });

    overdue.average_days_overdue = overdue.count
      ? (total_delay_days / overdue.count).toFixed(2)
      : 0;

    const payment_metrics = {
      average_payment_delay_days: paid_count
        ? (total_delay_days / paid_count).toFixed(2)
        : 0,
      payment_success_rate: invoices.length
        ? ((paid_count / invoices.length) * 100).toFixed(2)
        : 0
    };

       //FINAL RESPONSE

    res.json({
      success: true,
      data: {
        pending_invoices: pending,
        overdue_invoices: overdue,
        upcoming_payments: upcoming,
        by_status,
        payment_metrics
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


module.exports = router;
