'use client';

import { Check, FileText, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { site, whatsappUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

const FEATURES = [
  { id: 'landing', label: 'Landing que convierte' },
  { id: 'institucional', label: 'Sitio con varias secciones' },
  { id: 'turnos', label: 'Turnos online' },
  { id: 'pedidos', label: 'Pedidos o catálogo' },
  { id: 'panel', label: 'Panel para editar yo' },
  { id: 'mantenimiento', label: 'Mantenimiento y soporte' },
] as const;

const BUSINESS = [
  'Comercio',
  'Gastronomía',
  'Salud o estética',
  'Deportes',
  'Profesional',
  'Inmobiliaria',
  'Otro',
] as const;

const WHEN = ['Lo antes posible', 'Este mes', 'Sin apuro'] as const;

type FeatureId = (typeof FEATURES)[number]['id'];

/**
 * "Armá tu proyecto": elegís qué necesitás y ves cómo se arma tu web en vivo.
 * Al final te deja el mensaje de WhatsApp listo para mandar (sin precios: la propuesta va por escrito).
 */
export function ProjectBuilder() {
  const [features, setFeatures] = useState<FeatureId[]>(['landing']);
  const [business, setBusiness] = useState<string>('');
  const [when, setWhen] = useState<string>('');

  const toggle = (id: FeatureId) =>
    setFeatures((cur) => (cur.includes(id) ? cur.filter((f) => f !== id) : [...cur, id]));

  const has = (id: FeatureId) => features.includes(id);

  const parts = ['¡Hola! Quiero armar mi proyecto con Picture Web Dev.'];
  if (features.length) {
    const chosen = FEATURES.filter((f) => has(f.id)).map((f) => f.label.toLowerCase());
    parts.push(`Necesito: ${chosen.join(', ')}.`);
  }
  if (business) parts.push(`Mi negocio: ${business.toLowerCase()}.`);
  if (when) parts.push(`Lo necesito: ${when.toLowerCase()}.`);
  const message = parts.join(' ');

  const chip = (active: boolean) =>
    cn(
      'chip inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-[background-color,border-color,color,transform] duration-200 active:scale-95',
      active ? 'border-accent bg-accent text-on-accent' : 'border-line text-fg hover:border-fg',
    );

  return (
    <section aria-labelledby="builder-title" className="border-line border-t py-20 md:py-28">
      <div className="wrap">
        <div className="mb-10 grid gap-4 md:mb-14 md:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] md:gap-16">
          <p className="kicker pt-2">03 · Armá tu proyecto</p>
          <div className="min-w-0">
            <h2 id="builder-title" className="text-h2 font-extrabold">
              Tocá lo que necesitás <span className="hl">y miralo tomar forma.</span>
            </h2>
            <p className="text-muted mt-5 max-w-[58ch] md:text-lg">
              Elegí las piezas de tu web. Cuando termines, te dejamos el mensaje listo para mandarnos por
              WhatsApp y te respondemos con una propuesta por escrito.
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          {/* Opciones */}
          <div className="grid content-start gap-8">
            <fieldset>
              <legend className="kicker mb-4">1 · ¿Qué necesitás?</legend>
              <div className="flex flex-wrap gap-2">
                {FEATURES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={has(f.id)}
                    onClick={() => toggle(f.id)}
                    className={chip(has(f.id))}
                  >
                    <Check
                      aria-hidden="true"
                      className={cn(
                        'size-4 transition-[opacity,width]',
                        has(f.id) ? 'opacity-100' : 'w-0 opacity-0',
                      )}
                    />
                    {f.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="kicker mb-4">2 · ¿Qué tipo de negocio tenés?</legend>
              <div className="flex flex-wrap gap-2">
                {BUSINESS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    aria-pressed={business === b}
                    onClick={() => setBusiness((cur) => (cur === b ? '' : b))}
                    className={chip(business === b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="kicker mb-4">3 · ¿Para cuándo?</legend>
              <div className="flex flex-wrap gap-2">
                {WHEN.map((w) => (
                  <button
                    key={w}
                    type="button"
                    aria-pressed={when === w}
                    onClick={() => setWhen((cur) => (cur === w ? '' : w))}
                    className={chip(when === w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Vista previa en vivo */}
          <div className="grid content-start gap-5">
            <div
              aria-hidden="true"
              data-tilt="4"
              className="tilt rounded-marca border-line bg-surface overflow-hidden border"
            >
              <div className="border-line flex items-center gap-2 border-b px-4 py-2.5">
                <span className="size-2 rounded-full bg-[#ff5f57]" />
                <span className="size-2 rounded-full bg-[#febc2e]" />
                <span className="size-2 rounded-full bg-[#28c840]" />
                <span className="bg-bg text-muted ml-2 truncate rounded px-2.5 py-0.5 text-[0.6875rem]">
                  tunegocio.com.ar
                </span>
              </div>
              <div className="grid min-h-[22rem] gap-3 p-4 sm:p-5">
                {/* Navegación */}
                <div className="flex items-center justify-between">
                  <span className="bg-fg/80 h-2.5 w-16 rounded-full" />
                  <span className="flex gap-2">
                    {(has('institucional') ? [1, 2, 3, 4] : [1, 2]).map((n) => (
                      <span key={n} className="wf-in bg-muted/50 h-2 w-8 rounded-full" />
                    ))}
                  </span>
                </div>
                {/* Hero */}
                <div className="bg-bg grid gap-2 rounded-lg p-4">
                  <span className="bg-fg/80 h-3.5 w-3/4 rounded-full" />
                  <span className="bg-accent h-3.5 w-1/2 rounded-full" />
                  <span className="bg-muted/40 mt-1 h-2 w-2/3 rounded-full" />
                  {has('landing') ? (
                    <span className="wf-in mt-2 flex gap-2">
                      <span className="bg-accent h-6 w-24 rounded-md" />
                      <span className="border-line h-6 w-20 rounded-md border" />
                    </span>
                  ) : null}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {has('turnos') ? (
                    <div className="wf-in bg-bg rounded-lg p-3">
                      <span className="text-muted text-[0.625rem] font-bold uppercase">Turnos</span>
                      <div className="mt-2 grid grid-cols-7 gap-1">
                        {Array.from({ length: 14 }, (_, k) => (
                          <span
                            key={k}
                            className={cn(
                              'aspect-square rounded-sm',
                              [3, 9, 11].includes(k) ? 'bg-accent' : 'bg-muted/25',
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {has('pedidos') ? (
                    <div className="wf-in bg-bg rounded-lg p-3">
                      <span className="text-muted text-[0.625rem] font-bold uppercase">Catálogo</span>
                      <div className="mt-2 grid grid-cols-3 gap-1.5">
                        {[0, 1, 2].map((k) => (
                          <span key={k} className="grid gap-1">
                            <span className="bg-muted/25 aspect-square rounded" />
                            <span className="bg-accent/80 h-1.5 w-3/4 rounded-full" />
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {has('panel') ? (
                    <div className="wf-in bg-bg flex gap-2 rounded-lg p-3">
                      <span className="bg-muted/25 w-6 rounded" />
                      <span className="grid flex-1 gap-1.5">
                        <span className="text-muted text-[0.625rem] font-bold uppercase">Tu panel</span>
                        <span className="bg-muted/30 h-2 rounded-full" />
                        <span className="bg-muted/30 h-2 w-4/5 rounded-full" />
                        <span className="bg-accent h-2 w-2/5 rounded-full" />
                      </span>
                    </div>
                  ) : null}
                  {has('institucional') ? (
                    <div className="wf-in bg-bg grid gap-1.5 rounded-lg p-3">
                      <span className="text-muted text-[0.625rem] font-bold uppercase">Secciones</span>
                      <span className="bg-muted/30 h-2 rounded-full" />
                      <span className="bg-muted/30 h-2 w-5/6 rounded-full" />
                      <span className="bg-muted/30 h-2 w-2/3 rounded-full" />
                    </div>
                  ) : null}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3">
                  {has('mantenimiento') ? (
                    <span className="wf-in border-ok/40 text-ok inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-bold">
                      <Check className="size-3" /> Online, seguro y al día
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-on-accent inline-flex items-center gap-1.5 rounded-full bg-[#5fd69a] px-2.5 py-1 text-[0.6875rem] font-bold">
                    <MessageCircle className="size-3" /> WhatsApp
                  </span>
                </div>
              </div>
            </div>

            {/* Mensaje armado */}
            <div className="rounded-marca border-line border p-5">
              <p className="kicker">Tu mensaje</p>
              <p key={message} className="msg-in mt-3 text-[0.9375rem]" aria-live="polite">
                {message}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild data-magnetic="0.2" className="magnetic">
                  <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle aria-hidden="true" /> Enviar por WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={site.formUrl} target="_blank" rel="noopener noreferrer">
                    <FileText aria-hidden="true" /> Prefiero el formulario
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
