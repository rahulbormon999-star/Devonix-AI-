import { sql } from '../lib/db.js';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { firstName, lastName, gender, dob, country, phone, email, password, profilePicture } = req.body || {};

    if (!phone || !password) {
      return res.status(400).json({ error: 'ফোন নম্বর ও পাসওয়ার্ড আবশ্যক' });
    }

    const existing = await sql`SELECT id FROM users WHERE phone = ${phone}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'এই ফোন নম্বর দিয়ে আগে থেকেই একাউন্ট আছে' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (first_name, last_name, gender, dob, country, phone, email, password_hash, profile_picture)
      VALUES (${firstName || null}, ${lastName || null}, ${gender || null}, ${dob || null}, ${country || null}, ${phone}, ${email || null}, ${passwordHash}, ${profilePicture || null})
      RETURNING id
    `;

    setSessionCookie(res, result[0].id);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'সার্ভার এরর, পরে আবার চেষ্টা করুন' });
  }
}
