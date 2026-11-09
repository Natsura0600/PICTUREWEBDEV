import Image from 'next/image';
import { Star } from '@/components/brand/Star';
import type { ProjectImage } from '@/lib/projects';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  host: string;
  image?: ProjectImage;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Captura del proyecto dentro de un marco de navegador.
 * Si todavía no corriste `npm run capturas`, muestra un marco de marca con el nombre
 * (nunca una caja vacía ni una imagen rota).
 */
export function ProjectShot({ title, host, image, sizes, priority, className }: Props) {
  return (
    <div className={cn('rounded-marca border-line bg-surface overflow-hidden border', className)}>
      <div className="border-line flex items-center gap-2 border-b px-4 py-2.5" aria-hidden="true">
        <span className="bg-line size-2 rounded-full" />
        <span className="bg-line size-2 rounded-full" />
        <span className="bg-line size-2 rounded-full" />
        <span className="bg-bg text-muted ml-2 truncate rounded px-2.5 py-0.5 text-[0.6875rem]">{host}</span>
      </div>
      <div className="relative aspect-[16/10]">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            blurDataURL={image.blur}
            className="object-cover object-top"
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center p-6"
            role="img"
            aria-label={`Vista de ${title}`}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <Star className="text-line size-10" />
              <span className="text-[clamp(1.4rem,3vw,2.2rem)] font-extrabold tracking-[-0.04em]">
                {title}
              </span>
              <span className="label-marca text-muted">{host}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const hostOf = (url: string): string => new URL(url).host.replace(/^www\./, '');
