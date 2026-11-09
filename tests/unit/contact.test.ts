import { describe, expect, it } from 'vitest';
import { contactSchema, isLikelyBot, MIN_FILL_MS } from '@/lib/schemas';

const valid = {
  nombre: 'María López',
  email: 'maria@estudio.com',
  whatsapp: '+54 9 11 5555-1234',
  tipo: 'Landing page',
  presupuesto: 'Hasta USD 500',
  plazo: 'En 1 mes',
  descripcion: 'Necesito una landing para mi estudio contable con formulario.',
  referencias: '',
};

describe('contactSchema', () => {
  it('acepta una consulta completa', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('recorta espacios', () => {
    const r = contactSchema.parse({ ...valid, nombre: '  María  ' });
    expect(r.nombre).toBe('María');
  });

  it('exige un email válido con mensaje en castellano', () => {
    const r = contactSchema.safeParse({ ...valid, email: 'maria@' });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toMatch(/email/i);
  });

  it('exige al menos 20 caracteres de descripción', () => {
    const r = contactSchema.safeParse({ ...valid, descripcion: 'Quiero una web' });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.path).toEqual(['descripcion']);
  });

  it('rechaza un tipo que no está en la lista', () => {
    expect(contactSchema.safeParse({ ...valid, tipo: 'Hackeo' }).success).toBe(false);
  });

  it('corrige presupuesto y plazo inválidos al valor por defecto en lugar de fallar', () => {
    const r = contactSchema.parse({ ...valid, presupuesto: 'x', plazo: 'y' });
    expect(r.presupuesto).toBe('Todavía no lo sé');
    expect(r.plazo).toBe('Lo antes posible');
  });

  it('valida el WhatsApp solo si viene', () => {
    expect(contactSchema.safeParse({ ...valid, whatsapp: '' }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, whatsapp: 'llamame' }).success).toBe(false);
  });
});

describe('isLikelyBot', () => {
  const now = 1_000_000;

  it('marca como bot si completó el honeypot', () => {
    expect(isLikelyBot('https://spam.example', String(now - 60_000), now)).toBe(true);
  });

  it('marca como bot si envió demasiado rápido', () => {
    expect(isLikelyBot('', String(now - (MIN_FILL_MS - 1)), now)).toBe(true);
  });

  it('deja pasar a una persona que tardó lo normal', () => {
    expect(isLikelyBot('', String(now - 20_000), now)).toBe(false);
  });

  it('no descarta a quien navega sin JavaScript (sin marca de tiempo)', () => {
    expect(isLikelyBot(null, null, now)).toBe(false);
    expect(isLikelyBot('', '', now)).toBe(false);
  });

  it('marca como bot una marca de tiempo inválida', () => {
    expect(isLikelyBot('', 'abc', now)).toBe(true);
  });
});
