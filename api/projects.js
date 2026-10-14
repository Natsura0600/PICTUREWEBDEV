import { getJson, putJson } from '../lib/r2.js';
import { isAdmin } from '../lib/auth.js';

const ETAPAS = ['Relevamiento', 'Diseño', 'Desarrollo', 'Revisión del cliente', 'Entregado'];
const str = (v, n = 200) => String(v ?? '').slice(0, n);
const num = (v) => (Number.isFinite(+v) && +v >= 0 ? +v : 0);
const date = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? String(v) : '');

function clean(b) {
  if (!b || !Array.isArray(b.projects)) return null;
  return b.projects.slice(0, 500).map((p) => {
    const pagos = (Array.isArray(p.pagos) ? p.pagos : []).slice(0, 200).map((g) => ({
      fecha: date(g.fecha), concepto: str(g.concepto, 60) || 'Cobro', monto: num(g.monto),
    }));
    return {
      id: str(p.id, 40), nombre: str(p.nombre, 120), cliente: str(p.cliente, 120), email: str(p.email, 150),
      whatsapp: str(p.whatsapp, 30), tipo: str(p.tipo, 60), etapa: ETAPAS.includes(p.etapa) ? p.etapa : ETAPAS[0],
      moneda: p.moneda === 'USD' ? 'USD' : 'ARS', precio: num(p.precio),
      cobrado: pagos.reduce((a, g) => a + g.monto, 0), // siempre es la suma de los cobros registrados
      entrega: date(p.entrega), sitio: str(p.sitio, 300), dominio: str(p.dominio, 120), renovacion: date(p.renovacion),
      notas: str(p.notas, 3000), creado: str(p.creado, 40), lead: str(p.lead, 60),
      tareas: (Array.isArray(p.tareas) ? p.tareas : []).slice(0, 60).map((t) => ({ t: str(t.t, 200), ok: !!t.ok })),
      pagos,
      bitacora: (Array.isArray(p.bitacora) ? p.bitacora : []).slice(0, 300).map((x) => ({ fecha: str(x.fecha, 40), texto: str(x.texto, 600) })),
    };
  }).filter((p) => p.id && p.nombre);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!isAdmin(req)) return res.status(401).json({ error: 'auth' });
  try {
    if (req.method === 'GET') return res.status(200).json((await getJson('projects.json')) || { projects: [] });
    if (req.method === 'PUT') {
      const projects = clean(req.body);
      if (!projects) return res.status(400).json({ error: 'datos inválidos' });
      await putJson('projects.json', { projects });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (e) {
    console.error('projects error', e);
    return res.status(500).json({ error: 'storage' });
  }
}
