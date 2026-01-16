const express = require('express');
const router = express.Router();
const { SalesTeam } = require('../../database/models');
const authMiddleware = require('../middleware/auth.middleware');

   //CREATE SALES TEAM MEMBER
   //POST /api/sales-team
router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            employee_id,
            employee_name,
            email,
            phone,
            role,
            team_name,
            team_lead_id,
            region,
            city,
            category_specialization,
            hire_date,
            is_active,
            sales_target_monthly,
            sales_target_quarterly,
            sales_target_yearly,
            commission_percentage,
            created_at,
            updated_at
        } = req.body;

        if (!employee_name) {
            return res.status(400).json({
                success: false,
                message: "employee_name is required"
            });
        }

        const newMember = await SalesTeam.create({
            employee_id,
            employee_name,
            email,
            phone,
            role,
            team_name,
            team_lead_id,
            region,
            city,
            category_specialization,
            hire_date,
            is_active,
            sales_target_monthly,
            sales_target_quarterly,
            sales_target_yearly,
            commission_percentage,
            created_at,
            updated_at
        });

        res.status(201).json({ success: true, data: newMember });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

   //GET ALL SALES TEAM MEMBERS
   //GET /api/sales-team
router.get('/', authMiddleware, async (req, res) => {
    try {
        const members = await SalesTeam.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

   //GET SINGLE SALES TEAM MEMBER
   //GET /api/sales-team/:id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const member = await SalesTeam.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }
        res.json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

   //UPDATE SALES TEAM MEMBER
   //PUT /api/sales-team/:id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const member = await SalesTeam.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        await member.update(req.body);
        res.json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

   //DELETE SALES TEAM MEMBER
   //DELETE /api/sales-team/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const member = await SalesTeam.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        await member.destroy();
        res.json({
            success: true,
            message: "Member deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

   //GET TEAM HIERARCHY (Lead → Members)
   //GET /api/sales-team/hierarchy/:leadId
router.get('/hierarchy/:leadId', authMiddleware, async (req, res) => {
    try {
        const lead = await SalesTeam.findByPk(req.params.leadId);
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Team lead not found"
            });
        }

        const members = await SalesTeam.findAll({
            where: { team_lead_id: req.params.leadId }
        });

        res.json({
            success: true,
            data: {
                team_lead: lead,
                team_members: members
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

 // TEAM PERFORMANCE STATS
   //GET /api/sales-team/stats

router.get('/stats/performance', authMiddleware, async (req, res) => {
    try {
        const totalMembers = await SalesTeam.count();
        const activeMembers = await SalesTeam.count({
            where: { is_active: true }
        });

        const targets = await SalesTeam.findAll({
            attributes: [
                'sales_target_monthly',
                'sales_target_quarterly',
                'sales_target_yearly'
            ]
        });

        let totalMonthly = 0;
        let totalQuarterly = 0;
        let totalYearly = 0;

        targets.forEach(t => {
            totalMonthly += Number(t.sales_target_monthly || 0);
            totalQuarterly += Number(t.sales_target_quarterly || 0);
            totalYearly += Number(t.sales_target_yearly || 0);
        });

        res.json({
            success: true,
            data: {
                total_members: totalMembers,
                active_members: activeMembers,
                total_sales_target_monthly: totalMonthly,
                total_sales_target_quarterly: totalQuarterly,
                total_sales_target_yearly: totalYearly
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
