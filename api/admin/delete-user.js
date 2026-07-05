import { sql } from '../../lib/db.js';
import { isAdminSessionValid } from '../../lib/auth.js';
import { getClientIp } from '../../lib/security.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!isAdminSessionValid(req)) {
    return res.status(401).json({ error: 'Admin session invalid, please login again' });
  }

  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'User id প্রয়োজন' });

    await sql`DELETE FROM users WHERE id = ${id}`;

    // অডিট লগ - কোন ইউজার, কখন, কোন IP থেকে ডিলিট হয়েছে তার রেকর্ড রাখা হচ্ছে
    await sql`INSERT INTO audit_log (action, target_user_id, ip) VALUES ('delete_user', ${id}, ${getClientIp(req)})`;

    // ইউজারের রো ডিলিট হওয়ার সাথে সাথে /api/me আর তাকে খুঁজে পাবে না,
    // ফলে সে পরবর্তী রিকোয়েস্টেই স্বয়ংক্রিয়ভাবে লগ-আউট হয়ে যাবে
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'সার্ভার এরর' });
  }
      }
