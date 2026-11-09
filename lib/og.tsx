import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { STAR_PATH } from '@/components/brand/Star';

export const ogSize = { width: 1200, height: 630 };

const font = (w: 400 | 800) =>
  readFile(path.join(process.cwd(), 'assets', 'og', `open-sans-latin-${w}-normal.woff`));

/** Imagen de Open Graph con la identidad de marca. Se genera en el build para cada página. */
export async function brandOg({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  const [regular, extrabold] = await Promise.all([font(400), font(800)]);
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0a0a0a',
        color: '#e7e3dd',
        padding: '64px 72px',
        fontFamily: 'Open Sans',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: 2,
            color: '#9b978f',
            textTransform: 'uppercase',
          }}
        >
          {kicker}
        </div>
        <svg width="150" height="150" viewBox="538.5 395 898 898">
          <path d={STAR_PATH} fill="#e7e3dd" fillRule="evenodd" />
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 940 }}>
        <div
          style={{ fontSize: title.length > 40 ? 66 : 84, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}
        >
          {title}
        </div>
        {sub ? (
          <div style={{ marginTop: 22, fontSize: 28, color: '#9b978f', lineHeight: 1.35, fontWeight: 400 }}>
            {sub}
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: -0.5,
          textTransform: 'uppercase',
          lineHeight: 1.05,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Picture</span>
          <span>Web Dev</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span>Technology</span>
          <span>&amp; Design</span>
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: 'Open Sans', data: regular, weight: 400, style: 'normal' },
        { name: 'Open Sans', data: extrabold, weight: 800, style: 'normal' },
      ],
    },
  );
}
