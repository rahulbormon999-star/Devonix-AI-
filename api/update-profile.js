import { sql } from '../lib/db.js';
import { getUserIdFromRequest } from '../lib/auth.js';
import { isImageSizeOk } from '../lib/security.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    const { firstName, lastName, gender, dob, country, email, profilePicture, phone } = req.body || {};

    if (!isImageSizeOk(profilePicture)) {
      return res.status(400).json({ error: 'ছবির সাইজ অনেক বড়, ছোট একটি ছবি দিন' });
    }

    // ফোন নম্বর পরিবর্তন করলে সেটা অন্য কোনো একাউন্টে ব্যবহৃত কিনা যাচাই করা হচ্ছে
    if (phone) {
      const existing = await sql`SELECT id FROM users WHERE phone = ${phone} AND id != ${userId}`;
      if (existing.length > 0) {
        return res.status(409).json({ error: 'এই ফোন নম্বর অন্য একাউন্টে ব্যবহৃত হচ্ছে' });
      }
    }

    // ইমেইল পরিবর্তন করলে সেটাও uniqueness যাচাই করা হচ্ছে
    if (email) {
      const existingEmail = await sql`SELECT id FROM users WHERE email = ${email} AND id != ${userId}`;
      if (existingEmail.length > 0) {
        return res.status(409).json({ error: 'এই ইমেইল অন্য একাউন্টে ব্যবহৃত হচ্ছে' });
      }
    }

    await sql`
      UPDATE users SET
        first_name = COALESCE(${firstName}, first_name),
        last_name = COALESCE(${lastName}, last_name),
        gender = COALESCE(${gender}, gender),
        dob = COALESCE(${dob}, dob),
        country = COALESCE(${country}, country),
        email = COALESCE(${email}, email),
        profile_picture = COALESCE(${profilePicture}, profile_picture),
        phone = COALESCE(${phone}, phone)
      WHERE id = ${userId}
    `;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'এই ফোন নম্বর বা ইমেইল অন্য একাউন্টে ব্যবহৃত হচ্ছে' });
    }
    return res.status(500).json({ error: 'সার্ভার এরর' });
  }
}
