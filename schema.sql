CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  gender TEXT,
  dob DATE,
  country TEXT,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  password_hash TEXT NOT NULL,
  profile_picture TEXT,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ================= নিরাপত্তা আপডেট (আগে থেকে টেবিল থাকলে এই অংশটুকু আলাদাভাবে রান করুন) =================

-- Email দিয়ে একাধিক একাউন্ট বন্ধ করার জন্য UNIQUE constraint
-- (যদি আগে থেকে ডুপ্লিকেট email থাকে তাহলে এই কমান্ড এরর দেবে, আগে ডুপ্লিকেট ঠিক করতে হবে)
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Login lockout ট্র্যাক করার জন্য কলাম (নতুন টেবিলে উপরেই আছে, পুরনো টেবিলে এভাবে যোগ করুন)
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;

-- Registration spam/rate-limit ট্র্যাক করার টেবিল
CREATE TABLE IF NOT EXISTS registration_attempts (
  id SERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin কার্যক্রমের audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  target_user_id INT,
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Email OTP ভেরিফিকেশন (রেজিস্ট্রেশনের সময়)
CREATE TABLE IF NOT EXISTS email_otps (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  ip TEXT,
  attempts INT DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_email_otps_email ON email_otps(email);

-- Ban সিস্টেম (আগে থেকে টেবিল থাকলে এই কলামগুলো যোগ করুন)
ALTER TABLE users ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;

-- ইউজার ফিডব্যাক/মন্তব্য সিস্টেম ("SMS")
CREATE TABLE IF NOT EXISTS user_feedback (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'normal', -- 'normal' | 'loved' | 'rejected'
  admin_reply TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created ON user_feedback(created_at);

-- আগে থেকে টেবিল থাকলে এই দুইটা কলাম আলাদাভাবে যোগ করুন
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
