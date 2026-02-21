const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // your gmail
    pass: process.env.EMAIL_PASS       // app password
  }
});

const sendMail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"Project Reminder" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
};

module.exports = sendMail;
