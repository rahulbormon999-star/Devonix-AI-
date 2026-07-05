import { neon } from '@neondatabase/serverless';

// DATABASE_URL হলো Vercel এ সেট করা Environment Variable (Neon connection string)
export const sql = neon(process.env.DATABASE_URL);
