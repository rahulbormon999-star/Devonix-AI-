import { sql } from '../lib/db.js';
import { generateOtp, hashOtp } from '../lib/otp.js';
import { sendOtpEmail } from '../lib/email.js';
import { getClientIp } from '../lib/security.js';

function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email } = req.body || {};
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'সঠিক ইমেইল দিন' });
    }

    // এই ইমেইল দিয়ে আগে থেকেই একাউন্ট থাকলে OTP পাঠানোর দরকার নেই
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'এই ইমেইল দিয়ে আগে থেকেই একাউন্ট আছে' });
    }

    // Rate limit: একই ইমেইলে ১৫ মিনিটে সর্বোচ্চ ৩ বার
    const recentForEmail = await sql`
      SELECT COUNT(*) FROM email_otps
      WHERE email = ${email} AND created_at > now() - interval '15 minutes'
    `;
    if (Number(recentForEmail[0].count) >= 3) {
      return res.status(429).json({ error: 'অনেকবার কোড পাঠানো হয়েছে, ১৫ মিনিট পর আবার চেষ্টা করুন' });
    }

    // Rate limit: একই IP থেকে ১ ঘণ্টায় সর্বোচ্চ ১০ বার
    const ip = getClientIp(req);
    const recentForIp = await sql`
      SELECT COUNT(*) FROM email_otps
      WHERE ip = ${ip} AND created_at > now() - interval '1 hour'
    `;
    if (Number(recentForIp[0].count) >= 10) {
      return res.status(429).json({ error: 'অনেকবার চেষ্টা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন' });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    // এই ইমেইলের পুরনো OTP মুছে নতুনটা বসানো হচ্ছে
    await sql`DELETE FROM email_otps WHERE email = ${email}`;
    await sql`
      INSERT INTO email_otps (email, otp_hash, ip, expires_at)
      VALUES (${email}, ${otpHash}, ${ip}, now() + interval '10 minutes')
    `;

    await sendOtpEmail(email, otp);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    // ================= সাময়িক ডিবাগিং (সমস্যা ধরার পর এই লাইনটা বদলে ফেলবেন) =================
    return res.status(500).json({ error: 'কোড পাঠানো যায়নি: ' + (err.message || 'Unknown error') });
  }
}
