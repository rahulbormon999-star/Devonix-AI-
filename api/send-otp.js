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
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Check if an account already exists with this email
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account already exists with this email' });
    }

    // Rate limit: Max 3 OTPs per email in 15 minutes
    const recentForEmail = await sql`
      SELECT COUNT(*) FROM email_otps
      WHERE email = ${email} AND created_at > now() - interval '15 minutes'
    `;
    if (Number(recentForEmail[0].count) >= 3) {
      return res.status(429).json({ error: 'Too many codes sent. Please try again in 15 minutes' });
    }

    // Rate limit: Max 10 OTP requests per IP in 1 hour
    const ip = getClientIp(req);
    const recentForIp = await sql`
      SELECT COUNT(*) FROM email_otps
      WHERE ip = ${ip} AND created_at > now() - interval '1 hour'
    `;
    if (Number(recentForIp[0].count) >= 10) {
      return res.status(429).json({ error: 'Too many attempts. Please try again later' });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    // Delete existing OTPs for this email before inserting a new one
    await sql`DELETE FROM email_otps WHERE email = ${email}`;
    await sql`
      INSERT INTO email_otps (email, otp_hash, ip, expires_at)
      VALUES (${email}, ${otpHash}, ${ip}, now() + interval '10 minutes')
    `;

    await sendOtpEmail(email, otp);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not send code. Please try again later' });
  }
}
