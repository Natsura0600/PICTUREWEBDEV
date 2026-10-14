import crypto from 'node:crypto';

// Lee una variable de entorno y le saca espacios o saltos de línea sobrantes (típico al copiar y pegar)
const env = (n) => String(process.env[n] ?? '').trim();

export const COOKIE = 'hz_admin';
export const missingEnv = () => ['ADMIN_PASSWORD', 'SESSION_SECRET'].filter((n) => !env(n));
export const configured = () => missingEnv().length === 0;
export const adminPassword = () => env('ADMIN_PASSWORD');

const hmac = (p) => crypto.createHmac('sha256', env('SESSION_SECRET')).update(p).digest('base64url');

export function sign(ms = 7 * 864e5) {
  const p = Buffer.from(JSON.stringify({ exp: Date.now() + ms })).toString('base64url');
  return `${p}.${hmac(p)}`;
}

export function isAdmin(req) {
  try {
    if (!configured()) return false;
    const m = (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
    if (!m) return false;
    const [p, s] = m[1].split('.');
    if (!p || !s) return false;
    const a = Buffer.from(s), b = Buffer.from(hmac(p));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    return JSON.parse(Buffer.from(p, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
}

export function samePassword(a, b) {
  const h = (x) => crypto.createHash('sha256').update(String(x)).digest();
  return crypto.timingSafeEqual(h(a), h(b));
}
