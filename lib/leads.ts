import 'server-only';
import crypto from 'node:crypto';
import { optionalEnv } from './env';
import { deleteKey, getJson, listKeys, putJson } from './r2';
import type { ContactInput } from './schemas';

export const ESTADOS = ['Nueva', 'Contactada', 'Cotizada', 'Aceptada', 'Descartada'] as const;
export type Estado = (typeof ESTADOS)[number];

/** Misma forma que guarda la web actual, así el panel lee consultas viejas y nuevas por igual. */
export type Lead = ContactInput & {
  id: string;
  fecha: string;
  estado: Estado;
  notas: string;
  proyecto: string;
};

const keyOf = (id: string) => `leads/${id}.json`;
export const isLeadId = (id: unknown): id is string =>
  typeof id === 'string' && /^[a-z0-9-]{8,60}$/i.test(id);

/* Almacenamiento en memoria solo para tests end-to-end (ver E2E_FAKE_STORAGE). */
const memory = new Map<string, Lead>();
const store = {
  get: async (id: string) =>
    optionalEnv.fakeStorage() ? (memory.get(id) ?? null) : getJson<Lead>(keyOf(id)),
  put: async (l: Lead) => (optionalEnv.fakeStorage() ? void memory.set(l.id, l) : putJson(keyOf(l.id), l)),
  del: async (id: string) => (optionalEnv.fakeStorage() ? void memory.delete(id) : deleteKey(keyOf(id))),
  list: async (): Promise<Lead[]> => {
    if (optionalEnv.fakeStorage()) return [...memory.values()];
    const keys = (await listKeys('leads/')).sort().reverse().slice(0, 300);
    const all = await Promise.all(keys.map((k) => getJson<Lead>(k).catch(() => null)));
    return all.filter((l): l is Lead => l !== null);
  },
};

export async function createLead(input: ContactInput): Promise<Lead> {
  const lead: Lead = {
    ...input,
    id: `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    fecha: new Date().toISOString(),
    estado: 'Nueva',
    notas: '',
    proyecto: '',
  };
  await store.put(lead);
  return lead;
}

export const listLeads = () => store.list();
export const getLead = (id: string) => store.get(id);
export const deleteLead = (id: string) => store.del(id);

export async function updateLead(
  id: string,
  patch: { estado?: unknown; notas?: unknown; proyecto?: unknown },
): Promise<Lead | null> {
  const lead = await store.get(id);
  if (!lead) return null;
  if (typeof patch.estado === 'string' && (ESTADOS as readonly string[]).includes(patch.estado)) {
    lead.estado = patch.estado as Estado;
  }
  if (typeof patch.notas === 'string') lead.notas = patch.notas.trim().slice(0, 3000);
  if (typeof patch.proyecto === 'string') lead.proyecto = patch.proyecto.trim().slice(0, 40);
  await store.put(lead);
  return lead;
}
