/**
 * Saca capturas de cada proyecto (computadora y celular) y las guarda optimizadas
 * en public/proyectos/<slug>/, junto con un media.json que lee el sitio.
 *
 * Uso:  npx playwright install chromium   (una sola vez)
 *       npm run capturas                  (todos)
 *       npm run capturas -- keenas-barberia   (uno solo)
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

  const browser = await chromium.launch();
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
        const page = await browser.newPage({ viewport: d.viewport, deviceScaleFactor: d.scale });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
        await page.waitForTimeout(1500); // deja terminar animaciones de entrada
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
