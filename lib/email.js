document import nodemailer from 'nodemailer';

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
    throw new Error('GMAIL_USER বা GMAIL_APP_PASSWORD সেট করা নেই');
  }

  try {
    await getTransporter().sendMail({
      from: `"Dev-Onix" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Dev-Onix — আপনার ভেরিফিকেশন কোড',
      html: `
        <div style="font-family:Arial,sans-serif;text-align:center;padding:24px;background:#f4f6f9;">
          <h2 style="color:#1877f2;margin-bottom:4px;">Dev-Onix</h2>
          <p style="color:#4a4a4a;font-size:14px;">আপনার একাউন্ট ভেরিফিকেশন কোড:</p>
          <div style="font-size:34px;font-weight:bold;letter-spacing:8px;color:#1c1e21;margin:16px 0;">${otp}</div>
          <p style="color:#65676b;font-size:12px;">এই কোডের মেয়াদ ১০ মিনিট। আপনি যদি এই অনুরোধ না করে থাকেন, এই ইমেইলটি উপেক্ষা করুন।</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Gmail SMTP error:', err);
    throw new Error('ইমেইল পাঠানো যায়নি');
  }
}
