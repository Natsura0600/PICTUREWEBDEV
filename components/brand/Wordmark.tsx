import { cn } from '@/lib/utils';

/** Las dos etiquetas del logo, apiladas como en el original. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('label-marca block', className)}>
      Picture
      <br />
      Web Dev
    </span>
  );
}

export function Tagline({ className }: { className?: string }) {
  return (
    <span className={cn('label-marca block', className)}>
      Technology
      <br />
      &amp; Design
    </span>
  );
}
