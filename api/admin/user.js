import { sql } from '../../lib/db.js';
import { isAdminSessionValid } from '../../lib/auth.js';
import { getClientIp } from '../../lib/security.js';

export default async function handler(req, res) {
  if (!isAdminSessionValid(req)) {
    return res.status(401).json({ error: 'Admin session invalid, please login again' });
  }

  // ================= GET: ইউজার তালিকা =================
  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT id, first_name, last_name, gender, dob, country, phone, email, profile_picture, created_at, banned, ban_reason, banned_at
        FROM users ORDER BY created_at DESC
      `;
      return res.status(200).json({ users: rows });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'সার্ভার এরর' });
    }
  }

  // ================= POST: delete / ban / unban =================
  if (req.method === 'POST') {
    try {
      const { id, action, reason } = req.body || {};
      if (!id || !['delete', 'ban', 'unban'].includes(action)) {
        return res.status(400).json({ error: 'সঠিক id ও action প্রয়োজন' });
      }

      const ip = getClientIp(req);

      if (action === 'delete') {
        await sql`DELETE FROM users WHERE id = ${id}`;
        await sql`INSERT INTO audit_log (action, target_user_id, ip) VALUES ('delete_user', ${id}, ${ip})`;
      } else if (action === 'ban') {
        await sql`UPDATE users SET banned = TRUE, ban_reason = ${reason || null}, banned_at = now() WHERE id = ${id}`;
        await sql`INSERT INTO audit_log (action, target_user_id, ip) VALUES ('ban_user', ${id}, ${ip})`;
      } else if (action === 'unban') {
        await sql`UPDATE users SET banned = FALSE, ban_reason = NULL, banned_at = NULL WHERE id = ${id}`;
        await sql`INSERT INTO audit_log (action, target_user_id, ip) VALUES ('unban_user', ${id}, ${ip})`;
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'সার্ভার এরর' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
