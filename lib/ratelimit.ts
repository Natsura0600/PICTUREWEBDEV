import 'server-only';

/** 5 consultas cada 10 minutos por IP. Configurable solo para los tests (CONTACT_RATE_LIMIT). */
const LIMIT = Number(process.env.CONTACT_RATE_LIMIT) || 5;
const WINDOW_MS = 10 * 60 * 1000;

/**
 * Límite en memoria, sin servicios externos. En Vercel cada instancia del servidor
 * lleva su propia cuenta, así que no es exacto, pero frena ráfagas desde una misma IP.
 * Junto con el campo trampa y el tiempo mínimo de llenado, alcanza para un formulario de contacto.
 */
const hits = new Map<string, number[]>();

export function memoryLimit(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}

export async function allowContact(ip: string): Promise<boolean> {
  return memoryLimit(ip);
}
