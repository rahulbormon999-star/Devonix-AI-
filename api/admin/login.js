import { verifyAdminPassword, setAdminSessionCookie } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { password } = req.body || {};

  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ error: 'ভুল পাসওয়ার্ড' });
  }

  setAdminSessionCookie(res);
  return res.status(200).json({ success: true });
}
