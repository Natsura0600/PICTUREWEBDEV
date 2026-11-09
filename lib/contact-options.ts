/**
 * Opciones del formulario de contacto, sin dependencias.
 * Separadas de schemas.ts para que el formulario (cliente) no arrastre Zod al navegador.
 */
export const TIPOS = [
  'Landing page',
  'Sitio institucional',
  'Sistema a medida',
  'Tienda online',
  'Rediseño de un sitio existente',
  'Otro',
] as const;

export const PRESUPUESTOS = [
  'Todavía no lo sé',
  'Hasta USD 500',
  'USD 500 a 1.500',
  'USD 1.500 a 3.000',
  'Más de USD 3.000',
] as const;

export const PLAZOS = ['Lo antes posible', 'En 1 mes', 'En 2 o 3 meses', 'Sin apuro'] as const;

export const CONTACT_FIELDS = [
  'nombre',
  'email',
  'whatsapp',
  'tipo',
  'presupuesto',
  'plazo',
  'descripcion',
  'referencias',
] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];
