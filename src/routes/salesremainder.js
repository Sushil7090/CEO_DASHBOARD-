const cron = require("node-cron");
const { Op } = require("sequelize");
const { SalesActivity, User } = require("../../database/models");
const sendMail = require("../utiils/mailer");

console.log("Sales Activity Reminder Cron Loaded");

cron.schedule(
  "* * * * *",
  async () => {
    try {
      console.log("\nSales Cron running:", new Date());

      const now = new Date();

      const oneDayBefore = new Date(now);
      oneDayBefore.setDate(now.getDate() + 1);

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

      // Calls scheduled tomorrow
      const tomorrowCalls = await SalesActivity.findAll({
        where: {
          next_follow_up: {
            [Op.between]: [
              startOfDay(oneDayBefore),
              endOfDay(oneDayBefore),
            ],
          },
        },
      });

      // Calls happening now
      const currentCalls = await SalesActivity.findAll({
        where: {
          next_follow_up: {
            [Op.lte]: now,
            [Op.gte]: new Date(now.getTime() - 60000),
          },
        },
      });

      const allCalls = [...tomorrowCalls, ...currentCalls];

      console.log("Calls found:", allCalls.length);

      for (const activity of allCalls) {

        const salesUser = await User.findOne({
          where: { id: activity.sales_rep_id },
        });

        if (!salesUser || !salesUser.email) {
          continue; // skip silently
        }

        console.log("User fetched:", salesUser.email);
        console.log("Sending reminder to:", salesUser.email);

        const callDate = new Date(activity.next_follow_up);

        const isTomorrow =
          callDate >= startOfDay(oneDayBefore) &&
          callDate <= endOfDay(oneDayBefore);

        const message = isTomorrow
          ? `Reminder: Your call with client "${activity.client_name}" is scheduled tomorrow at ${callDate.toLocaleTimeString()}`
          : `Reminder: Your call with client "${activity.client_name}" is scheduled now`;

        await sendMail(
          salesUser.email,
          "Sales Call Reminder",
          `Hello ${salesUser.firstName},

${message}

Deal ID: ${activity.deal_id}

Please make sure to attend the call.`
        );

        console.log("Reminder sent to:", salesUser.email);
      }

    } catch (error) {
      console.error("Sales cron error:", error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);