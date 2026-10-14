import crypto from 'node:crypto';
import { getJson, putJson, del, listKeys } from '../lib/r2.js';
import { isAdmin } from '../lib/auth.js';

const TIPOS = ['Sitio institucional', 'Tienda online', 'Landing page', 'Sistema a medida', 'Rediseño de un sitio existente', 'Otro'];
const PRES = ['Todavía no lo sé', 'Hasta USD 500', 'USD 500 a 1.500', 'USD 1.500 a 3.000', 'Más de USD 3.000'];
const ESTADOS = ['Nueva', 'Contactada', 'Cotizada', 'Aceptada', 'Descartada'];
const s = (v, n) => String(v ?? '').trim().slice(0, n);
const oneLine = (v) => v.replace(/[\r\n]+/g, ' ');
const idOk = (id) => /^[a-z0-9-]{8,60}$/i.test(String(id || ''));

async function notify(l) {
  const key = process.env.RESEND_API_KEY, to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || 'Propuestas <onboarding@resend.dev>',
        to: [to], reply_to: l.email,
        subject: oneLine(`Nueva propuesta: ${l.nombre} (${l.tipo})`),
        text: `${l.nombre} <${l.email}>\nWhatsApp: ${l.whatsapp || '-'}\nTipo: ${l.tipo}\nPresupuesto: ${l.presupuesto}\nPlazo: ${l.plazo}\n\n${l.descripcion}\n\nReferencias: ${l.referencias || '-'}\n\nVerla en el panel: /admin`,
      }),
    });
  } catch (e) { console.error('notify error', e); }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    // ---- público: un cliente envía una propuesta ----
    if (req.method === 'POST') {
      const b = req.body || {};
      if (b.web || Number(b.t) < 3000) return res.status(200).json({ ok: true }); // trampa para bots: se descarta sin avisar
      const l = {
        nombre: s(b.nombre, 100), email: s(b.email, 150), whatsapp: s(b.whatsapp, 30),
        tipo: TIPOS.includes(b.tipo) ? b.tipo : '', presupuesto: PRES.includes(b.presupuesto) ? b.presupuesto : PRES[0],
        plazo: s(b.plazo, 60) || 'Sin definir', descripcion: s(b.descripcion, 3000), referencias: s(b.referencias, 600),
      };
      if (!l.nombre) return res.status(400).json({ error: 'Escribí tu nombre.' });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.email)) return res.status(400).json({ error: 'Revisá tu email: parece incompleto.' });
      if (!l.tipo) return res.status(400).json({ error: 'Elegí qué tipo de proyecto necesitás.' });
      if (l.descripcion.length < 20) return res.status(400).json({ error: 'Contanos un poco más del proyecto (mínimo 20 caracteres).' });
      l.id = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      Object.assign(l, { fecha: new Date().toISOString(), estado: 'Nueva', notas: '', proyecto: '' });
      await putJson(`leads/${l.id}.json`, l);
      await notify(l);
      return res.status(200).json({ ok: true });
    }

    // ---- desde acá, solo admin ----
    if (!isAdmin(req)) return res.status(401).json({ error: 'auth' });

    if (req.method === 'GET') {
      const keys = (await listKeys('leads/')).sort().reverse().slice(0, 300);
      const leads = (await Promise.all(keys.map((k) => getJson(k).catch(() => null)))).filter(Boolean);
      return res.status(200).json({ leads });
    }
    if (req.method === 'PATCH') {
      const { id, estado, notas, proyecto } = req.body || {};
      if (!idOk(id)) return res.status(400).json({ error: 'id' });
      const key = `leads/${id}.json`, l = await getJson(key);
      if (!l) return res.status(404).json({ error: 'No existe' });
      if (ESTADOS.includes(estado)) l.estado = estado;
      if (typeof notas === 'string') l.notas = s(notas, 3000);
      if (typeof proyecto === 'string') l.proyecto = s(proyecto, 40);
      await putJson(key, l);
      return res.status(200).json(l);
    }
    if (req.method === 'DELETE') {
      const id = req.query && req.query.id;
      if (!idOk(id)) return res.status(400).json({ error: 'id' });
      await del(`leads/${id}.json`);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (e) {
    console.error('lead error', e);
    return res.status(500).json({ error: 'No pudimos procesar el pedido. Probá de nuevo en un rato.' });
  }
}
