import 'server-only';
import { z } from 'zod';

/** Lee variables y les saca espacios o saltos de línea sobrantes (típico al copiar y pegar en Vercel). */
const clean = (name: string): string | undefined => {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
};

const r2Schema = z.object({
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
});

const authSchema = z.object({
  ADMIN_PASSWORD: z.string().min(1),
  SESSION_SECRET: z.string().min(1),
});

export class MissingEnvError extends Error {
  constructor(public readonly missing: string[]) {
    super(`Faltan variables de entorno: ${missing.join(', ')}`);
    this.name = 'MissingEnvError';
  }
}

function read<T extends z.ZodObject>(schema: T): z.infer<T> {
  const raw = Object.fromEntries(Object.keys(schema.shape).map((k) => [k, clean(k)]));
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new MissingEnvError(parsed.error.issues.map((i) => String(i.path[0])));
  }
  return parsed.data;
}

export const getR2Env = () => read(r2Schema);
export const getAuthEnv = () => read(authSchema);

export function missingAuthEnv(): string[] {
  try {
    getAuthEnv();
    return [];
  } catch (e) {
    return e instanceof MissingEnvError ? e.missing : ['ADMIN_PASSWORD', 'SESSION_SECRET'];
  }
}

/** Variables opcionales. */
export const optionalEnv = {
  /** Solo para los tests end-to-end: guarda consultas en memoria en lugar de R2. Nunca la cargues en Vercel. */
  fakeStorage: () => clean('E2E_FAKE_STORAGE') === '1' && process.env.VERCEL !== '1',
};
