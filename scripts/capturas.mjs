/**
 * Saca capturas de cada proyecto (computadora y celular) y las guarda optimizadas
 * en public/proyectos/<slug>/, junto con un media.json que lee el sitio.
 *
 * Uso:  npx playwright install chromium   (una sola vez)
 *       npm run capturas                  (todos)
 *       npm run capturas -- zona-cero   (uno solo)
 *
 * Para que la captura no salga a medio cargar: recorre la página entera (dispara imágenes
 * diferidas y animaciones al hacer scroll), espera fuentes e imágenes, y pide "reducir movimiento"
 * para que las entradas animadas ya estén terminadas.
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content', 'proyectos');
const OUT = path.join(ROOT, 'public', 'proyectos');

const DEVICES = [
  { device: 'desktop', viewport: { width: 1440, height: 900 }, scale: 1, width: 1600 },
  { device: 'mobile', viewport: { width: 390, height: 844 }, scale: 2, width: 780 },
];

/** Lee title y url del bloque `export const meta` sin ejecutar el MDX. */
async function readMeta(file) {
  const src = await fs.readFile(file, 'utf8');
  const pick = (key) => src.match(new RegExp(`${key}:\\s*["'\`](.+?)["'\`],`))?.[1];
  return { title: pick('title'), url: pick('url') };
}

/** Espera a que la página esté completa de verdad antes de sacar la foto. */
async function settle(page) {
  // Bajar hasta el final y volver: carga imágenes diferidas y dispara lo que aparece con el scroll
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = Array.from(document.images).filter((img) => {
      const r = img.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight; // solo las que salen en la foto
    });
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? img.decode?.().catch(() => {})
          : new Promise((r) => {
              img.addEventListener('load', r, { once: true });
              img.addEventListener('error', r, { once: true });
            }),
      ),
    );
  });
  await page.waitForTimeout(2000); // margen para fondos, videos y transiciones
}

async function blurOf(buffer) {
  const tiny = await sharp(buffer).resize(16).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${tiny.toString('base64')}`;
}

async function main() {
  const only = process.argv[2];
  const files = (await fs.readdir(CONTENT)).filter(
    (f) => f.endsWith('.mdx') && (!only || f === `${only}.mdx`),
  );
  if (!files.length) throw new Error(only ? `No existe content/proyectos/${only}.mdx` : 'No hay proyectos');

  // En entornos con Chromium preinstalado (CHROMIUM_PATH) se usa ese; si no, el de Playwright
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : undefined,
  );
  try {
    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '');
      const { title, url } = await readMeta(path.join(CONTENT, file));
      if (!url) {
        console.warn(`! ${slug}: sin url, se saltea`);
        continue;
      }
      const dir = path.join(OUT, slug);
      await fs.mkdir(dir, { recursive: true });
      const images = [];

      for (const d of DEVICES) {
        const page = await browser.newPage({
          viewport: d.viewport,
          deviceScaleFactor: d.scale,
          reducedMotion: 'reduce',
          isMobile: d.device === 'mobile',
          hasTouch: d.device === 'mobile',
        });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
        await settle(page);
        const png = await page.screenshot({ type: 'png' });
        await page.close();

        const webp = await sharp(png).resize({ width: d.width }).webp({ quality: 82 }).toBuffer();
        const { width, height } = await sharp(webp).metadata();
        const name = `${d.device}.webp`;
        await fs.writeFile(path.join(dir, name), webp);
        images.push({
          src: `/proyectos/${slug}/${name}`,
          width,
          height,
          blur: await blurOf(webp),
          device: d.device,
          alt: `${title}: vista en ${d.device === 'desktop' ? 'computadora' : 'celular'}`,
        });
        console.warn(`✓ ${slug} ${d.device}`);
      }
      await fs.writeFile(path.join(dir, 'media.json'), JSON.stringify({ images }, null, 2));
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
