import { sql } from '../lib/db.js';
import { getUserIdFromRequest, signSsoToken } from '../lib/auth.js';

export default async function handler(req, res) {
  const userId = getUserIdFromRequest(req);

  // ================= SSO Mode: Sending signed token to partner apps like Dream Lens =================
  if (req.query.mode === 'sso') {
    const redirectUri = req.query.redirect_uri;
    const allowedOrigins = (process.env.SSO_ALLOWED_REDIRECT_ORIGINS || '')
      .split(',').map(s => s.trim()).filter(Boolean);

    if (!redirectUri || !allowedOrigins.some(origin => redirectUri.startsWith(origin))) {
      return res.status(400).json({
        error: `Unauthorized redirect_uri: "${redirectUri}" — it does not match SSO_ALLOWED_REDIRECT_ORIGINS`
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
      if (rows.length === 0) return res.status(401).json({ error: 'Account no longer exists' });

      const user = rows[0];
      if (user.banned) return res.status(403).json({ error: 'Your account has been banned' });
      if (user.suspended_until && new Date(user.suspended_until) > new Date()) {
        return res.status(403).json({ error: 'Your account has been temporarily suspended' });
      }

      const token = signSsoToken(user);
      const finalUrl = `${redirectUri}${redirectUri.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
      return res.status(200).json({ redirect: finalUrl });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // ================= Normal /api/me behavior (Unchanged) =================
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    // Checking if user exists in DB. If admin deleted it, rows.length will be 0
    // -> This automatically logs out a deleted user
    const rows = await sql`
      SELECT id, first_name, last_name, gender, dob, country, phone, email, profile_picture, banned, suspended_until
      FROM users WHERE id = ${userId}
    `;

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Account no longer exists' });
    }

    if (rows[0].banned) {
      return res.status(403).json({ error: 'Your account has been banned' });
    }

    if (rows[0].suspended_until && new Date(rows[0].suspended_until) > new Date()) {
      return res.status(403).json({ error: 'Your account has been temporarily suspended' });
    }

    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
