import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { Providers } from '@/components/providers';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationJsonLd } from '@/lib/seo';
import { site } from '@/lib/site';
import './globals.css';

/** Open Sans autoalojada: sin pedidos a Google, sin saltos de diseño, y el build no depende de la red. */
const openSans = localFont({
  src: [
    { path: './fonts/open-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/open-sans-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: './fonts/open-sans-latin-800-normal.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-open-sans',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Páginas web y sistemas para negocios`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder.name }],
  creator: site.founder.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    url: '/',
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/estrella-hueso.svg', type: 'image/svg+xml' },
    ],
    apple: '/brand/apple-touch-icon.png',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" className={openSans.variable} suppressHydrationWarning>
      <body>
        <a
          href="#contenido"
          className="bg-fg text-bg sr-only z-50 rounded px-4 py-2 font-bold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar al contenido
        </a>
        <Providers>
          <Header />
          <main id="contenido" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
        </Providers>
        <JsonLd data={organizationJsonLd()} />
        {/* Solo en Vercel: fuera de ahí los scripts no existen y darían errores en la consola */}
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
