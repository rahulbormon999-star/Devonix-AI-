import { sql } from '../../lib/db.js';
import { isAdminSessionValid } from '../../lib/auth.js';

const VALID_ACTIONS = ['love', 'reject', 'normal', 'delete'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!isAdminSessionValid(req)) {
    return res.status(401).json({ error: 'Admin session invalid, please login again' });
  }

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
