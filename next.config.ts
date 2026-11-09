import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * CSP sin nonce, a propósito: un nonce obliga a renderizar cada página en el
 * servidor en cada visita (sin estático ni CDN). Este sitio no muestra HTML de
 * usuarios, así que la superficie de XSS es mínima y priorizamos rendimiento.
 * El resto de las directivas es estricto. El panel /admin usa script inline y
 * también necesita 'unsafe-inline'.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Vistas previas en vivo de los proyectos (se optimizan y se sirven desde este dominio)
    remotePatterns: [{ protocol: 'https', hostname: 'image.thum.io' }],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1600, 1920, 2560],
    imageSizes: [96, 160, 256, 384],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      {
        source: '/admin',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      { source: '/api/(.*)', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ];
  },
  async rewrites() {
    // El panel sigue siendo el HTML de siempre, servido en /admin
    return [{ source: '/admin', destination: '/admin.html' }];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
