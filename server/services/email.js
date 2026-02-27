import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials not configured (SMTP_HOST, SMTP_USER, SMTP_PASS)');
  }

  transporter = nodemailer.createTransport({
    host,
    port: parseInt(port || '587', 10),
    secure: parseInt(port || '587', 10) === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendEmail(to, subject, body) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const transport = getTransporter();

  const info = await transport.sendMail({
    from,
    to,
    subject,
    text: body,
    html: `<div style="font-family: sans-serif; max-width: 600px;">
      <h2 style="color: #1e3a5f;">${subject}</h2>
      <p>${body.replace(/\n/g, '<br>')}</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin-top: 20px;">
      <p style="color: #888; font-size: 12px;">Sent from Das Boot PMS</p>
    </div>`,
  });

  return info.messageId;
}
