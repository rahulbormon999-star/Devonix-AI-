import jwt from 'jsonwebtoken';

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx > -1) {
      const key = pair.slice(0, idx).trim();
      const val = pair.slice(idx + 1).trim();
      cookies[key] = decodeURIComponent(val);
    }
  });
  return cookies;
}

// কুকি থেকে userId বের করে। টোকেন না থাকলে বা ভুল হলে null রিটার্ন করবে।
export function getUserIdFromRequest(req) {
  const cookies = parseCookies(req);
  const token = cookies.session;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.userId;
  } catch {
    return null;
  }
}

export function setSessionCookie(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '90d' });
  res.setHeader(
    'Set-Cookie',
    `session=${token}; HttpOnly; Path=/; Max-Age=${90 * 24 * 60 * 60}; SameSite=Lax; Secure`
  );
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure`);
}

// অ্যাডমিন পাসওয়ার্ড যাচাই (হেডার থেকে)
export function isAdminAuthorized(req) {
  const password = req.headers['x-admin-password'];
  return password && password === process.env.ADMIN_PASSWORD;
}
