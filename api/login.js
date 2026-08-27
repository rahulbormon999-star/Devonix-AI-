import { sql } from '../lib/db.js';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '../lib/auth.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { phone, password } = req.body || {};
    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone number and password are required' });
    }

    const rows = await sql`
      SELECT id, password_hash, failed_login_attempts, locked_until, first_name, last_name, phone, profile_picture, banned, ban_reason, suspended_until, suspend_reason
      FROM users WHERE phone = ${phone}
    `;
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    if (user.banned) {
      return res.status(403).json({ error: 'Your account has been banned' + (user.ban_reason ? `: ${user.ban_reason}` : '') });
    }

    if (user.suspended_until && new Date(user.suspended_until) > new Date()) {
      const until = new Date(user.suspended_until).toLocaleString();
      return res.status(403).json({ error: `Your account has been temporarily suspended (until ${until})` + (user.suspend_reason ? `: ${user.suspend_reason}` : '') });
    }

    // ================= Account Lockout Check =================
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const minutesLeft = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(423).json({ error: `Too many incorrect password attempts. Please try again in ${minutesLeft} minutes` });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      const attempts = (user.failed_login_attempts || 0) + 1;

      if (attempts >= MAX_FAILED_ATTEMPTS) {
        await sql`
          UPDATE users SET failed_login_attempts = ${attempts},
          locked_until = now() + interval '15 minutes'
          WHERE id = ${user.id}
        `;
        return res.status(423).json({ error: `Too many incorrect password attempts. Please try again in ${LOCK_MINUTES} minutes` });
      }

      await sql`UPDATE users SET failed_login_attempts = ${attempts} WHERE id = ${user.id}`;
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset failed attempt counter on successful login
    await sql`UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ${user.id}`;

    setSessionCookie(res, user.id);
    return res.status(200).json({
      success: true,
      user: {
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        profilePicture: user.profile_picture
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error. Please try again later' });
  }
          }
