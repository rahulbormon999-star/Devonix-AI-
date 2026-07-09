import { sql } from '../lib/db.js';
import { getUserIdFromRequest } from '../lib/auth.js';

const MAX_MESSAGE_LENGTH = 1000;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'মন্তব্য খালি রাখা যাবে না' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `মন্তব্য সর্বোচ্চ ${MAX_MESSAGE_LENGTH} ক্যারেক্টার হতে পারে` });
    }

    // দিনে একবারই মন্তব্য পাঠানো যাবে (গত ২৪ ঘণ্টায় ইতিমধ্যে পাঠিয়ে থাকলে আটকানো হবে)
    const recent = await sql`
      SELECT id FROM user_feedback
      WHERE user_id = ${userId} AND created_at > now() - interval '24 hours'
    `;
    if (recent.length > 0) {
      return res.status(429).json({ error: 'আপনি আজ ইতিমধ্যে মন্তব্য পাঠিয়েছেন, আগামীকাল আবার চেষ্টা করুন' });
    }

    await sql`INSERT INTO user_feedback (user_id, message) VALUES (${userId}, ${message.trim()})`;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'মন্তব্য পাঠানো যায়নি, পরে আবার চেষ্টা করুন' });
  }
}
