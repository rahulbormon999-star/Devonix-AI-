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
      return res.status(400).json({ error: 'ফোন নম্বর ও পাসওয়ার্ড আবশ্যক' });
    }

    const rows = await sql`
      SELECT id, password_hash, failed_login_attempts, locked_until, first_name, last_name, phone, profile_picture, banned, ban_reason
      FROM users WHERE phone = ${phone}
    `;
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    if (user.banned) {
      return res.status(403).json({ error: 'আপনার একাউন্ট ব্যান করা হয়েছে' + (user.ban_reason ? `: ${user.ban_reason}` : '') });
    }

    // ================= Account Lockout চেক =================
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const minutesLeft = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(423).json({ error: `অনেকবার ভুল পাসওয়ার্ড দেওয়া হয়েছে, ${minutesLeft} মিনিট পর আবার চেষ্টা করুন` });
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
        return res.status(423).json({ error: `অনেকবার ভুল পাসওয়ার্ড দেওয়া হয়েছে, ${LOCK_MINUTES} মিনিট পর আবার চেষ্টা করুন` });
      }

      await sql`UPDATE users SET failed_login_attempts = ${attempts} WHERE id = ${user.id}`;
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // সফল লগইন হলে failed attempt কাউন্টার রিসেট
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
    return res.status(500).json({ error: 'সার্ভার এরর, পরে আবার চেষ্টা করুন' });
  }
}
