const cron = require("node-cron"); 
const { Op } = require("sequelize"); 
const { SalesActivity, User, SalesDeal } = require("../../database/models"); 
const sendMail = require("../utiils/mailer"); 

console.log("Sales Activity Reminder Cron Loaded");

// Cron runs every minute
cron.schedule(
  "* * * * *",
  async () => {
    try {

      console.log("\nSales Cron running:", new Date());

      // Current date & time
      const now = new Date();

      // Date for tomorrow
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

      // Fetch activities where follow-up is scheduled for tomorrow
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

      // Fetch activities scheduled within the last 1 minute
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

        if (!salesUser || !salesUser.email) continue;
        const deal = await SalesDeal.findOne({
          where: { deal_id: activity.deal_id },
        });

        const clientName = deal ? deal.client_name : "Client";

        console.log("User fetched:", salesUser.email);
        console.log("Sending reminder to:", salesUser.email);
        const callDate = new Date(activity.next_follow_up);

        // Check if call is tomorrow
        const isTomorrow =
          callDate >= startOfDay(oneDayBefore) &&
          callDate <= endOfDay(oneDayBefore);

        const message = isTomorrow
          ? `Reminder: Your call with client "${clientName}" is scheduled tomorrow at ${callDate.toLocaleTimeString()}`
          : `Reminder: Your call with client "${clientName}" is scheduled now`;

        // Send reminder email
        await sendMail(
          salesUser.email,
          "Sales Call Reminder",
          `Hello ${salesUser.firstName},
          ${message}
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