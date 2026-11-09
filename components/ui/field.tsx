import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Inputs de estilo shadcn/ui adaptados a la marca: línea inferior, sin cajas.
 * El <select> es nativo a propósito: en celular abre el selector del sistema,
 * que es más accesible y rápido que un dropdown hecho a mano.
 */
const control =
  'w-full min-w-0 rounded-none border-0 border-b border-line bg-transparent py-2.5 text-base text-fg outline-none transition-[border-color] placeholder:text-muted/70 focus:border-b-2 focus:border-fg focus:pb-[9px] aria-[invalid=true]:border-danger';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(control, 'min-h-28 resize-y', className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select className={cn(control, 'appearance-none pr-7', className)} {...props}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="text-muted pointer-events-none absolute top-1/2 right-1 size-3 -translate-y-1/2"
      >
        <path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

/** Agrupa label + control + error con los ids que necesita un lector de pantalla. */
export function Field({ id, label, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-muted text-[0.8125rem] font-semibold">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-muted text-xs">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-danger text-[0.8125rem] font-semibold">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
