import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Botón de shadcn/ui, re-tematizado con los tokens de marca (inversión negro/hueso, sin acento). */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-200 ease-out-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-fg disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-fg text-bg border border-fg hover:-translate-y-0.5 hover:opacity-90',
        outline: 'border border-line text-fg hover:border-fg',
        ghost: 'text-muted hover:text-fg',
        whatsapp: 'border border-ok/40 text-ok hover:border-ok',
      },
      size: {
        md: 'min-h-12 px-5 py-3 text-[0.9375rem]',
        sm: 'min-h-10 px-4 py-2 text-sm',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
