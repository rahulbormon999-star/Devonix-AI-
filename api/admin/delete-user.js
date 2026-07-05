import { sql } from '../../lib/db.js';
import { isAdminAuthorized } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: 'Wrong admin password' });
  }

  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'User id প্রয়োজন' });

    await sql`DELETE FROM users WHERE id = ${id}`;
    // ইউজারের রো ডিলিট হওয়ার সাথে সাথে /api/me আর তাকে খুঁজে পাবে না,
    // ফলে সে পরবর্তী রিকোয়েস্টেই স্বয়ংক্রিয়ভাবে লগ-আউট হয়ে যাবে
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'সার্ভার এরর' });
  }
}
