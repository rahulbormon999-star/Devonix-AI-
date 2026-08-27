import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }
  return transporter;
}

export async function sendOtpEmail(email, otp) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is not set');
  }

  try {
    await getTransporter().sendMail({
      from: `"Dev-Onix" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Dev-Onix — Your Verification Code',
      html: `
        <div style="font-family:Arial,sans-serif;text-align:center;padding:24px;background:#f4f6f9;">
          <h2 style="color:#1877f2;margin-bottom:4px;">Dev-Onix</h2>
          <p style="color:#4a4a4a;font-size:14px;">Your account verification code:</p>
          <div style="font-size:34px;font-weight:bold;letter-spacing:8px;color:#1c1e21;margin:16px 0;">${otp}</div>
          <p style="color:#65676b;font-size:12px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Gmail SMTP error:', err);
    throw new Error('Email could not be sent');
  }
}

// Reply email from admin to user's feedback
export async function sendReplyEmail(toEmail, userName, originalMessage, replyMessage) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is not set');
  }

  const safeOriginal = (originalMessage || '').slice(0, 200);

  try {
    await getTransporter().sendMail({
      from: `"Dev-Onix" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: 'Dev-Onix — Reply to your feedback',
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;background:#f4f6f9;">
          <h2 style="color:#1877f2;margin-bottom:12px;">Dev-Onix</h2>
          <p style="color:#4a4a4a;font-size:14px;">Dear ${userName || 'User'},</p>
          <p style="color:#4a4a4a;font-size:14px;">Thank you for your feedback. Here is our reply:</p>
          <div style="background:#fff;border-left:4px solid #1877f2;padding:14px;border-radius:8px;margin:14px 0;color:#1c1e21;font-size:15px;line-height:1.6;">
            ${replyMessage}
          </div>
          <p style="color:#94a3b8;font-size:12px;margin-top:20px;">Your original comment: "${safeOriginal}"</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Gmail SMTP error (reply):', err);
    throw new Error('Reply could not be sent');
  }
}
