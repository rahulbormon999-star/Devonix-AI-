import { sql } from '../../lib/db.js';
import { isAdminSessionValid } from '../../lib/auth.js';
import { getClientIp } from '../../lib/security.js';

function toCsvValue(value) {
  if (value === null || value === undefined) return '';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

export default async function handler(req, res) {
  if (!isAdminSessionValid(req)) {
    return res.status(401).json({ error: 'Admin session invalid, please login again' });
  }

  if (req.method === 'GET') {
    try {
      // ================= একজন ইউজারের সম্পূর্ণ বিস্তারিত ("Open" ভিউ) =================
      if (req.query.id) {
        const rows = await sql`
          SELECT id, first_name, last_name, gender, dob, country, phone, email, profile_picture,
                 created_at, banned, ban_reason, banned_at, suspended_until, suspend_reason
          FROM users WHERE id = ${req.query.id}
        `;
        if (rows.length === 0) return res.status(404).json({ error: 'ইউজার পাওয়া যায়নি' });
        return res.status(200).json({ user: rows[0] });
      }

      // ================= Analytics =================
      if (req.query.mode === 'analytics') {
        const totals = await sql`
          SELECT
            COUNT(*) AS total_users,
            COUNT(*) FILTER (WHERE banned = true) AS banned_users,
            COUNT(*) FILTER (WHERE suspended_until IS NOT NULL AND suspended_until > now()) AS suspended_users,
            COUNT(*) FILTER (WHERE created_at > now() - interval '7 days') AS new_last_7_days,
            COUNT(*) FILTER (WHERE created_at > now() - interval '30 days') AS new_last_30_days
          FROM users
        `;

        const dailySignups = await sql`
          SELECT DATE(created_at) AS day, COUNT(*) AS count
          FROM users
          WHERE created_at > now() - interval '14 days'
          GROUP BY DATE(created_at)
          ORDER BY day ASC
        `;

        const feedbackStats = await sql`
          SELECT
            COUNT(*) AS total_feedback,
            COUNT(*) FILTER (WHERE status = 'loved') AS loved,
            COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
            COUNT(*) FILTER (WHERE admin_reply IS NOT NULL) AS replied
          FROM user_feedback
        `;

        return res.status(200).json({
          totals: totals[0],
          dailySignups,
          feedback: feedbackStats[0]
        });
      }

      // ================= CSV Export =================
      if (req.query.export === 'csv') {
        const search = (req.query.search || '').trim();
        const pattern = `%${search}%`;
        const gender = (req.query.gender || 'all').toLowerCase();

        const rows = await sql`
          SELECT id, first_name, last_name, gender, dob, country, phone, email, created_at, banned
          FROM users
          WHERE
            (${search} = '' OR first_name ILIKE ${pattern} OR last_name ILIKE ${pattern} OR phone ILIKE ${pattern})
            AND (
              ${gender} = 'all'
              OR (${gender} = 'male' AND gender = 'Male')
              OR (${gender} = 'female' AND gender = 'Female')
              OR (${gender} = 'other' AND gender IS DISTINCT FROM 'Male' AND gender IS DISTINCT FROM 'Female')
            )
          ORDER BY created_at DESC
          LIMIT 5000
        `;

        const header = ['ID', 'First Name', 'Last Name', 'Gender', 'DOB', 'Country', 'Phone', 'Email', 'Registered At', 'Banned'];
        const lines = [header.join(',')];
        for (const u of rows) {
          lines.push([
            u.id, toCsvValue(u.first_name), toCsvValue(u.last_name), toCsvValue(u.gender),
            u.dob ? new Date(u.dob).toISOString().split('T')[0] : '', toCsvValue(u.country),
            toCsvValue(u.phone), toCsvValue(u.email), new Date(u.created_at).toISOString(), u.banned
          ].join(','));
        }

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="devonix-users.csv"');
        return res.status(200).send(lines.join('\n'));
      }

      // ================= ডিফল্ট: পেজ-ভিত্তিক ইউজার তালিকা =================
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
      const offset = (page - 1) * limit;
      const search = (req.query.search || '').trim();
      const pattern = `%${search}%`;
      const gender = (req.query.gender || 'all').toLowerCase();
      const bannedFilter = (req.query.banned || 'any').toLowerCase();

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
        SELECT id, first_name, last_name, gender, dob, country, phone, email, profile_picture, created_at, banned, ban_reason, banned_at, suspended_until
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

  // ================= POST: delete / ban / unban / suspend / unsuspend / update (একক বা bulk) =================
  if (req.method === 'POST') {
    try {
      const { id, ids, action, reason, days, fields } = req.body || {};
      const targetIds = Array.isArray(ids) && ids.length > 0 ? ids : (id ? [id] : []);

      if (targetIds.length === 0 || !['delete', 'ban', 'unban', 'suspend', 'unsuspend', 'update'].includes(action)) {
        return res.status(400).json({ error: 'সঠিক id/ids ও action প্রয়োজন' });
      }

      const ip = getClientIp(req);

      // ================= 'update' শুধু একজন ইউজারের জন্য (bulk প্রযোজ্য না) =================
      if (action === 'update') {
        const targetId = targetIds[0];
        const f = fields || {};

        if (f.phone) {
          const existing = await sql`SELECT id FROM users WHERE phone = ${f.phone} AND id != ${targetId}`;
          if (existing.length > 0) return res.status(409).json({ error: 'এই ফোন নম্বর অন্য একাউন্টে ব্যবহৃত হচ্ছে' });
        }
        if (f.email) {
          const existing = await sql`SELECT id FROM users WHERE email = ${f.email} AND id != ${targetId}`;
          if (existing.length > 0) return res.status(409).json({ error: 'এই ইমেইল অন্য একাউন্টে ব্যবহৃত হচ্ছে' });
        }

        await sql`
          UPDATE users SET
            first_name = COALESCE(${f.firstName ?? null}, first_name),
            last_name = COALESCE(${f.lastName ?? null}, last_name),
            gender = COALESCE(${f.gender ?? null}, gender),
            dob = COALESCE(${f.dob ?? null}, dob),
            country = COALESCE(${f.country ?? null}, country),
            email = COALESCE(${f.email ?? null}, email),
            phone = COALESCE(${f.phone ?? null}, phone)
          WHERE id = ${targetId}
        `;
        await sql`INSERT INTO audit_log (action, target_user_id, ip) VALUES ('admin_update_user', ${targetId}, ${ip})`;
        return res.status(200).json({ success: true });
      }

      // ================= বাকি action গুলো (bulk-সাপোর্টেড) =================
      for (const targetId of targetIds) {
        if (action === 'delete') {
          await sql`DELETE FROM users WHERE id = ${targetId}`;
          await sql`INSERT INTO audit_log (action, target_user_id, ip) VALUES ('delete_user', ${targetId}, ${ip})`;
        } else if (action === 'ban') {
          await sql`UPDATE users SET banned = TRUE, ban_reason = ${reason || null}, banned_at = now() WHERE id = ${targetId}`;
          await sql`INSERT INTO audit_log (action, target_user_id, ip) VALUES ('ban_user', ${targetId}, ${ip})`;
        } else if (action === 'unban') {
          await sql`UPDATE users SET banned = FALSE, ban_reason = NULL, banned_at = NULL WHERE id = ${targetId}`;
          await sql`INSERT INTO audit_log (action, target_user_id, ip) VALUES ('unban_user', ${targetId}, ${ip})`;
        } else if (action === 'suspend') {
          const suspendDays = Math.max(1, parseInt(days) || 7);
          await sql`
            UPDATE users SET suspended_until = now() + (${suspendDays} || ' days')::interval, suspend_reason = ${reason || null}
            WHERE id = ${targetId}
          `;
          await sql`INSERT INTO audit_log (action, target_user_id, ip) VALUES ('suspend_user', ${targetId}, ${ip})`;
        } else if (action === 'unsuspend') {
          await sql`UPDATE users SET suspended_until = NULL, suspend_reason = NULL WHERE id = ${targetId}`;
          await sql`INSERT INTO audit_log (action, target_user_id, ip) VALUES ('unsuspend_user', ${targetId}, ${ip})`;
        }
      }

      return res.status(200).json({ success: true, count: targetIds.length });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'সার্ভার এরর' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
      }
