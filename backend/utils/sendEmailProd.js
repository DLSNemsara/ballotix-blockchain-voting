import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

const sendgridOptions = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  },
};

export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport(
      sendgridTransport(sendgridOptions)
    );

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error("Error sending production email:", error);
    throw new Error("Failed to send production email");
  }
};
