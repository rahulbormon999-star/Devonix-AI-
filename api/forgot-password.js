import { sql } from '../lib/db.js';
import bcrypt from 'bcryptjs';
import { generateOtp, hashOtp, verifyOtpHash } from '../lib/otp.js';
import { sendOtpEmail } from '../lib/email.js';
import { getClientIp, isPasswordStrong } from '../lib/security.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action } = req.body || {};

  if (action === 'request') return handleRequest(req, res);
  if (action === 'reset') return handleReset(req, res);
  return res.status(400).json({ error: 'সঠিক action প্রয়োজন' });
}

// ================= ধাপ ১: ফোন নম্বর দিয়ে OTP চাওয়া =================
async function handleRequest(req, res) {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ error: 'ফোন নম্বর প্রয়োজন' });

    const rows = await sql`SELECT email, banned FROM users WHERE phone = ${phone}`;

    // ================= সাময়িক ডিবাগিং: anti-enumeration মাস্কিং বন্ধ করা হয়েছে =================
    if (rows.length === 0) {
      return res.status(404).json({ error: 'এই ফোন নম্বরে কোনো একাউন্ট পাওয়া যায়নি' });
    }

    const user = rows[0];

    if (user.banned) {
      return res.status(403).json({ error: 'এই একাউন্ট ব্যান করা হয়েছে' });
    }
    if (!user.email) {
      return res.status(400).json({ error: 'এই একাউন্টে কোনো ইমেইল যুক্ত নেই, অ্যাডমিনের সাহায্য নিন' });
    }

    // Rate limit: একই ইমেইলে ১৫ মিনিটে সর্বোচ্চ ৩ বার
    const recent = await sql`
      SELECT COUNT(*) FROM email_otps
      WHERE email = ${user.email} AND created_at > now() - interval '15 minutes'
    `;
    if (Number(recent[0].count) >= 3) {
      return res.status(429).json({ error: 'অনেকবার চেষ্টা হয়েছে, ১৫ মিনিট পর আবার চেষ্টা করুন' });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const ip = getClientIp(req);

    await sql`DELETE FROM email_otps WHERE email = ${user.email}`;
    await sql`
      INSERT INTO email_otps (email, otp_hash, ip, expires_at)
      VALUES (${user.email}, ${otpHash}, ${ip}, now() + interval '10 minutes')
    `;

    await sendOtpEmail(user.email, otp);

    return res.status(200).json({ success: true, maskedEmail: maskEmail(user.email) });
  } catch (err) {
    console.error(err);
    // ================= সাময়িক ডিবাগিং (সমস্যা ধরার পর এই লাইনটা বদলে ফেলবেন) =================
    return res.status(500).json({ error: 'কোড পাঠানো যায়নি: ' + (err.message || 'Unknown error') });
  }
}

// ================= ধাপ ২: OTP + নতুন পাসওয়ার্ড দিয়ে রিসেট =================
async function handleReset(req, res) {
  try {
    const { phone, otp, newPassword } = req.body || {};

    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ error: 'সব তথ্য পূরণ করুন' });
    }

    if (!isPasswordStrong(newPassword)) {
      return res.status(400).json({ error: 'পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টার এবং অন্তত একটি সংখ্যা ও অক্ষর থাকতে হবে' });
    }

    const rows = await sql`SELECT id, email FROM users WHERE phone = ${phone}`;
    if (rows.length === 0) {
      return res.status(400).json({ error: 'কোড সঠিক নয়' });
    }
    const user = rows[0];

    const otpRows = await sql`SELECT otp_hash, expires_at, attempts FROM email_otps WHERE email = ${user.email}`;
    if (otpRows.length === 0) {
      return res.status(400).json({ error: 'কোনো কোড পাওয়া যায়নি, আগে কোড চান' });
    }
    const otpRow = otpRows[0];

    if (new Date(otpRow.expires_at) < new Date()) {
      await sql`DELETE FROM email_otps WHERE email = ${user.email}`;
      return res.status(400).json({ error: 'কোডের মেয়াদ শেষ হয়ে গেছে, নতুন কোড চান' });
    }

    if (otpRow.attempts >= 5) {
      await sql`DELETE FROM email_otps WHERE email = ${user.email}`;
      return res.status(429).json({ error: 'অনেকবার ভুল কোড দেওয়া হয়েছে, নতুন কোড চান' });
    }

    if (!verifyOtpHash(otp, otpRow.otp_hash)) {
      await sql`UPDATE email_otps SET attempts = attempts + 1 WHERE email = ${user.email}`;
      return res.status(400).json({ error: 'কোড সঠিক নয়' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await sql`
      UPDATE users SET password_hash = ${passwordHash}, failed_login_attempts = 0, locked_until = NULL
      WHERE id = ${user.id}
    `;
    await sql`DELETE FROM email_otps WHERE email = ${user.email}`;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'পাসওয়ার্ড পরিবর্তন করা যায়নি, পরে আবার চেষ্টা করুন' });
  }
}

function maskEmail(email) {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  if (name.length <= 2) return name[0] + '***@' + domain;
  return name.slice(0, 2) + '***@' + domain;
}
