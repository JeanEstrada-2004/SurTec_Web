// Capturas de revisión con Edge/Chrome instalados (playwright-core, sin descargar navegadores).
// Uso: node scripts/screenshots.mjs [url] [salida]
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const url = process.argv[2] || 'http://localhost:4173/';
const outDir = path.resolve(process.argv[3] || '.impeccable/review/shots');
await mkdir(outDir, { recursive: true });

// [escena, fracción del recorrido de la escena]
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const ALL = [
  ['inicio', 0],
  ['surtec', 0.35],
  ['problema', 0.3],
  ['problema', 0.85],
  ['giro', 0.3],
  ['giro', 0.92],
  ['solucion', 0.55],
  ['funcionamiento', 0.22],
  ['funcionamiento', 0.38],
  ['funcionamiento', 0.9],
  ['tecnologia', 0.6],
  ['impacto', 0.02],
  ['impacto', 0.55],
  ['ruta', 0.15],
  ['ruta', 0.7],
  ['plataforma', 0.0],
  ['plataforma', 0.45],
  ['plataforma', 0.97],
];
const POINTS = ONLY ? ALL.filter(([id]) => ONLY.includes(id)) : ALL;

const viewports = (process.env.VIEWPORTS || 'desktop,mobile').split(',');
const sizes = { desktop: { width: 1440, height: 900 }, laptop: { width: 1280, height: 720 }, mobile: { width: 390, height: 844 } };

const browser = await chromium.launch({ channel: process.env.CHANNEL || 'msedge' });
try {
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: sizes[vp], deviceScaleFactor: 1 });
    const logs = [];
    page.on('console', (m) => m.type() === 'error' && logs.push(m.text()));
    page.on('pageerror', (e) => logs.push(String(e)));
    await page.goto(url + (process.env.QUERY || ''), { waitUntil: 'networkidle' });
    await page.waitForTimeout(2800);
    let n = 0;
    for (const [id, frac] of POINTS) {
      const y = await page.evaluate(
        ([id, frac]) => {
          const el = document.getElementById(id);
          const top = el.getBoundingClientRect().top + window.scrollY;
          const span = Math.max(0, el.offsetHeight - window.innerHeight);
          return Math.round(top + span * frac + (span === 0 ? el.offsetHeight * frac : 0));
        },
        [id, frac],
      );
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(1600);
      n += 1;
      await page.screenshot({ path: path.join(outDir, `${vp}-${String(n).padStart(2, '0')}-${id}-${Math.round(frac * 100)}.png`) });
    }
    if (logs.length) console.log(`[${vp}] errores de consola:\n` + logs.join('\n'));
    await page.close();
  }
} finally {
  await browser.close();
}
console.log('Capturas en', outDir);
