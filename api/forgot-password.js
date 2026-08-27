import { sql } from '../lib/db.js';
import bcrypt from 'bcryptjs';
import { generateOtp, hashOtp, verifyOtpHash } from '../lib/otp.js';
import { sendOtpEmail } from '../lib/email.js';
import { getClientIp, isPasswordStrong } from '../lib/security.js';
import { setSessionCookie } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action } = req.body || {};

  if (action === 'request') return handleRequest(req, res);
  if (action === 'reset') return handleReset(req, res);
  return res.status(400).json({ error: 'Invalid action' });
}

// ================= Step 1: Request OTP with phone number =================
async function handleRequest(req, res) {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    const rows = await sql`SELECT email, banned FROM users WHERE phone = ${phone}`;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No account found with this phone number' });
    }

    const user = rows[0];

    if (user.banned) {
      return res.status(403).json({ error: 'This account has been banned' });
    }
    if (!user.email) {
      return res.status(400).json({ error: 'No email associated with this account, please contact admin' });
    }

    // Rate limit: Max 3 requests per 15 minutes for the same email
    const recent = await sql`
      SELECT COUNT(*) FROM email_otps
      WHERE email = ${user.email} AND created_at > now() - interval '15 minutes'
    `;
    if (Number(recent[0].count) >= 3) {
      return res.status(429).json({ error: 'Too many attempts, please try again after 15 minutes' });
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
    return res.status(500).json({ error: 'Could not send code, please try again later' });
  }
}

// ================= Step 2: Reset with OTP + new password =================
async function handleReset(req, res) {
  try {
    const { phone, otp, newPassword } = req.body || {};

    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!isPasswordStrong(newPassword)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters and contain at least one number and one letter' });
    }

    const rows = await sql`SELECT id, email FROM users WHERE phone = ${phone}`;
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid code' });
    }
    const user = rows[0];

    const otpRows = await sql`SELECT otp_hash, expires_at, attempts FROM email_otps WHERE email = ${user.email}`;
    if (otpRows.length === 0) {
      return res.status(400).json({ error: 'No code found, please request a code first' });
    }
    const otpRow = otpRows[0];

    if (new Date(otpRow.expires_at) < new Date()) {
      await sql`DELETE FROM email_otps WHERE email = ${user.email}`;
      return res.status(400).json({ error: 'Code expired, please request a new code' });
    }

    if (otpRow.attempts >= 5) {
      await sql`DELETE FROM email_otps WHERE email = ${user.email}`;
      return res.status(429).json({ error: 'Too many incorrect codes entered, please request a new code' });
    }

    if (!verifyOtpHash(otp, otpRow.otp_hash)) {
      await sql`UPDATE email_otps SET attempts = attempts + 1 WHERE email = ${user.email}`;
      return res.status(400).json({ error: 'Invalid code' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await sql`
      UPDATE users SET password_hash = ${passwordHash}, failed_login_attempts = 0, locked_until = NULL
      WHERE id = ${user.id}
    `;
    await sql`DELETE FROM email_otps WHERE email = ${user.email}`;

    // Log the user in directly after successful password reset
    setSessionCookie(res, user.id);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not change password, please try again later' });
  }
}

function maskEmail(email) {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  if (name.length <= 2) return name[0] + '***@' + domain;
  return name.slice(0, 2) + '***@' + domain;
    }
