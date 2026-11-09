import Image from 'next/image';
import { ViewTransition } from 'react';
import type { ProjectImage } from '@/lib/projects';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  host: string;
  url: string;
  image?: ProjectImage;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Nombre compartido entre la tarjeta y el caso: la captura "viaja" de una página a la otra. */
  transitionName?: string;
};

/** Captura alta de la web en vivo (thum.io). next/image la optimiza y la sirve desde el propio dominio. */
export const livePreview = (url: string): string =>
  `https://image.thum.io/get/width/1200/crop/1900/noanimate/${url}`;

/**
 * Vista previa del proyecto dentro de un marco de navegador.
 * - Usa la captura local si existe (`npm run capturas`), si no, una captura en vivo de la web.
 * - Al pasar el mouse, la imagen se desplaza hacia abajo como si se scrolleara la página.
 * - Al entrar en pantalla se descubre con una cortina (CSS, sin JavaScript).
 */
export function ProjectShot({ title, host, url, image, sizes, priority, className, transitionName }: Props) {
  const shot = (
    <div className={cn('unveil rounded-marca border-line bg-surface overflow-hidden border', className)}>
      <div className="border-line flex items-center gap-2 border-b px-4 py-2.5" aria-hidden="true">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="bg-bg text-muted ml-2 truncate rounded px-2.5 py-0.5 text-[0.6875rem]">{host}</span>
      </div>
      <div className="preview-pan relative aspect-[16/10] bg-[linear-gradient(110deg,var(--surface)_30%,var(--line)_50%,var(--surface)_70%)]">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            blurDataURL={image.blur}
            className="object-cover"
          />
        ) : (
          <Image
            src={livePreview(url)}
            alt={`Vista previa de ${title}`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
  if (!transitionName) return shot;
  return (
    <ViewTransition name={transitionName} share="morph" default="none">
      {shot}
    </ViewTransition>
  );
}

export const hostOf = (url: string): string => new URL(url).host.replace(/^www\./, '');
