// Prepara los recursos estáticos de la landing a partir de los logos oficiales
// (sin redibujar ni deformar: solo se elimina el margen transparente y se
// separa el isotipo con un recorte proporcional) y del mockup publicado.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import QRCode from 'qrcode';
import { chromium } from 'playwright-core';

const root = path.resolve(import.meta.dirname, '..');
const logos = path.join(root, 'Logos SurTec');
const out = path.join(root, 'src', 'assets');
const MOCKUP_URL = 'https://jeanestrada-2004.github.io/Mockup-ERP/surtec-peti/index.html';

await mkdir(path.join(out, 'brand'), { recursive: true });
await mkdir(path.join(out, 'mockup'), { recursive: true });
await mkdir(path.join(root, 'public'), { recursive: true });

/** Recorta el margen transparente y devuelve también el corte entre isotipo y texto. */
async function analyse(file) {
  const img = sharp(file).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const rows = new Array(info.height).fill(0);
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * 4 + 3] > 40) rows[y] += 1;
    }
  }
  const inked = rows.map((n) => n > 0);
  const top = inked.indexOf(true);
  const bottom = inked.lastIndexOf(true);
  // primer hueco vertical después del isotipo = separación entre la "S" y "SurTec"
  let y = top;
  while (y < bottom && inked[y]) y += 1;
  const markBottom = y;
  return { info, top, bottom, markBottom };
}

async function columns(file, y0, y1) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width;
  let right = 0;
  for (let y = y0; y < y1; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * 4 + 3] > 40) {
        left = Math.min(left, x);
        right = Math.max(right, x);
      }
    }
  }
  return { left, right };
}

async function exportLogo(src, name, width) {
  const a = await analyse(src);
  const full = await columns(src, a.top, a.bottom + 1);
  const pad = 2;
  const box = {
    left: Math.max(0, full.left - pad),
    top: Math.max(0, a.top - pad),
    width: Math.min(a.info.width, full.right - full.left + 1 + pad * 2),
    height: Math.min(a.info.height, a.bottom - a.top + 1 + pad * 2),
  };
  await sharp(src).extract(box).resize({ width, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(path.join(out, 'brand', `${name}.png`));

  const mark = await columns(src, a.top, a.markBottom);
  const markBox = {
    left: Math.max(0, mark.left - pad),
    top: Math.max(0, a.top - pad),
    width: mark.right - mark.left + 1 + pad * 2,
    height: a.markBottom - a.top + pad * 2,
  };
  await sharp(src).extract(markBox).resize({ height: 256, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(path.join(out, 'brand', `${name.replace('logo', 'isotipo')}.png`));
  return markBox;
}

await exportLogo(path.join(logos, 'Logo - PNG sin fondo.png'), 'logo-color', 560);
await exportLogo(path.join(logos, 'Logo - Blanco transparente.png'), 'logo-white', 520);

// Favicon a partir del isotipo oficial a color
await sharp(path.join(out, 'brand', 'isotipo-color.png'))
  .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(root, 'public', 'favicon.png'));

// QR hacia el mockup navegable
const qr = await QRCode.toString(MOCKUP_URL, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 1,
  color: { dark: '#1A365D', light: '#FFFFFF' },
});
await writeFile(path.join(out, 'qr-mockup.svg'), qr);

// Capturas del mockup publicado (datos ficticios del propio mockup)
const browser = await chromium.launch({ channel: 'msedge' });
try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
  await desktop.goto(MOCKUP_URL, { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(1200);
  const buf = await desktop.screenshot();
  await sharp(buf).resize({ width: 1680 }).webp({ quality: 82 }).toFile(path.join(out, 'mockup', 'panel-general.webp'));

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await phone.goto(MOCKUP_URL, { waitUntil: 'networkidle' });
  await phone.waitForTimeout(1200);
  const pbuf = await phone.screenshot();
  await sharp(pbuf).resize({ width: 640 }).webp({ quality: 80 }).toFile(path.join(out, 'mockup', 'panel-movil.webp'));
} finally {
  await browser.close();
}

console.log('Recursos listos en src/assets y public/');
