import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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

// ================= ADMIN SESSION (cookie + JWT ভিত্তিক, প্রতি রিকোয়েস্টে পাসওয়ার্ড পাঠানো লাগবে না) =================

// টাইমিং অ্যাটাক এড়াতে constant-time পাসওয়ার্ড তুলনা
export function verifyAdminPassword(inputPassword) {
  const real = process.env.ADMIN_PASSWORD || '';
  const input = inputPassword || '';
  const realBuf = Buffer.from(real);
  const inputBuf = Buffer.from(input);
  if (realBuf.length !== inputBuf.length) {
    // দৈর্ঘ্য ভিন্ন হলেও constant-time compare বজায় রাখতে ডামি বাফার দিয়ে তুলনা করা হচ্ছে
    crypto.timingSafeEqual(Buffer.alloc(realBuf.length), Buffer.alloc(realBuf.length));
    return false;
  }
  return crypto.timingSafeEqual(realBuf, inputBuf);
}

export function setAdminSessionCookie(res) {
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.setHeader(
    'Set-Cookie',
    `admin_session=${token}; HttpOnly; Path=/; Max-Age=${12 * 60 * 60}; SameSite=Strict; Secure`
  );
}

export function clearAdminSessionCookie(res) {
  res.setHeader('Set-Cookie', `admin_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure`);
}

// অ্যাডমিন cookie session যাচাই (নতুন, সুপারিশকৃত পদ্ধতি)
export function isAdminSessionValid(req) {
  const cookies = parseCookies(req);
  const token = cookies.admin_session;
  if (!token) return false;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
