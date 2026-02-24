const express = require("express");
const router = express.Router();
const {
  sequelize,
  Phase,
  ProjectTeamMember,
  PhaseTeamMember,
  User,
} = require("../../database/models");
router.post("/", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { projectId, phaseName, startDate, endDate } = req.body;

    if (!projectId || !phaseName || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const phase = await Phase.create(
      {
        projectId,
        phaseName,
        startDate,
        endDate,
      },
      { transaction },
    );

    const projectUsers = await ProjectTeamMember.findAll({
      where: { project_id: projectId },
      transaction,
    });

    const phaseMembers = projectUsers.map((member) => {
      const allocation = 1.0;
      const hours = 160;
      const rate = member.hourly_rate || 0;

      return {
        phase_id: phase.id,
        project_id: projectId,
        user_id: member.user_id,
        allocation,
        hourly_rate: rate,
        working_hours_per_month: hours,
        monthly_cost: rate * hours * allocation,
      };
    });

    if (phaseMembers.length > 0) {
      await PhaseTeamMember.bulkCreate(phaseMembers, {
        transaction,
      });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Phase created successfully",
      assigned_users: phaseMembers.length,
      data: phase,
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

//  UPDATE PHASE
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const phase = await Phase.findByPk(id);

    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    await phase.update(req.body);

    res.status(200).json({
      message: "Phase updated successfully",
      data: phase,
    });
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
