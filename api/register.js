import { sql } from '../lib/db.js';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '../lib/auth.js';
import { isPasswordStrong, isImageSizeOk, getClientIp } from '../lib/security.js';
import { verifyOtpHash } from '../lib/otp.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { firstName, lastName, gender, dob, country, phone, email, password, profilePicture, otp } = req.body || {};

    if (!phone || !password || !email) {
      return res.status(400).json({ error: 'Phone number, email, and password are required' });
    }

    if (!otp) {
      return res.status(400).json({ error: 'Email verification code is required' });
    }

    if (!isPasswordStrong(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one number' });
    }

    if (!isImageSizeOk(profilePicture)) {
      return res.status(400).json({ error: 'Image size is too large. Please provide a smaller image' });
    }

    // ================= Registration Rate Limiting (Max 5 accounts per IP in 1 hour) =================
    const ip = getClientIp(req);
    const recentAttempts = await sql`
      SELECT COUNT(*) FROM registration_attempts
      WHERE ip = ${ip} AND created_at > now() - interval '1 hour'
    `;
    if (Number(recentAttempts[0].count) >= 5) {
      return res.status(429).json({ error: 'Too many account creation attempts. Please try again later' });
    }

    const existingPhone = await sql`SELECT id FROM users WHERE phone = ${phone}`;
    if (existingPhone.length > 0) {
      return res.status(409).json({ error: 'An account already exists with this phone number' });
    }

    const existingEmail = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingEmail.length > 0) {
      return res.status(409).json({ error: 'An account already exists with this email' });
    }

    // ================= OTP Verification =================
    const otpRows = await sql`SELECT otp_hash, expires_at, attempts FROM email_otps WHERE email = ${email}`;
    if (otpRows.length === 0) {
      return res.status(400).json({ error: 'No verification code found. Please request a new code' });
    }

    const otpRow = otpRows[0];

    if (new Date(otpRow.expires_at) < new Date()) {
      await sql`DELETE FROM email_otps WHERE email = ${email}`;
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code' });
    }

    if (otpRow.attempts >= 5) {
      await sql`DELETE FROM email_otps WHERE email = ${email}`;
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new code' });
    }

    if (!verifyOtpHash(otp, otpRow.otp_hash)) {
      await sql`UPDATE email_otps SET attempts = attempts + 1 WHERE email = ${email}`;
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (first_name, last_name, gender, dob, country, phone, email, password_hash, profile_picture)
      VALUES (${firstName || null}, ${lastName || null}, ${gender || null}, ${dob || null}, ${country || null}, ${phone}, ${email}, ${passwordHash}, ${profilePicture || null})
      RETURNING id
    `;

    await sql`INSERT INTO registration_attempts (ip) VALUES (${ip})`;
    // OTP used, delete record
    await sql`DELETE FROM email_otps WHERE email = ${email}`;

    setSessionCookie(res, result[0].id);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'An account already exists with this phone number or email' });
    }
    return res.status(500).json({ error: 'Server error. Please try again later' });
  }
        }
