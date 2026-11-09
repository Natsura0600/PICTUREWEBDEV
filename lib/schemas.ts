import { z } from 'zod';
import { PLAZOS, PRESUPUESTOS, TIPOS, type ContactField as Field } from './contact-options';

/* ---------- Formulario de contacto ---------- */

export { PLAZOS, PRESUPUESTOS, TIPOS } from './contact-options';

const trimmed = (max: number) => z.string().trim().max(max, `Máximo ${max} caracteres.`);

export const contactSchema = z.object({
  nombre: trimmed(100).min(2, 'Escribí tu nombre.'),
  email: trimmed(150).pipe(z.email('Revisá tu email: parece incompleto.')),
  whatsapp: trimmed(30)
    .refine((v) => v === '' || /^[+\d\s()-]{6,}$/.test(v), 'Escribí solo números, con código de área.')
    .default(''),
  tipo: z.enum(TIPOS, { error: 'Elegí qué tipo de proyecto necesitás.' }),
  presupuesto: z.enum(PRESUPUESTOS).catch('Todavía no lo sé'),
  plazo: z.enum(PLAZOS).catch('Lo antes posible'),
  descripcion: trimmed(3000).min(20, 'Contanos un poco más (mínimo 20 caracteres).'),
  referencias: trimmed(600).default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = Field;

/** Campos anti-spam: el honeypot debe venir vacío y el envío no puede ser instantáneo. */
export const MIN_FILL_MS = 3000;

export function isLikelyBot(honeypot: unknown, startedAt: unknown, now = Date.now()): boolean {
  if (typeof honeypot === 'string' && honeypot.trim() !== '') return true;
  // Sin JavaScript no hay marca de tiempo: no se puede medir, así que no se descarta (queda el honeypot y el límite por IP)
  if (startedAt === null || startedAt === undefined || startedAt === '') return false;
  const t = Number(startedAt);
  if (!Number.isFinite(t) || t <= 0) return true;
  return now - t < MIN_FILL_MS;
}

/* ---------- Proyectos (frontmatter del MDX) ---------- */

export const projectMetaSchema = z.object({
  title: z.string().min(1),
  client: z.string().min(1),
  kind: z.string().min(1),
  year: z.number().int().min(2020).max(2100),
  location: z.string().default('Luján, Buenos Aires'),
  summary: z.string().min(40).max(220),
  url: z.url(),
  stack: z.array(z.string()).min(1),
  services: z.array(z.string()).min(1),
  order: z.number().int(),
  featured: z.boolean().default(false),
  results: z.array(z.string()).default([]),
});

export type ProjectMeta = z.infer<typeof projectMetaSchema>;
