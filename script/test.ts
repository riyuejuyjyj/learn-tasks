import nodemailer from "nodemailer";

// 直接在独立脚本里创建 transporter，避免 import 到 server-only 模块
const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function testMailer() {
  console.log({
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_SECURE: process.env.SMTP_SECURE,
  });
  await mailer.verify();
  console.log("SMTP 配置可用");
}

testMailer().catch((error) => {
  console.error("SMTP 测试失败：", error);
});
