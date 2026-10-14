import crypto from 'node:crypto';

const hmac = (p) => crypto.createHmac('sha256', process.env.SESSION_SECRET || '').update(p).digest('base64url');

export const COOKIE = 'hz_admin';
export const configured = () => !!(process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET);

export function sign(ms = 7 * 864e5) {
  const p = Buffer.from(JSON.stringify({ exp: Date.now() + ms })).toString('base64url');
  return `${p}.${hmac(p)}`;
}

export function isAdmin(req) {
  if (!configured()) return false;
  const m = (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return false;
  const [p, s] = m[1].split('.');
  if (!p || !s) return false;
  const a = Buffer.from(s), b = Buffer.from(hmac(p));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try { return JSON.parse(Buffer.from(p, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}

export function samePassword(a, b) {
  const h = (x) => crypto.createHash('sha256').update(String(x)).digest();
  return crypto.timingSafeEqual(h(a), h(b));
}
