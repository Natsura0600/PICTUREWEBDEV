import { isAdminRequest } from '@/lib/auth';
import { getJson, putJson } from '@/lib/r2';

/** Proyectos y abonos del panel /admin. Misma limpieza de datos que la versión anterior. */
export const dynamic = 'force-dynamic';

const ETAPAS = ['Relevamiento', 'Diseño', 'Desarrollo', 'Revisión del cliente', 'Entregado'] as const;
const PLANES = ['Presencia', 'Negocio', 'Sistema', 'A medida'] as const;

type Raw = Record<string, unknown>;
const str = (v: unknown, n = 200) => String(v ?? '').slice(0, n);
const num = (v: unknown) => {
  const x = Number(v);
  return Number.isFinite(x) && x >= 0 ? x : 0;
};
const date = (v: unknown) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? String(v) : '');
const arr = (v: unknown): Raw[] =>
  Array.isArray(v) ? v.filter((x): x is Raw => typeof x === 'object' && x !== null) : [];
const oneOf = <T extends string>(list: readonly T[], v: unknown, fallback: T): T =>
  (list as readonly unknown[]).includes(v) ? (v as T) : fallback;

function clean(body: unknown) {
  if (typeof body !== 'object' || body === null || !Array.isArray((body as Raw).projects)) return null;
  return arr((body as Raw).projects)
    .slice(0, 500)
    .map((p) => {
      const pagos = arr(p.pagos)
        .slice(0, 200)
        .map((g) => ({
          fecha: date(g.fecha),
          concepto: str(g.concepto, 60) || 'Cobro',
          monto: num(g.monto),
        }));
      return {
        id: str(p.id, 40),
        nombre: str(p.nombre, 120),
        cliente: str(p.cliente, 120),
        email: str(p.email, 150),
        whatsapp: str(p.whatsapp, 30),
        tipo: str(p.tipo, 60),
        etapa: oneOf(ETAPAS, p.etapa, ETAPAS[0]),
        moneda: p.moneda === 'USD' ? 'USD' : 'ARS',
        precio: num(p.precio),
        cobrado: pagos.reduce((a, g) => a + g.monto, 0),
        entrega: date(p.entrega),
        sitio: str(p.sitio, 300),
        dominio: str(p.dominio, 120),
        renovacion: date(p.renovacion),
        notas: str(p.notas, 3000),
        creado: str(p.creado, 40),
        lead: str(p.lead, 60),
        tareas: arr(p.tareas)
          .slice(0, 60)
          .map((t) => ({ t: str(t.t, 200), ok: Boolean(t.ok) })),
        pagos,
        bitacora: arr(p.bitacora)
          .slice(0, 300)
          .map((x) => ({ fecha: str(x.fecha, 40), texto: str(x.texto, 600) })),
        plan: oneOf<(typeof PLANES)[number] | ''>(PLANES, p.plan, ''),
        abono: num(p.abono),
        abonoDesde: date(p.abonoDesde),
        abonoActivo: p.abonoActivo !== false,
        mensual: arr(p.mensual)
          .slice(0, 240)
          .filter((m) => /^\d{4}-\d{2}$/.test(String(m.mes)))
          .map((m) => ({ mes: String(m.mes), monto: num(m.monto), fecha: date(m.fecha) })),
      };
    })
    .filter((p) => p.id && p.nombre);
}

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return Response.json({ error: 'auth' }, { status: 401 });
  try {
    return Response.json((await getJson('projects.json')) ?? { projects: [] });
  } catch (e) {
    console.error('projects error', e);
    return Response.json({ error: 'storage' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdminRequest(req)) return Response.json({ error: 'auth' }, { status: 401 });
  try {
    const projects = clean(await req.json().catch(() => null));
    if (!projects) return Response.json({ error: 'datos inválidos' }, { status: 400 });
    await putJson('projects.json', { projects });
    return Response.json({ ok: true });
  } catch (e) {
    console.error('projects error', e);
    return Response.json({ error: 'storage' }, { status: 500 });
  }
}
