import { sql } from '../../lib/db.js';
import { isAdminSessionValid } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (!isAdminSessionValid(req)) {
    return res.status(401).json({ error: 'Admin session invalid, please login again' });
  }

  try {
    const rows = await sql`
      SELECT f.id, f.message, f.status, f.created_at,
             u.id AS user_id, u.first_name, u.last_name, u.phone, u.profile_picture
      FROM user_feedback f
      JOIN users u ON u.id = f.user_id
      ORDER BY f.created_at DESC
    `;
    return res.status(200).json({ feedback: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'সার্ভার এরর' });
  }
}
