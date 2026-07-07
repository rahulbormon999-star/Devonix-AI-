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
      return res.status(400).json({ error: 'ফোন নম্বর, ইমেইল ও পাসওয়ার্ড আবশ্যক' });
    }

    if (!otp) {
      return res.status(400).json({ error: 'ইমেইল ভেরিফিকেশন কোড আবশ্যক' });
    }

    if (!isPasswordStrong(password)) {
      return res.status(400).json({ error: 'পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টার এবং অন্তত একটি সংখ্যা থাকতে হবে' });
    }

    if (!isImageSizeOk(profilePicture)) {
      return res.status(400).json({ error: 'ছবির সাইজ অনেক বড়, ছোট একটি ছবি দিন' });
    }

    // ================= Registration Rate Limiting (একই IP থেকে ১ ঘণ্টায় সর্বোচ্চ ৫টি একাউন্ট) =================
    const ip = getClientIp(req);
    const recentAttempts = await sql`
      SELECT COUNT(*) FROM registration_attempts
      WHERE ip = ${ip} AND created_at > now() - interval '1 hour'
    `;
    if (Number(recentAttempts[0].count) >= 5) {
      return res.status(429).json({ error: 'অনেকবার একাউন্ট তৈরির চেষ্টা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন' });
    }

    const existingPhone = await sql`SELECT id FROM users WHERE phone = ${phone}`;
    if (existingPhone.length > 0) {
      return res.status(409).json({ error: 'এই ফোন নম্বর দিয়ে আগে থেকেই একাউন্ট আছে' });
    }

    const existingEmail = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingEmail.length > 0) {
      return res.status(409).json({ error: 'এই ইমেইল দিয়ে আগে থেকেই একাউন্ট আছে' });
    }

    // ================= OTP যাচাই (এখানেই একাউন্ট তৈরির আসল সিদ্ধান্ত হয়) =================
    const otpRows = await sql`SELECT otp_hash, expires_at, attempts FROM email_otps WHERE email = ${email}`;
    if (otpRows.length === 0) {
      return res.status(400).json({ error: 'কোনো ভেরিফিকেশন কোড পাওয়া যায়নি, আগে কোড চান' });
    }

    const otpRow = otpRows[0];

    if (new Date(otpRow.expires_at) < new Date()) {
      await sql`DELETE FROM email_otps WHERE email = ${email}`;
      return res.status(400).json({ error: 'কোডের মেয়াদ শেষ হয়ে গেছে, নতুন কোড চান' });
    }

    if (otpRow.attempts >= 5) {
      await sql`DELETE FROM email_otps WHERE email = ${email}`;
      return res.status(429).json({ error: 'অনেকবার ভুল কোড দেওয়া হয়েছে, নতুন কোড চান' });
    }

    if (!verifyOtpHash(otp, otpRow.otp_hash)) {
      await sql`UPDATE email_otps SET attempts = attempts + 1 WHERE email = ${email}`;
      return res.status(400).json({ error: 'কোড সঠিক নয়' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (first_name, last_name, gender, dob, country, phone, email, password_hash, profile_picture)
      VALUES (${firstName || null}, ${lastName || null}, ${gender || null}, ${dob || null}, ${country || null}, ${phone}, ${email}, ${passwordHash}, ${profilePicture || null})
      RETURNING id
    `;

    await sql`INSERT INTO registration_attempts (ip) VALUES (${ip})`;
    // OTP ব্যবহার হয়ে গেছে, রেকর্ড মুছে ফেলা হচ্ছে
    await sql`DELETE FROM email_otps WHERE email = ${email}`;

    setSessionCookie(res, result[0].id);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'এই ফোন নম্বর বা ইমেইল দিয়ে আগে থেকেই একাউন্ট আছে' });
    }
    return res.status(500).json({ error: 'সার্ভার এরর, পরে আবার চেষ্টা করুন' });
  }
      }
