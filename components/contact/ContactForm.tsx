'use client';

import { useActionState, useEffect, useRef } from 'react';
import { submitContact } from '@/app/actions/contact';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea, describedBy } from '@/components/ui/field';
import { initialContactState, type ContactState } from '@/lib/contact-state';
import { PLAZOS, PRESUPUESTOS, TIPOS, type ContactField } from '@/lib/contact-options';
import { site, whatsappUrl } from '@/lib/site';

type Props = { defaultTipo?: string };

export function ContactForm({ defaultTipo }: Props) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, initialContactState);
  const firstTouch = useRef<number | null>(null);
  const stampRef = useRef<HTMLInputElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Anti-spam: se anota cuándo cargó el formulario en el navegador (la página es estática, el servidor
  // no puede saberlo). Se vuelve a escribir en cada interacción porque React reinicia el formulario
  // después de cada envío.
  const stamp = (el: HTMLInputElement | null = stampRef.current) => {
    firstTouch.current ??= Date.now();
    if (el) el.value = String(firstTouch.current);
  };
  const onInteract = () => stamp();

  useEffect(() => {
    if (state.status === 'error') alertRef.current?.focus();
    if (state.status === 'success') successRef.current?.focus();
  }, [state]);

  if (state.status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-marca border-line border p-6 outline-none sm:p-8"
        data-testid="contact-success"
      >
        <p className="text-2xl font-extrabold tracking-[-0.03em]">Recibimos tu consulta.</p>
        <p className="text-muted mt-2">
          Te respondemos a <strong className="text-fg">{state.email}</strong> en {site.responseTime}. Si es
          urgente, escribinos por{' '}
          <a
            className="underline underline-offset-3"
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  const err = state.status === 'error' ? state.fieldErrors : {};
  const val = (f: ContactField, fallback = '') =>
    state.status === 'error' ? (state.values[f] ?? fallback) : fallback;
  const a11y = (id: ContactField, hint?: string) => ({
    id,
    name: id,
    'aria-invalid': err[id] ? true : undefined,
    'aria-describedby': describedBy(id, err[id], hint),
  });

  return (
    <form
      action={action}
      noValidate
      onFocusCapture={onInteract}
      onPointerDownCapture={onInteract}
      onKeyDownCapture={onInteract}
      className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2"
      aria-label="Formulario de contacto"
    >
      {state.status === 'error' ? (
        <div
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          className="border-danger text-danger border-l-2 pl-3 text-sm font-semibold outline-none sm:col-span-2"
        >
          {state.message}
        </div>
      ) : null}

      <Field id="nombre" label="Nombre y apellido" error={err.nombre}>
        <Input
          {...a11y('nombre')}
          autoComplete="name"
          required
          maxLength={100}
          defaultValue={val('nombre')}
        />
      </Field>
      <Field id="email" label="Email" error={err.email}>
        <Input
          {...a11y('email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={150}
          defaultValue={val('email')}
        />
      </Field>
      <Field
        id="whatsapp"
        label="WhatsApp (opcional)"
        error={err.whatsapp}
        hint="Con código de área, para responderte más rápido."
      >
        <Input
          {...a11y('whatsapp', 'hint')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={30}
          placeholder="+54 9 11 ..."
          defaultValue={val('whatsapp')}
        />
      </Field>
      <Field id="tipo" label="¿Qué necesitás?" error={err.tipo}>
        <Select {...a11y('tipo')} required defaultValue={val('tipo', defaultTipo ?? '')}>
          <option value="" disabled>
            Elegí una opción
          </option>
          {TIPOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field id="presupuesto" label="Presupuesto aproximado">
        <Select {...a11y('presupuesto')} defaultValue={val('presupuesto', PRESUPUESTOS[0])}>
          {PRESUPUESTOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field id="plazo" label="¿Para cuándo?">
        <Select {...a11y('plazo')} defaultValue={val('plazo', PLAZOS[0])}>
          {PLAZOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field id="descripcion" label="Contanos tu idea" error={err.descripcion} className="sm:col-span-2">
        <Textarea
          {...a11y('descripcion')}
          required
          minLength={20}
          maxLength={3000}
          rows={4}
          placeholder="Qué hace tu negocio y qué te gustaría resolver con la web."
          defaultValue={val('descripcion')}
        />
      </Field>
      <Field
        id="referencias"
        label="Webs que te gusten (opcional)"
        error={err.referencias}
        className="sm:col-span-2"
      >
        <Input
          {...a11y('referencias')}
          maxLength={600}
          placeholder="https://..."
          defaultValue={val('referencias')}
        />
      </Field>

      {/* Anti-spam: invisible para personas, tentador para bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="empresa_web">No completar</label>
        <input id="empresa_web" name="empresa_web" tabIndex={-1} autoComplete="off" />
      </div>
      <input
        ref={(el) => {
          stampRef.current = el;
          stamp(el);
        }}
        type="hidden"
        name="started_at"
        defaultValue=""
      />

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? 'Enviando…' : 'Enviar consulta'}
        </Button>
        <p className="text-muted text-xs">
          Usamos tus datos solo para responderte.{' '}
          <a href="/privacidad" className="underline underline-offset-3">
            Privacidad
          </a>
          .
        </p>
      </div>
    </form>
  );
}
