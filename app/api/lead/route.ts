import { isAdminRequest } from '@/lib/auth';
import { deleteLead, isLeadId, listLeads, updateLead } from '@/lib/leads';

/**
 * Consultas para el panel /admin (solo con sesión).
 * El alta de consultas ya no pasa por acá: la hace la Server Action del formulario.
 */
export const dynamic = 'force-dynamic';

const unauthorized = () => Response.json({ error: 'auth' }, { status: 401 });
const serverError = (e: unknown) => {
  console.error('lead error', e);
  return Response.json(
    { error: 'No pudimos procesar el pedido. Probá de nuevo en un rato.' },
    { status: 500 },
  );
};

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    return Response.json({ leads: await listLeads() });
  } catch (e) {
    return serverError(e);
  }
}

export async function PATCH(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const body: unknown = await req.json().catch(() => null);
    if (typeof body !== 'object' || body === null) return Response.json({ error: 'datos' }, { status: 400 });
    const { id, estado, notas, proyecto } = body as Record<string, unknown>;
    if (!isLeadId(id)) return Response.json({ error: 'id' }, { status: 400 });
    const lead = await updateLead(id, { estado, notas, proyecto });
    return lead ? Response.json(lead) : Response.json({ error: 'No existe' }, { status: 404 });
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!isLeadId(id)) return Response.json({ error: 'id' }, { status: 400 });
    await deleteLead(id);
    return Response.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
