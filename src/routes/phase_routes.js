const express = require("express");
const router = express.Router();
const {
  sequelize,
  Phase,
  ProjectTeamMember,
  PhaseTeamMember,
  User,
} = require("../../database/models");
const authMiddleware = require("../middleware/auth.middleware");
router.post("/", authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { phaseName, projectId, startDate, endDate, team_members } = req.body;

    const phase = await Phase.create(
      {
        phaseName,
        projectId,
        startDate,
        endDate,
      },
      { transaction },
    );

    if (team_members && team_members.length > 0) {
      const phaseMembers = team_members.map((member) => {
        const monthlyCost =
          member.hourly_rate *
          (member.working_hours_per_month || 160) *
          (member.allocation || 1);

        return {
          phase_id: phase.id,
          project_id: phase.projectId,
          user_id: member.user_id,
          hourly_rate: member.hourly_rate,
          allocation: member.allocation || 1,
          working_hours_per_month: member.working_hours_per_month || 160,
          monthly_cost: monthlyCost,
        };
      });

      await PhaseTeamMember.bulkCreate(phaseMembers, {
        transaction,
      });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Phase created successfully",
      phase,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/:phaseId", authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { phaseId } = req.params;
    const { phaseName, team_members } = req.body;

    const phase = await Phase.findByPk(phaseId);

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: "Phase not found",
      });
    }

    if (phaseName) {
      await phase.update({ phaseName }, { transaction });
    }

    if (team_members) {
      const existingMembers = await PhaseTeamMember.findAll({
        where: { phase_id: phaseId },
        transaction,
      });

      const existingUserIds = existingMembers.map((m) => m.user_id);
      const newUserIds = team_members.map((m) => m.user_id);

      const usersToRemove = existingUserIds.filter(
        (id) => !newUserIds.includes(id),
      );

      if (usersToRemove.length > 0) {
        await PhaseTeamMember.destroy({
          where: {
            phase_id: phaseId,
            user_id: usersToRemove,
          },
          transaction,
        });
      }

      for (const member of team_members) {
        const monthlyCost =
          member.hourly_rate *
          (member.working_hours_per_month || 160) *
          (member.allocation || 1);

        const existing = existingMembers.find(
          (m) => m.user_id === member.user_id,
        );

        if (existing) {
          // UPDATE
          await existing.update(
            {
              hourly_rate: member.hourly_rate,
              allocation: member.allocation || 1,
              working_hours_per_month: member.working_hours_per_month || 160,
              monthly_cost: monthlyCost,
            },
            { transaction },
          );
        } else {
          // ADD NEW
          await PhaseTeamMember.create(
            {
              phase_id: phaseId,
              project_id: phase.projectId,
              user_id: member.user_id,
              hourly_rate: member.hourly_rate,
              allocation: member.allocation || 1,
              working_hours_per_month: member.working_hours_per_month || 160,
              monthly_cost: monthlyCost,
            },
            { transaction },
          );
        }
      }
    }

    await transaction.commit();

    res.json({
      success: true,
      message: "Phase updated successfully",
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/:phaseId/members", async (req, res) => {
  try {
    const { phaseId } = req.params;

    const members = await PhaseTeamMember.findAll({
      where: { phase_id: phaseId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const phases = await Phase.findAll();
    res.status(200).json(phases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET PHASES BY PROJECT ID
router.get("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const phases = await Phase.findAll({
      where: { projectId },
    });

    res.status(200).json(phases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE PHASE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const phase = await Phase.findByPk(id);

    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    await phase.destroy();

    res.status(200).json({
      message: "Phase deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// phase team member routes

router.post("/phase-team-member", async (req, res) => {
  try {
    const { phase_id, project_id, members } = req.body;

    if (!phase_id || !project_id || !members || !Array.isArray(members)) {
      return res.status(400).json({
        success: false,
        message: "phase_id, project_id and members array are required",
      });
    }

    const preparedData = members.map((member) => {
      const allocation = member.allocation ?? 1.0;
      const hours = member.working_hours_per_month ?? 160;

      const monthly_cost = member.hourly_rate * hours * allocation;

      return {
        phase_id,
        project_id,
        user_id: member.user_id,
        allocation,
        hourly_rate: member.hourly_rate,
        working_hours_per_month: hours,
        monthly_cost,
      };
    });

    const result = await PhaseTeamMember.bulkCreate(preparedData);

    return res.status(201).json({
      success: true,
      message: "Multiple team members added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Bulk insert error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//get phase team members
router.get("/phase-team-member", async (req, res) => {
  try {
    const members = await PhaseTeamMember.findAll();

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//get phase team members in id
router.get("/phase-team-members/:id", async (req, res) => {
  try {
    const member = await PhaseTeamMember.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Phase team member not found",
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
