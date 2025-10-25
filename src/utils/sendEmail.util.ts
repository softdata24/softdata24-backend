import { mailTransporter } from "../config/mailer.config";
import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  const mailOptions: nodemailer.SendMailOptions = {
    from: options.from || `"Your App Name" <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
