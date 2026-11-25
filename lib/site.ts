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
  { href: '/#proyectos', label: 'Proyectos' },
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
    id: 'agente-ia',
    title: 'Agente de IA para WhatsApp',
    text: 'Un asistente con inteligencia artificial que contesta los mensajes de tu negocio al instante, a cualquier hora, y te pasa los clientes listos para cerrar.',
    items: [
      'Responde consultas las 24 h, con el tono de tu marca',
      'Toma los datos del interesado y te avisa del nuevo cliente',
      'Te deriva la charla cuando hace falta una persona',
      'También en los mensajes de Instagram',
    ],
  },
  {
    id: 'instagram',
    title: 'Manejo de Instagram',
    text: 'Tu cuenta activa y coherente con tu marca, para que quien te descubre en Instagram termine escribiéndote o visitando tu web.',
    items: [
      'Plan de contenido y diseño de publicaciones e historias',
      'Perfil optimizado: bio, destacados y link a tu web',
      'Mensajes respondidos a tiempo, con el agente de IA si querés',
    ],
  },
  {
    id: 'mantenimiento',
    title: 'Mantenimiento y mejora',
    text: 'Hosting, seguridad, copias de respaldo, cambios del mes y soporte directo para que tu web siga sirviendo mientras crecés.',
    items: ['Hosting y certificado SSL', 'Cambios del mes incluidos', 'Soporte por WhatsApp'],
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

/**
 * Segmentos de la portada: cada tipo de cliente ve qué le resolvemos, qué incluye,
 * un ejemplo real y un botón de WhatsApp con su propio mensaje.
 */
export type Segment = {
  id: string;
  tag: string;
  title: string;
  for: string;
  items: readonly string[];
  examples: readonly { label: string; slug: string }[];
  cta: string;
  message: string;
};

export const segments: readonly Segment[] = [
  {
    id: 'presencia',
    tag: 'Web o landing',
    title: 'Que te encuentren y te escriban',
    for: 'Comercios, profesionales, institutos e inmobiliarias.',
    items: [
      'Diseño a medida, pensado primero para el celular',
      'Lista para aparecer en Google',
      'Botón de WhatsApp y formulario en cada página',
    ],
    examples: [
      { label: 'Quinzo 1', slug: 'quinzo-1' },
      { label: 'Castleton', slug: 'castleton-english' },
    ],
    cta: 'Quiero mi web',
    message: 'Hola, quiero una página web para mi negocio',
  },
  {
    id: 'turnos',
    tag: 'Turnos y reservas',
    title: 'Que te reserven solos, a cualquier hora',
    for: 'Barberías, complejos deportivos, estética y consultorios.',
    items: [
      'Reservas online 24 h, sin atender el teléfono',
      'Recordatorios por WhatsApp y avisos al celular',
      'Panel para manejar agenda, servicios y caja',
    ],
    examples: [
      { label: 'Zona Cero', slug: 'zona-cero' },
      { label: 'M10 Canchas', slug: 'menotti' },
    ],
    cta: 'Quiero turnos online',
    message: 'Hola, quiero un sistema de turnos online para mi negocio',
  },
  {
    id: 'medida',
    tag: 'Sistema a medida',
    title: 'Una herramienta hecha para tu forma de trabajar',
    for: 'Negocios con un proceso propio: pedidos, gestión o una idea nueva.',
    items: [
      'Panel de gestión con usuarios y permisos',
      'Pedidos, catálogos, juegos o lo que tu idea necesite',
      'Lo editás vos, sin depender de nadie',
    ],
    examples: [{ label: 'Drop Rugby', slug: 'drop-rugby' }],
    cta: 'Contame tu idea',
    message: 'Hola, tengo una idea para un sistema a medida',
  },
];

/** Servicios que se suman a cualquier negocio, con su propio WhatsApp (portada). */
export const addons = [
  {
    id: 'agente-ia',
    title: 'Agente de IA para WhatsApp',
    text: 'Contesta tus mensajes al instante, las 24 h, y te avisa cuando entra un cliente.',
    cta: 'Quiero mi agente',
    message: 'Hola, quiero un agente de IA para el WhatsApp de mi negocio',
  },
  {
    id: 'instagram',
    title: 'Manejo de Instagram',
    text: 'Contenido, diseño y un perfil que lleva a tus clientes a escribirte.',
    cta: 'Quiero que manejen mi Instagram',
    message: 'Hola, quiero que manejen el Instagram de mi negocio',
  },
] as const;

/** Lo que trae cualquier proyecto (una sola línea en la portada; el detalle está en /servicios). */
export const always = [
  'Hosting y certificado SSL',
  'Mantenimiento mensual',
  'Cambios del mes incluidos',
  'Soporte directo por WhatsApp',
] as const;

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
    q: '¿Cuánto cuesta?',
    a: 'Depende de lo que necesites: no es lo mismo una landing que un sistema de turnos. Contanos tu idea por WhatsApp o por el formulario y te pasamos un presupuesto por escrito, sin compromiso.',
  },
  {
    q: '¿Cuánto tarda en estar lista mi web?',
    a: 'Una landing suele estar en una semana; una web con panel o un sistema de turnos, entre dos y tres semanas. Depende de que tengamos textos y fotos.',
  },
  {
    q: '¿Qué necesito tener listo para empezar?',
    a: 'Nada técnico. Alcanza con que nos cuentes qué hace tu negocio y a quién le vendés. Si tenés logo, fotos y textos, mejor; si no, te guiamos con qué hace falta.',
  },
  {
    q: '¿Puedo editar mi web yo mismo?',
    a: 'Sí, en los sitios con panel y en los sistemas a medida tenés un panel propio para cambiar textos, fotos, precios o turnos sin depender de nadie.',
  },
  {
    q: '¿Qué pasa después de publicar?',
    a: 'Quedamos a cargo: hosting, seguridad, copias de respaldo y los cambios del mes. El dominio queda a tu nombre. Y si más adelante querés sumar algo nuevo, lo vemos juntos.',
  },
  {
    q: '¿Trabajan solo en Luján?',
    a: 'No. Estamos en Luján y atendemos en persona en la zona, pero trabajamos con negocios de todo el país por videollamada y WhatsApp.',
  },
] as const;
