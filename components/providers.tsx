'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

/** Tema oscuro por defecto (la versión principal de la marca), con modo claro. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
