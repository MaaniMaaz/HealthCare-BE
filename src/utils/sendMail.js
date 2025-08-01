const dotenv = require("dotenv");
const sendGrid = require("@sendgrid/mail");
dotenv.config({ path: "./.env" });
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (email, subject, text) => {
  try {
    const msg = {
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || "zubarif234@gmail.com",
        name: process.env.SENDGRID_FROM_NAME || "HealthCare System"
      },
      to: email,
      subject: subject,
      html: text,
    };

    await sendGrid.send(msg);
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.log("Error in sendMail", error.response?.body?.errors || error.message);
  }
};

module.exports = sendMail;
