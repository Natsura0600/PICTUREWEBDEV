import Link from 'next/link';
import { Frame, Star } from '@/components/brand/Star';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Página no encontrada', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[70vh] items-center gap-10 py-16 md:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)]">
      <div>
        <p className="kicker">Error 404</p>
        <h1 className="text-display mt-4 font-extrabold">
          Esta página <span className="text-muted">no existe.</span>
        </h1>
        <p className="text-muted mt-6 max-w-[48ch] md:text-lg">
          Puede que el link esté mal escrito o que la hayamos movido. Desde acá podés seguir:
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Ir al inicio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/proyectos">Ver proyectos</Link>
          </Button>
        </div>
      </div>
      <div className="relative mx-auto aspect-square w-40 md:w-full md:max-w-sm" aria-hidden="true">
        <Frame className="text-line absolute inset-0 size-full" strokeWidth={2} />
        <Star className="text-line absolute inset-[13%] rotate-[18deg]" />
      </div>
    </section>
  );
}
