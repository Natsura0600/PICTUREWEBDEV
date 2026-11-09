import 'server-only';
import crypto from 'node:crypto';
import { getAuthEnv, missingAuthEnv } from './env';

/** Mismo nombre de cookie y mismo formato que el panel actual: las sesiones abiertas siguen valiendo. */
export const COOKIE = 'hz_admin';
const WEEK_MS = 7 * 864e5;

const hmac = (payload: string): string =>
  crypto.createHmac('sha256', getAuthEnv().SESSION_SECRET).update(payload).digest('base64url');

export function signSession(ms = WEEK_MS): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + ms })).toString('base64url');
  return `${payload}.${hmac(payload)}`;
}

export function verifySession(token: string | undefined): boolean {
  try {
    if (!token || missingAuthEnv().length) return false;
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return false;
    const a = Buffer.from(sig);
    const b = Buffer.from(hmac(payload));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    const data: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof data === 'object' && data !== null && 'exp' in data && Number(data.exp) > Date.now();
  } catch {
    return false;
  }
}

export function isAdminRequest(req: Request): boolean {
  const cookie = req.headers.get('cookie') ?? '';
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return verifySession(m?.[1]);
}

export function samePassword(input: string): boolean {
  const h = (x: string) => crypto.createHash('sha256').update(x).digest();
  return crypto.timingSafeEqual(h(input), h(getAuthEnv().ADMIN_PASSWORD));
}

export const sessionCookie = (value: string, maxAge: number): string =>
  `${COOKIE}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;

export const SESSION_MAX_AGE = WEEK_MS / 1000;
