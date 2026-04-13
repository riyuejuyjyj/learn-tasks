import "server-only";

import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 465);
const secure = process.env.SMTP_SECURE === "true" || port === 465;

if (!host) {
  throw new Error("SMTP_HOST is not set");
}

export const mailer = nodemailer.createTransport({
  host,
  port,
  secure,
  requireTLS: !secure,
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 15_000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    servername: host,
  },
});
