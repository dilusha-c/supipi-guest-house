const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function testEmail() {
  console.log("Testing email with:");
  console.log("USER:", process.env.EMAIL_USER);
  console.log("PASS:", process.env.EMAIL_APP_PASSWORD ? "****" : "MISSING");
  
  if (!process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_APP_PASSWORD === "PLACEHOLDER_APP_PASSWORD") {
    console.error("ERROR: You have not set the EMAIL_APP_PASSWORD in .env!");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: "dilushachamika@gmail.com",
      subject: "Test Email from Supipi",
      text: "This is a test email.",
    });
    console.log("SUCCESS! Message sent: %s", info.messageId);
  } catch (error) {
    console.error("FAILED TO SEND EMAIL:", error);
  }
}

testEmail();
