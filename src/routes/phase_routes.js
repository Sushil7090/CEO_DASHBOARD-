const express = require('express');
const router = express.Router();
const { Phase } = require('../../database/models');

router.post('/', async (req, res) => {
  try {
    const {
      projectId,
      phaseName,
      startDate,
      endDate,
      status,
      budgetAllocated,
      tasks
    } = req.body;

    // Basic validation
    if (!projectId || !phaseName || !startDate || !endDate) {
      return res.status(400).json({
        message: "projectId, phaseName, startDate and endDate are required"
      });
    }

    const phase = await Phase.create({
      projectId,
      phaseName,
      startDate,
      endDate,
      status: status || "Not Started",
      budgetAllocated: budgetAllocated || 0,
      tasks: tasks || []
    });

    res.status(201).json({
      message: "Phase created successfully",
      data: phase
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const phases = await Phase.findAll();
    res.status(200).json(phases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ 3️⃣ GET PHASES BY PROJECT ID
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const phases = await Phase.findAll({
      where: { projectId }
    });

    res.status(200).json(phases);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ 4️⃣ UPDATE PHASE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const phase = await Phase.findByPk(id);

    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    await phase.update(req.body);

    res.status(200).json({
      message: "Phase updated successfully",
      data: phase
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ 5️⃣ DELETE PHASE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const phase = await Phase.findByPk(id);

    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    await phase.destroy();

    res.status(200).json({
      message: "Phase deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
