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
        error: `অনুমোদিত না এমন redirect_uri: "${redirectUri}" — এটা SSO_ALLOWED_REDIRECT_ORIGINS এর সাথে মিলছে না`
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

  // ================= স্বাভাবিক /api/me আচরণ (অপরিবর্তিত) =================
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

    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'সার্ভার এরর' });
  }
}
