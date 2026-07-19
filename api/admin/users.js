import { sql } from '../../lib/db.js';
import { isAdminSessionValid } from '../../lib/auth.js';
import { getClientIp } from '../../lib/security.js';

export default async function handler(req, res) {
  if (!isAdminSessionValid(req)) {
    return res.status(401).json({ error: 'Admin session invalid, please login again' });
  }

  // ================= GET: পেজ-ভিত্তিক ইউজার তালিকা (search/gender/banned ফিল্টার সহ) =================
  if (req.method === 'GET') {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
      const offset = (page - 1) * limit;
      const search = (req.query.search || '').trim();
      const pattern = `%${search}%`;
      const gender = (req.query.gender || 'all').toLowerCase();
      const bannedFilter = (req.query.banned || 'any').toLowerCase();

      // পুরো টেবিলের উপর ভিত্তি করে (পেজিনেশন ছাড়াই) স্ট্যাটস - ড্যাশবোর্ডের কার্ডে দেখানোর জন্য
      const statsRows = await sql`
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE gender = 'Male') AS male,
          COUNT(*) FILTER (WHERE gender = 'Female') AS female,
          COUNT(*) FILTER (WHERE gender IS DISTINCT FROM 'Male' AND gender IS DISTINCT FROM 'Female') AS other,
          COUNT(*) FILTER (WHERE banned = true) AS banned
        FROM users
      `;
      const stats = statsRows[0];

      const countRows = await sql`
        SELECT COUNT(*) FROM users
        WHERE
          (${search} = '' OR first_name ILIKE ${pattern} OR last_name ILIKE ${pattern} OR phone ILIKE ${pattern})
          AND (
            ${gender} = 'all'
            OR (${gender} = 'male' AND gender = 'Male')
            OR (${gender} = 'female' AND gender = 'Female')
            OR (${gender} = 'other' AND gender IS DISTINCT FROM 'Male' AND gender IS DISTINCT FROM 'Female')
          )
          AND (
            ${bannedFilter} = 'any'
            OR (${bannedFilter} = 'true' AND banned = true)
            OR (${bannedFilter} = 'false' AND banned = false)
          )
      `;
      const total = Number(countRows[0].count);

      const rows = await sql`
        SELECT id, first_name, last_name, gender, dob, country, phone, email, profile_picture, created_at, banned, ban_reason, banned_at
        FROM users
        WHERE
          (${search} = '' OR first_name ILIKE ${pattern} OR last_name ILIKE ${pattern} OR phone ILIKE ${pattern})
          AND (
            ${gender} = 'all'
            OR (${gender} = 'male' AND gender = 'Male')
            OR (${gender} = 'female' AND gender = 'Female')
            OR (${gender} = 'other' AND gender IS DISTINCT FROM 'Male' AND gender IS DISTINCT FROM 'Female')
          )
          AND (
            ${bannedFilter} = 'any'
            OR (${bannedFilter} = 'true' AND banned = true)
            OR (${bannedFilter} = 'false' AND banned = false)
          )
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      return res.status(200).json({
        users: rows,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        stats
      });
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
