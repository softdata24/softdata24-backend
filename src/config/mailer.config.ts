import nodemailer from "nodemailer";

export const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // e.g., "smtp.gmail.com"
  port: Number(process.env.SMTP_PORT) || 587,
  secure: true,                    // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,    // your email address
    pass: process.env.SMTP_PASS,    // your app password or SMTP password
  },
});
