const cron = require("node-cron");
const { Op } = require("sequelize");
const { Phase, PhaseTeamMember, User } = require("../../database/models");
const sendMail = require("../utiils/mailer");

cron.schedule("0 9 * * *", async () => {
  console.log("Running phase reminder cron...");

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

    const phases = await Phase.findAll({
      where: {
        endDate: {
          [Op.between]: [startOfDay, endOfDay],
        },
        status: {
          [Op.ne]: "Completed",
        },
      },
    });

    for (const phase of phases) {
      // Get phase members
      const members = await PhaseTeamMember.findAll({
        where: { phase_id: phase.id },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["email", "firstName"],
          },
        ],
      });

      //  Get admins
      const admins = await User.findAll({
        where: { role: "admin" },
        attributes: ["email"],
      });

      const memberEmails = members.map((m) => m.user.email);
      const adminEmails = admins.map((a) => a.email);

      const allEmails = [...memberEmails, ...adminEmails];

      if (allEmails.length === 0) continue;

      const subject = `Reminder: Phase "${phase.phaseName}" ends tomorrow`;

      const html = `
        <h3>Reminder</h3>
        <p>The phase <strong>${phase.phaseName}</strong> is ending tomorrow.</p>
        <p>Status: ${phase.status}</p>
        <p>End Date: ${phase.endDate}</p>
        <br/>
        <p>Please complete pending work.</p>
      `;

      await Promise.all(
        allEmails.map((email) => sendMail(email, subject, html)),
      );

      console.log(`Phase: ${phase.phaseName}`);

      console.log("Phase Team Members:");
      memberEmails.forEach((email) => {
        console.log(" -", email);
      });

      console.log("Admins:");
      adminEmails.forEach((email) => {
        console.log(" -", email);
      });
    }
  } catch (error) {
    console.error("Cron Error:", error);
  }
});
