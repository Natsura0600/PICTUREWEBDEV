/**
 * Datos estructurados. Se escapa "<" para que ningún texto pueda cerrar el <script>
 * (recomendación de la guía de JSON-LD de Next.js).
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
