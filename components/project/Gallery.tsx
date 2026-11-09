import Image from 'next/image';
import type { ProjectImage } from '@/lib/projects';

/** Capturas de computadora y celular. Cada una con su tamaño real para que no haya saltos de diseño. */
export function Gallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const desktop = images.filter((i) => i.device === 'desktop');
  const mobile = images.filter((i) => i.device === 'mobile');
  if (!images.length) return null;
  return (
    <section
      aria-label={`Capturas de ${title}`}
      className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,.36fr)] md:items-start"
    >
      <div className="grid gap-4">
        {desktop.map((img) => (
          <figure key={img.src} className="rounded-marca border-line bg-surface overflow-hidden border">
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(min-width: 768px) 70vw, 100vw"
              placeholder="blur"
              blurDataURL={img.blur}
              className="h-auto w-full"
            />
          </figure>
        ))}
      </div>
      {mobile.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          {mobile.map((img) => (
            <figure
              key={img.src}
              className="border-line bg-surface overflow-hidden rounded-[1.75rem] border-4"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(min-width: 768px) 25vw, 50vw"
                placeholder="blur"
                blurDataURL={img.blur}
                className="h-auto w-full"
              />
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}
