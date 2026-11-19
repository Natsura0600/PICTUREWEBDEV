/** Datos de la marca y contenido fijo del sitio. Un solo lugar para editarlos. */

export const site = {
  name: 'Picture Web Dev',
  tagline: 'Technology & Design',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picturewebdev.vercel.app').replace(/\/$/, ''),
  description:
    'Páginas web, sistemas de turnos y paneles a medida para negocios. Diseño y desarrollo desde Luján, Buenos Aires, para todo el país.',
  locale: 'es_AR',
  founder: {
    name: 'Octavio Caricato',
    role: 'Desarrollador web y fundador de Picture Web Dev',
  },
  city: 'Luján',
  region: 'Buenos Aires',
  country: 'AR',
  whatsapp: {
    display: '+54 9 11 5249-5689',
    number: '5491152495689',
  },
  formUrl: 'https://forms.gle/4CQdifqFRH7pmBdU9',
  /** Cargá acá tus redes cuando quieras mostrarlas (footer, contacto y JSON-LD). */
  socials: [] as ReadonlyArray<{ label: string; href: string }>,
  responseTime: 'menos de 24 horas',
} as const;

export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${site.whatsapp.number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const nav = [
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/estudio', label: 'Estudio' },
  { href: '/contacto', label: 'Contacto' },
] as const;

export type Service = { id: string; title: string; text: string; items: readonly string[] };

export const services: readonly Service[] = [
  {
    id: 'web',
    title: 'Sitios web',
    text: 'Landings y sitios institucionales que explican qué hacés en segundos y convierten visitas en consultas por WhatsApp o formulario.',
    items: [
      'Diseño a medida, no plantillas',
      'Adaptado a celular desde el primer boceto',
      'SEO técnico y carga rápida',
    ],
  },
  {
    id: 'sistemas',
    title: 'Sistemas a medida',
    text: 'Turnos online, pedidos, catálogos y paneles de administración pensados alrededor de cómo trabaja tu negocio.',
    items: [
      'Reservas 24 h sin atender el teléfono',
      'Panel propio para editar sin depender de nadie',
      'Varios profesionales, canchas o locales',
    ],
  },
  {
    id: 'mantenimiento',
    title: 'Mantenimiento y mejora',
    text: 'Hosting, seguridad, copias de respaldo, cambios del mes y soporte directo para que tu web siga sirviendo mientras crecés.',
    items: ['Hosting y certificado SSL', 'Cambios incluidos en el abono', 'Soporte por WhatsApp'],
  },
];

/** "Incluido en cada proyecto". icon: nombre del ícono de lucide-react (ver components/sections/Included). */
export const included = [
  {
    icon: 'palette',
    title: 'Diseño a medida',
    text: 'Pensado para tu marca y tus clientes. Nada de plantillas genéricas.',
  },
  {
    icon: 'smartphone',
    title: 'Primero el celular',
    text: 'La mayoría de tus clientes te va a ver desde el teléfono, así que arrancamos por ahí.',
  },
  {
    icon: 'zap',
    title: 'Carga rápida',
    text: 'Páginas livianas que abren al toque, incluso con datos móviles.',
  },
  {
    icon: 'search',
    title: 'Lista para Google',
    text: 'SEO técnico de base para que te encuentren cuando buscan lo que hacés.',
  },
  {
    icon: 'message',
    title: 'WhatsApp y formulario',
    text: 'Cada visita está a un toque de escribirte. Ahí se convierten en clientes.',
  },
  {
    icon: 'dashboard',
    title: 'Panel para editar',
    text: 'Si lo necesitás, cambiás textos, fotos o turnos vos mismo, sin depender de nadie.',
  },
  {
    icon: 'shield',
    title: 'Hosting y seguridad',
    text: 'Certificado SSL, copias de respaldo y la web siempre online.',
  },
  {
    icon: 'headset',
    title: 'Soporte directo',
    text: 'Hablás con quien construyó tu web, por WhatsApp, sin tickets ni esperas.',
  },
] as const;

/** Rubros con los que trabajamos. slug: caso de estudio relacionado (si existe). */
export const industries = [
  { name: 'Barberías y peluquerías', detail: 'Turnos online y servicios', slug: 'keenas-barberia' },
  { name: 'Complejos deportivos', detail: 'Reservas de canchas 24 h', slug: 'cornerapp' },
  { name: 'Inmobiliarias y desarrollos', detail: 'Unidades, fotos y consultas', slug: 'quinzo-1' },
  { name: 'Institutos y educación', detail: 'Cursos, niveles e inscripciones', slug: 'castleton-english' },
  { name: 'Clubes y entretenimiento', detail: 'Contenido, juegos y comunidad', slug: 'drop-rugby' },
  { name: 'Gastronomía', detail: 'Menú, pedidos y reservas' },
  { name: 'Salud y estética', detail: 'Turnos y presentación de servicios' },
  { name: 'Comercios y profesionales', detail: 'Catálogo, servicios y contacto' },
] as const satisfies ReadonlyArray<{ name: string; detail: string; slug?: string }>;

export type Step = { title: string; text: string };

export const steps: readonly Step[] = [
  {
    title: 'Entendemos tu negocio',
    text: 'Una charla corta para saber qué vendés, a quién y qué te está costando tiempo o clientes hoy.',
  },
  {
    title: 'Te pasamos una propuesta',
    text: 'Alcance, presupuesto y fecha de entrega por escrito. Sin letra chica.',
  },
  {
    title: 'Diseñamos y desarrollamos',
    text: 'Te mostramos avances reales en tu celular. Ajustamos hasta que quede como lo imaginabas.',
  },
  {
    title: 'Publicamos y seguimos',
    text: 'Lo ponemos online, te enseñamos a usar el panel y quedamos a cargo del mantenimiento.',
  },
];

export const technologies = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'Tailwind CSS',
  'Vercel',
  'Cloudflare R2',
] as const;

export type Testimonial = { quote: string; name: string; business: string };

/** Vacío a propósito: la sección no se muestra hasta tener testimonios reales. */
export const testimonials: readonly Testimonial[] = [];

export const faqs = [
  {
    q: '¿Cuánto tarda en estar lista mi web?',
    a: 'Una landing suele estar en una semana; una web con panel o un sistema de turnos, entre dos y tres semanas. Depende de que tengamos textos y fotos.',
  },
  {
    q: '¿Qué incluye el abono mensual?',
    a: 'Hosting, certificado de seguridad, copias de respaldo, mantenimiento técnico, cambios del mes y soporte directo por WhatsApp.',
  },
  {
    q: '¿Puedo editar mi web yo mismo?',
    a: 'Sí, en los sitios con panel y en los sistemas a medida tenés un panel propio para cambiar textos, fotos, precios o turnos sin depender de nadie.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Depende de lo que necesites: no es lo mismo una landing que un sistema de turnos. Contanos tu idea por WhatsApp o por el formulario y te pasamos un presupuesto por escrito, sin compromiso.',
  },
  {
    q: '¿Trabajan solo en Luján?',
    a: 'No. Estamos en Luján y atendemos en persona en la zona, pero trabajamos con negocios de todo el país por videollamada y WhatsApp.',
  },
] as const;
