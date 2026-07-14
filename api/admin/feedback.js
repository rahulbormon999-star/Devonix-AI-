import { sql } from '../../lib/db.js';
import { isAdminSessionValid } from '../../lib/auth.js';
import { sendReplyEmail } from '../../lib/email.js';

const VALID_ACTIONS = ['love', 'reject', 'normal', 'delete', 'reply'];

export default async function handler(req, res) {
  if (!isAdminSessionValid(req)) {
    return res.status(401).json({ error: 'Admin session invalid, please login again' });
  }

  // ================= GET: সব মন্তব্য তালিকা =================
  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT f.id, f.message, f.status, f.created_at, f.admin_reply, f.replied_at,
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

  // ================= POST: love / reject / normal / delete / reply =================
  if (req.method === 'POST') {
    try {
      const { id, action, replyMessage } = req.body || {};
      if (!id || !VALID_ACTIONS.includes(action)) {
        return res.status(400).json({ error: 'সঠিক id ও action প্রয়োজন' });
      }

      if (action === 'delete') {
        await sql`DELETE FROM user_feedback WHERE id = ${id}`;
        return res.status(200).json({ success: true });
      }

      if (action === 'reply') {
        if (!replyMessage || !replyMessage.trim()) {
          return res.status(400).json({ error: 'উত্তর লিখুন' });
        }

        const rows = await sql`
          SELECT f.message, u.email, u.first_name, u.last_name
          FROM user_feedback f
          JOIN users u ON u.id = f.user_id
          WHERE f.id = ${id}
        `;
        if (rows.length === 0) {
          return res.status(404).json({ error: 'মন্তব্য পাওয়া যায়নি' });
        }

        const row = rows[0];
        if (!row.email) {
          return res.status(400).json({ error: 'এই ইউজারের কোনো ইমেইল নেই' });
        }

        const userName = `${row.first_name || ''} ${row.last_name || ''}`.trim();
        await sendReplyEmail(row.email, userName, row.message, replyMessage.trim());

        await sql`UPDATE user_feedback SET admin_reply = ${replyMessage.trim()}, replied_at = now() WHERE id = ${id}`;
        return res.status(200).json({ success: true });
      }

      const statusMap = { love: 'loved', reject: 'rejected', normal: 'normal' };
      await sql`UPDATE user_feedback SET status = ${statusMap[action]} WHERE id = ${id}`;

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'সার্ভার এরর, রিপ্লাই পাঠানো যায়নি' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
