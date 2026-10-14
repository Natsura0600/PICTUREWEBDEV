import { COOKIE, configured, isAdmin, sign, samePassword } from '../lib/auth.js';

const attrs = 'HttpOnly; Secure; SameSite=Strict; Path=/';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') return res.status(200).json({ ok: isAdmin(req) });

  if (req.method === 'POST') {
    if (!configured()) return res.status(500).json({ error: 'config' });
    const pw = req.body && req.body.password;
    if (typeof pw !== 'string' || !samePassword(pw, process.env.ADMIN_PASSWORD)) {
      await new Promise((r) => setTimeout(r, 800)); // frena los intentos al azar
      return res.status(401).json({ ok: false });
    }
    res.setHeader('Set-Cookie', `${COOKIE}=${sign()}; ${attrs}; Max-Age=${7 * 86400}`);
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', `${COOKIE}=; ${attrs}; Max-Age=0`);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
