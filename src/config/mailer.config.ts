import nodemailer from "nodemailer";

// Determine if using SSL based on port (465 = SSL, 587 = TLS)
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const isSSL = smtpPort === 465;

console.log("SMTP Configuration:");
console.log("  Host:", process.env.SMTP_HOST);
console.log("  Port:", smtpPort);
console.log("  Is SSL:", isSSL);
console.log("  User:", process.env.SMTP_USER ? "Set" : "NOT SET");
console.log("  Pass:", process.env.SMTP_PASS ? "Set" : "NOT SET");

export const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // e.g., "smtp.gmail.com"
  port: smtpPort,
  secure: isSSL,                    // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,    // your email address
    pass: process.env.SMTP_PASS,    // your app password or SMTP password
  },
});
