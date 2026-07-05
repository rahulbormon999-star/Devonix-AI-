// পাসওয়ার্ড পলিসি: কমপক্ষে ৮ ক্যারেক্টার, অন্তত ১টা অক্ষর ও ১টা সংখ্যা থাকতে হবে
export function isPasswordStrong(password) {
  if (!password || password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

// Base64 ছবি সাইজ চেক (আনুমানিক ৫০০KB এর বেশি হলে বাতিল)
const MAX_IMAGE_BASE64_LENGTH = 700_000; // ~525KB আসল বাইনারি সাইজ

export function isImageSizeOk(base64String) {
  if (!base64String) return true; // ছবি না থাকলে সমস্যা নেই
  return base64String.length <= MAX_IMAGE_BASE64_LENGTH;
}

// রিকোয়েস্টের IP বের করা (Vercel প্রক্সির পেছনে x-forwarded-for ব্যবহার করে)
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}
