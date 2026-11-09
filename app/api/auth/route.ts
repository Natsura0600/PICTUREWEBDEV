import { missingAuthEnv } from '@/lib/env';
import { isAdminRequest, SESSION_MAX_AGE, samePassword, sessionCookie, signSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const json = (body: unknown, init?: ResponseInit) => Response.json(body, init);

/** ¿Hay una sesión válida? Nunca falla: sin sesión devuelve ok:false. */
export function GET(req: Request) {
  return json({ ok: isAdminRequest(req) });
}

/** Iniciar sesión */
export async function POST(req: Request) {
  const missing = missingAuthEnv();
  if (missing.length) return json({ error: 'config', missing }, { status: 500 });

  const body: unknown = await req.json().catch(() => ({}));
  const password =
    typeof body === 'object' && body !== null && 'password' in body && typeof body.password === 'string'
      ? body.password.trim()
      : '';

  if (!password || !samePassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // frena los intentos al azar
    return json({ ok: false }, { status: 401 });
  }
  return json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie(signSession(), SESSION_MAX_AGE) } });
}

/** Cerrar sesión */
export function DELETE() {
  return json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie('', 0) } });
}
