import { ViewTransition, type ReactNode } from 'react';

/**
 * Transición entre páginas. A diferencia del layout, el template se vuelve a montar en cada
 * navegación, así que la página que se va hace su animación de salida y la nueva la de entrada.
 * El header y el footer viven en el layout y quedan quietos.
 * Sin soporte del navegador (o con "reducir movimiento"), la navegación es instantánea, como antes.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
