export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const adminKey = req.headers['x-admin-key'] || req.query.key;
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const url   = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        return res.status(500).json({ error: 'Redis not configured' });
    }

    try {
        const listRes = await fetch(`${url}/smembers/all_users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const listData = await listRes.json();
        const phones = listData.result || [];

        if (phones.length === 0) {
            return res.status(200).json({ users: [], count: 0 });
        }

        const cmds = phones.map(p => ['GET', `user:${p}`]);
        const pipeRes = await fetch(`${url}/pipeline`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cmds)
        });
        const pipeData = await pipeRes.json();

        const users = pipeData
            .map(r => r.result)
            .filter(Boolean)
            .map(raw => {
                try {
                    const u = JSON.parse(raw);
                    if (u.password) u.password = '••••••••';
                    return u;
                } catch (e) { return null; }
            })
            .filter(Boolean)
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        return res.status(200).json({ users, count: users.length });

    } catch (e) {
        return res.status(500).json({ error: `Fetch error: ${e.message}` });
    }
      }
