const cron = require("node-cron");
const { Op } = require("sequelize");
const { Milestone, ProjectTeamMember, User } = require("../../database/models");
const sendMail = require("../utiils/mailer");

console.log("Milestone Reminder Cron Loaded");

cron.schedule(
  "0 9 * * *",
  async () => {
    console.log(" Cron running at:", new Date());

    try {
      const today = new Date();

      // 🔹 1 day before
      const oneDayBefore = new Date(today);
      oneDayBefore.setDate(today.getDate() + 1);

      // 🔹 5 days before
      const fiveDaysBefore = new Date(today);
      fiveDaysBefore.setDate(today.getDate() + 5);

      const startOfDay = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
      };

      const endOfDay = (date) => {
        const d = new Date(date);
        d.setHours(23, 59, 59, 999);
        return d;
      };

      const milestones = await Milestone.findAll({
        where: {
          payment_status: "Pending",
          [Op.or]: [
            {
              actual_date: {
                [Op.between]: [
                  startOfDay(oneDayBefore),
                  endOfDay(oneDayBefore),
                ],
              },
            },
            {
              actual_date: {
                [Op.between]: [
                  startOfDay(fiveDaysBefore),
                  endOfDay(fiveDaysBefore),
                ],
              },
            },
          ],
        },
      });

      console.log("Milestones found:", milestones.length);

      for (const milestone of milestones) {
        const milestoneDate = new Date(milestone.actual_date);
        const diffDays = Math.ceil(
          (milestoneDate - today) / (1000 * 60 * 60 * 24),
        );

        const reminderText =
          diffDays === 1
            ? " This is a 1-day reminder"
            : "This is a 5-day reminder";

        const teamMembers = await ProjectTeamMember.findAll({
          where: { project_id: milestone.project_id },
        });

        for (const member of teamMembers) {
          const user = await User.findOne({
            where: {
              id: member.user_id,
              role: "admin",
            },
          });

          if (!user || !user.email) continue;

          await sendMail(
            user.email,
            "Milestone Payment Reminder",
            `Hello ${user.firstName},

${reminderText}

Milestone "${milestone.milestone_name}" is due on ${milestoneDate.toDateString()}.
Please complete the payment.`,
          );

          console.log(` ${diffDays}-day reminder sent to admin:`, user.email);
        }
      }
    } catch (error) {
      console.error("Cron error:", error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  },
);
