import { clearAdminSessionCookie } from '../../lib/auth.js';

export default async function handler(req, res) {
  clearAdminSessionCookie(res);
  return res.status(200).json({ success: true });
}
