import { faqs } from '@/lib/site';

/** Preguntas frecuentes con <details>: accesible y sin JavaScript. */
export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="border-line border-t py-20 md:py-28">
      <div className="wrap grid gap-10 md:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] md:gap-16">
        <div>
          <p className="kicker">Preguntas frecuentes</p>
          <h2 id="faq-title" className="text-h2 mt-4 font-extrabold">
            Lo que todos <span className="text-muted">preguntan primero.</span>
          </h2>
        </div>
        <div className="border-line border-t">
          {faqs.map((f) => (
            <details key={f.q} className="group border-line border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-bold tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="text-muted text-2xl font-normal transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-muted max-w-[60ch] pb-6">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
