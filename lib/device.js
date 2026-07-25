// User-Agent হেডার থেকে সহজ, পঠনযোগ্য ব্রাউজার/OS নাম বের করা (যেমন "Chrome on Android")
// এটা প্রতিটা ওয়েব রিকোয়েস্টেই এমনিতে পাঠানো হয়, কোনো permission popup লাগে না
export function parseDeviceInfo(userAgent) {
  if (!userAgent) return 'Unknown';

  let os = 'Unknown OS';
  if (/android/i.test(userAgent)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';
  else if (/windows/i.test(userAgent)) os = 'Windows';
  else if (/mac os/i.test(userAgent)) os = 'macOS';
  else if (/linux/i.test(userAgent)) os = 'Linux';

  let browser = 'Unknown Browser';
  if (/edg\//i.test(userAgent)) browser = 'Edge';
  else if (/chrome\//i.test(userAgent) && !/edg\//i.test(userAgent)) browser = 'Chrome';
  else if (/firefox\//i.test(userAgent)) browser = 'Firefox';
  else if (/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent)) browser = 'Safari';
  else if (/opr\//i.test(userAgent)) browser = 'Opera';

  return `${browser} on ${os}`;
}
