// একটাই endpoint — register এবং update দুটোতেই ব্যবহার হবে
// phone number কে unique key হিসেবে ব্যবহার করা হয়

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const user = req.body || {};
    if (!user.phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    const url   = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        // Redis configured না থাকলেও silently OK দাও — frontend ভাঙবে না
        return res.status(200).json({ ok: true, warning: 'Storage not configured' });
    }

    try {
        // আগের record আছে কিনা চেক করো (থাকলে createdAt রক্ষা করব)
        const getRes = await fetch(`${url}/get/user:${encodeURIComponent(user.phone)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const getData = await getRes.json();

        let existing = null;
        if (getData.result) {
            try { existing = JSON.parse(getData.result); } catch (e) {}
        }

        const now = new Date().toISOString();
        const record = {
            ...user,
            createdAt: existing?.createdAt || now,
            updatedAt: now
        };

        // user:phone key এ পুরো object সেভ/আপডেট করো
        await fetch(`${url}/set/user:${encodeURIComponent(user.phone)}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSON.stringify(record))
        });

        // phone list এ যোগ করো (নতুন হলে যোগ হবে, আগে থেকে থাকলে duplicate হবে না)
        await fetch(`${url}/sadd/all_users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([user.phone])
        });

        return res.status(200).json({ ok: true });

    } catch (e) {
        // Backend fail হলেও frontend এ কোনো প্রভাব পড়বে না (silent fail)
        return res.status(200).json({ ok: false, error: e.message });
    }
}
