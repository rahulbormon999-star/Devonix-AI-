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

    await sql`
      UPDATE users SET banned = FALSE, ban_reason = NULL, banned_at = NULL
      WHERE id = ${id}
    `;

    await sql`INSERT INTO audit_log (action, target_user_id, ip) VALUES ('unban_user', ${id}, ${getClientIp(req)})`;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'সার্ভার এরর' });
  }
}
