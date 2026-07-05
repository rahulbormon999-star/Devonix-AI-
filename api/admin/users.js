import { sql } from '../../lib/db.js';
import { isAdminSessionValid } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (!isAdminSessionValid(req)) {
    return res.status(401).json({ error: 'Admin session invalid, please login again' });
  }

  try {
    const rows = await sql`
      SELECT id, first_name, last_name, gender, dob, country, phone, email, profile_picture, created_at
      FROM users ORDER BY created_at DESC
    `;
    return res.status(200).json({ users: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'সার্ভার এরর' });
  }
}
