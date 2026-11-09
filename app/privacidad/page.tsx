import { pageMetadata } from '@/lib/seo';
import { site, whatsappUrl } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Política de privacidad',
  description: 'Qué datos recolecta Picture Web Dev, para qué los usa y cómo pedir que los borremos.',
  path: '/privacidad',
});

const UPDATED = '8 de noviembre de 2026';

export default function PrivacyPage() {
  return (
    <section className="wrap pt-14 pb-24 md:pt-20">
      <div className="prose-caso">
        <p className="kicker">Legal</p>
        <h1 className="text-h2 mt-4 font-extrabold">Política de privacidad</h1>
        <p>Última actualización: {UPDATED}.</p>

        <h2>Quién es responsable</h2>
        <p>
          {site.name}, de {site.founder.name}, con base en {site.city}, {site.region}, Argentina. Podés
          contactarnos por <a href={whatsappUrl()}>WhatsApp al {site.whatsapp.display}</a>.
        </p>

        <h2>Qué datos recolectamos</h2>
        <ul>
          <li>
            <strong>Formulario de contacto:</strong> nombre, email, WhatsApp (opcional), tipo de proyecto,
            presupuesto, plazo, la descripción que escribas y los links de referencia.
          </li>
          <li>
            <strong>Estadísticas de uso:</strong> usamos Vercel Analytics y Speed Insights, que miden visitas
            y velocidad de carga sin cookies y sin identificarte personalmente.
          </li>
          <li>
            <strong>Datos técnicos:</strong> tu dirección IP se usa de forma temporal para limitar envíos
            repetidos del formulario y frenar el spam.
          </li>
        </ul>

        <h2>Para qué los usamos</h2>
        <p>
          Solo para responder tu consulta, preparar una propuesta y, si trabajamos juntos, llevar adelante el
          proyecto. No vendemos ni compartimos tus datos con terceros para publicidad.
        </p>

        <h2>Dónde se guardan</h2>
        <p>
          Las consultas se guardan en servicios de infraestructura que usamos para operar el sitio (Vercel y
          Cloudflare). Cada uno aplica sus propias medidas de seguridad.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Podés pedir ver, corregir o borrar tus datos en cualquier momento escribiéndonos por WhatsApp. Te
          respondemos dentro de los 10 días hábiles. Estos derechos están protegidos por la Ley 25.326 de
          Protección de los Datos Personales de Argentina. La Agencia de Acceso a la Información Pública es el
          órgano de control de esa ley.
        </p>

        <h2>Cambios</h2>
        <p>Si cambiamos esta política, actualizamos la fecha de arriba.</p>
      </div>
    </section>
  );
}
