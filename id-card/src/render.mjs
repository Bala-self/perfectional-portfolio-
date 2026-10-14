// Rasterise the two card SVGs at 2x and build the contact sheet.
//   node src/render.mjs
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fileUrl = (name) => pathToFileURL(path.join(OUT, name)).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 1440 }, deviceScaleFactor: 2 });
for (const [svg, png] of [['id-card-front.svg', 'id-card-front.png'],
                          ['id-card-back.svg', 'id-card-back.png']]) {
  await page.goto(fileUrl(svg));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, png), omitBackground: true });
  console.log('rendered', png);
}
// live page, for the README screenshot
await page.setViewportSize({ width: 1100, height: 900 });
await page.goto(fileUrl('id-card-live.html'));
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(OUT, 'id-card-live-preview.png') });
console.log('rendered id-card-live-preview.png');
await browser.close();
