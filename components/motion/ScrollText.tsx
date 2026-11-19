import type { ReactNode } from 'react';

type Part = string | { hl: string };

/**
 * Frase grande que se "enciende" palabra por palabra mientras bajás (CSS ligado al scroll, sin JS).
 * Donde el navegador no lo soporta o con "reducir movimiento", el texto se ve completo de entrada.
 */
export function ScrollText({ parts, as: Tag = 'p' }: { parts: Part[]; as?: 'p' | 'h2' }) {
  const words: ReactNode[] = [];
  parts.forEach((part, pi) => {
    const hl = typeof part !== 'string';
    const text = hl ? part.hl : part;
    text
      .split(' ')
      .filter(Boolean)
      .forEach((w, wi) => {
        words.push(
          <span key={`${pi}-${wi}`} className={hl ? 'scroll-word text-accent-ink' : 'scroll-word'}>
            {w}{' '}
          </span>,
        );
      });
  });
  return <Tag className="scroll-text">{words}</Tag>;
}
