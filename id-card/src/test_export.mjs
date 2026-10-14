import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMP = fs.mkdtempSync(path.join(os.tmpdir(), 'id-card-export-'));
const PAGE_URL = new URL('../id-card-live.html', import.meta.url).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 }, acceptDownloads: true });

await page.goto(PAGE_URL);
await page.fill('#fields input[data-key="email"]', 'hello@example.com');

for (const [id, filename] of [['#dl-front', 'export-front.svg'], ['#dl-back', 'export-back.svg']]) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click(id),
  ]);
  const file = path.join(TEMP, filename);
  await download.saveAs(file);
  assert.ok(fs.statSync(file).size > 1000, `${filename} was not exported`);

  const preview = await browser.newPage({ viewport: { width: 1024, height: 1440 } });
  await preview.goto(pathToFileURL(file).href);
  await preview.waitForTimeout(300);
  await preview.screenshot({ path: path.join(TEMP, filename.replace('.svg', '.png')), omitBackground: true });
  await preview.close();
}

console.log('SVG export test passed:', TEMP);
await browser.close();
