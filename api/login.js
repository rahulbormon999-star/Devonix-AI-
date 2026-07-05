import { sql } from '../lib/db.js';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { phone, password } = req.body || {};
    if (!phone || !password) {
      return res.status(400).json({ error: 'ফোন নম্বর ও পাসওয়ার্ড আবশ্যক' });
    }

    const rows = await sql`SELECT id, password_hash FROM users WHERE phone = ${phone}`;
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    setSessionCookie(res, rows[0].id);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'সার্ভার এরর, পরে আবার চেষ্টা করুন' });
  }
}
