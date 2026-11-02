import { sql } from '../lib/db.js';
import { getUserIdFromRequest, signSsoToken } from '../lib/auth.js';

export default async function handler(req, res) {
  const userId = getUserIdFromRequest(req);

  // ================= SSO মোড: Dream Lens এর মতো পার্টনার অ্যাপে সাইন করা টোকেন পাঠানো =================
  if (req.query.mode === 'sso') {
    const redirectUri = req.query.redirect_uri;
    const allowedOrigins = (process.env.SSO_ALLOWED_REDIRECT_ORIGINS || '')
      .split(',').map(s => s.trim()).filter(Boolean);

    if (!redirectUri || !allowedOrigins.some(origin => redirectUri.startsWith(origin))) {
      return res.status(400).json({
        error: `অনুমোদিত না এমন redirect_uri: "${redirectUri}" — বর্তমানে SSO_ALLOWED_REDIRECT_ORIGINS এ আছে: [${allowedOrigins.join(', ') || 'কিছুই সেট করা নেই'}]`
      });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    try {
      const rows = await sql`
        SELECT id, first_name, last_name, email, phone, banned, suspended_until
        FROM users WHERE id = ${userId}
      `;
      if (rows.length === 0) return res.status(401).json({ error: 'অ্যাকাউন্ট আর নেই' });

      const user = rows[0];
      if (user.banned) return res.status(403).json({ error: 'আপনার একাউন্ট ব্যান করা হয়েছে' });
      if (user.suspended_until && new Date(user.suspended_until) > new Date()) {
        return res.status(403).json({ error: 'আপনার একাউন্ট সাময়িকভাবে স্থগিত করা হয়েছে' });
      }

      const token = signSsoToken(user);
      const finalUrl = `${redirectUri}${redirectUri.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
      return res.status(200).json({ redirect: finalUrl });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'সার্ভার এরর' });
    }
  }

  // ================= POST: এলার্ট "পড়া হয়েছে" হিসেবে চিহ্নিত করা =================
  if (req.method === 'POST' && req.body?.action === 'dismiss_alert') {
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    try {
      const { alertId } = req.body || {};
      if (!alertId) return res.status(400).json({ error: 'alertId প্রয়োজন' });

      await sql`
        INSERT INTO alert_reads (alert_id, user_id) VALUES (${alertId}, ${userId})
        ON CONFLICT (alert_id, user_id) DO NOTHING
      `;
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'সার্ভার এরর' });
    }
  }

  // ================= স্বাভাবিক /api/me আচরণ =================
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    // ইউজার ডাটাবেজে খোঁজা হচ্ছে। এডমিন যদি ডিলিট করে থাকে, rows.length হবে 0
    // -> এভাবেই ডিলিট হওয়া ইউজার স্বয়ংক্রিয়ভাবে লগ-আউট হয়ে যাবে
    const rows = await sql`
      SELECT id, first_name, last_name, gender, dob, country, phone, email, profile_picture, banned, suspended_until
      FROM users WHERE id = ${userId}
    `;

    if (rows.length === 0) {
      return res.status(401).json({ error: 'অ্যাকাউন্ট আর নেই' });
    }

    if (rows[0].banned) {
      return res.status(403).json({ error: 'আপনার একাউন্ট ব্যান করা হয়েছে' });
    }

    if (rows[0].suspended_until && new Date(rows[0].suspended_until) > new Date()) {
      return res.status(403).json({ error: 'আপনার একাউন্ট সাময়িকভাবে স্থগিত করা হয়েছে' });
    }

    // ================= না-পড়া এলার্ট (সব ইউজারের জন্য বা এই ইউজারের জন্য নির্দিষ্ট করে পাঠানো) =================
    let alerts = [];
    try {
      alerts = await sql`
        SELECT a.id, a.message, a.created_at
        FROM alerts a
        WHERE NOT EXISTS (SELECT 1 FROM alert_reads r WHERE r.alert_id = a.id AND r.user_id = ${userId})
          AND (
            a.target_type = 'all'
            OR EXISTS (SELECT 1 FROM alert_targets t WHERE t.alert_id = a.id AND t.user_id = ${userId})
          )
        ORDER BY a.created_at ASC
      `;
    } catch (e) { alerts = []; }

    return res.status(200).json({ user: rows[0], alerts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'সার্ভার এরর' });
  }
}
