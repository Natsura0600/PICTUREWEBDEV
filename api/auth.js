import { COOKIE, missingEnv, isAdmin, sign, samePassword, adminPassword } from '../lib/auth.js';

const attrs = 'HttpOnly; Secure; SameSite=Strict; Path=/';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    // ¿Hay una sesión válida? (nunca falla: sin sesión devuelve ok:false)
    if (req.method === 'GET') return res.status(200).json({ ok: isAdmin(req) });

    // Iniciar sesión
    if (req.method === 'POST') {
      const missing = missingEnv();
      if (missing.length) return res.status(500).json({ error: 'config', missing });

      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
      const pw = body && typeof body.password === 'string' ? body.password.trim() : '';

      if (!pw || !samePassword(pw, adminPassword())) {
        await new Promise((r) => setTimeout(r, 800)); // frena los intentos al azar
        return res.status(401).json({ ok: false });
      }
      res.setHeader('Set-Cookie', `${COOKIE}=${sign()}; ${attrs}; Max-Age=${7 * 86400}`);
      return res.status(200).json({ ok: true });
    }

    // Cerrar sesión
    if (req.method === 'DELETE') {
      res.setHeader('Set-Cookie', `${COOKIE}=; ${attrs}; Max-Age=0`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).end();
  } catch (e) {
    console.error('auth error', e); // se ve en Vercel > Logs
    return res.status(500).json({ error: 'server', detail: String((e && e.message) || e).slice(0, 200) });
  }
}
