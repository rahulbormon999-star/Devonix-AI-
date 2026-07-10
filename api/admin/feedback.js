import { sql } from '../../lib/db.js';
import { isAdminSessionValid } from '../../lib/auth.js';

const VALID_ACTIONS = ['love', 'reject', 'normal', 'delete'];

export default async function handler(req, res) {
  if (!isAdminSessionValid(req)) {
    return res.status(401).json({ error: 'Admin session invalid, please login again' });
  }

  // ================= GET: সব মন্তব্য তালিকা =================
  if (req.method === 'GET') {
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

  // ================= POST: love / reject / normal / delete =================
  if (req.method === 'POST') {
    try {
      const { id, action } = req.body || {};
      if (!id || !VALID_ACTIONS.includes(action)) {
        return res.status(400).json({ error: 'সঠিক id ও action প্রয়োজন' });
      }

      if (action === 'delete') {
        await sql`DELETE FROM user_feedback WHERE id = ${id}`;
        return res.status(200).json({ success: true });
      }

      const statusMap = { love: 'loved', reject: 'rejected', normal: 'normal' };
      await sql`UPDATE user_feedback SET status = ${statusMap[action]} WHERE id = ${id}`;

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'সার্ভার এরর' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
