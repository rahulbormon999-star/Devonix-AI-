import { sql } from '../lib/db.js';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '../lib/auth.js';
import { isPasswordStrong, isImageSizeOk, getClientIp } from '../lib/security.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { firstName, lastName, gender, dob, country, phone, email, password, profilePicture } = req.body || {};

    if (!phone || !password) {
      return res.status(400).json({ error: 'ফোন নম্বর ও পাসওয়ার্ড আবশ্যক' });
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

    if (email) {
      const existingEmail = await sql`SELECT id FROM users WHERE email = ${email}`;
      if (existingEmail.length > 0) {
        return res.status(409).json({ error: 'এই ইমেইল দিয়ে আগে থেকেই একাউন্ট আছে' });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (first_name, last_name, gender, dob, country, phone, email, password_hash, profile_picture)
      VALUES (${firstName || null}, ${lastName || null}, ${gender || null}, ${dob || null}, ${country || null}, ${phone}, ${email || null}, ${passwordHash}, ${profilePicture || null})
      RETURNING id
    `;

    await sql`INSERT INTO registration_attempts (ip) VALUES (${ip})`;

    setSessionCookie(res, result[0].id);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    // Postgres unique_violation কোড (email/phone race condition এর ক্ষেত্রে)
    if (err.code === '23505') {
      return res.status(409).json({ error: 'এই ফোন নম্বর বা ইমেইল দিয়ে আগে থেকেই একাউন্ট আছে' });
    }
    return res.status(500).json({ error: 'সার্ভার এরর, পরে আবার চেষ্টা করুন' });
  }
}
