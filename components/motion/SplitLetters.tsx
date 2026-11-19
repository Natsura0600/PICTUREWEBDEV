import { Fragment } from 'react';

/**
 * Parte un texto en letras que saltan al pasar el mouse (y empujan un poco a sus vecinas, efecto ola).
 * Los lectores de pantalla leen el texto entero una sola vez (sr-only); las letras sueltas van ocultas.
 * Cada palabra queda junta (sin cortes a mitad de palabra).
 */
export function SplitLetters({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={className}>
        {words.map((w, wi) => (
          <Fragment key={wi}>
            {wi > 0 ? ' ' : null}
            <span className="inline-block whitespace-nowrap">
              {Array.from(w).map((ch, ci) => (
                <span key={ci} className="letter">
                  {ch}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
}
