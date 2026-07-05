import { sql } from '../lib/db.js';
import { getUserIdFromRequest } from '../lib/auth.js';

export default async function handler(req, res) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    // ইউজার ডাটাবেজে খোঁজা হচ্ছে। এডমিন যদি ডিলিট করে থাকে, rows.length হবে 0
    // -> এভাবেই ডিলিট হওয়া ইউজার স্বয়ংক্রিয়ভাবে লগ-আউট হয়ে যাবে
    const rows = await sql`
      SELECT id, first_name, last_name, gender, dob, country, phone, email, profile_picture
      FROM users WHERE id = ${userId}
    `;

    if (rows.length === 0) {
      return res.status(401).json({ error: 'অ্যাকাউন্ট আর নেই' });
    }

    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'সার্ভার এরর' });
  }
}
