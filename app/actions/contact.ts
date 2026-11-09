'use server';

import { headers } from 'next/headers';
import type { ContactState } from '@/lib/contact-state';
import { createLead } from '@/lib/leads';
import { allowContact } from '@/lib/ratelimit';
import { CONTACT_FIELDS, type ContactField } from '@/lib/contact-options';
import { contactSchema, isLikelyBot } from '@/lib/schemas';

const FIELDS = CONTACT_FIELDS;

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'desconocida';
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = Object.fromEntries(
    FIELDS.map((f) => [f, String(formData.get(f) ?? '').slice(0, 3000)]),
  ) as Record<ContactField, string>;
  const fail = (message: string, fieldErrors: Partial<Record<ContactField, string>> = {}): ContactState => ({
    status: 'error',
    message,
    fieldErrors,
    values,
  });

  // Bots: se responde "éxito" sin guardar nada, para no darles pistas
  if (isLikelyBot(formData.get('empresa_web'), formData.get('started_at'))) {
    return { status: 'success', email: values.email };
  }

  if (!(await allowContact(await clientIp()))) {
    return fail(
      'Recibimos varias consultas seguidas desde tu conexión. Esperá unos minutos o escribinos por WhatsApp.',
    );
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return fail('Revisá los campos marcados.', fieldErrors);
  }

  try {
    const lead = await createLead(parsed.data);
    return { status: 'success', email: lead.email };
  } catch (e) {
    console.error('contact error', e);
    return fail('No pudimos enviar tu consulta. Probá de nuevo en un rato o escribinos por WhatsApp.');
  }
}
