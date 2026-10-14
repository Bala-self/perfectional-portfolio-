import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGE_URL = new URL('../id-card-live.html', import.meta.url).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(PAGE_URL);
await page.waitForTimeout(500);

await page.fill('#fields input[data-key="based_in"]', 'Coimbatore, Tamil Nadu');
assert.equal(await page.textContent('#b-based-in'), 'Coimbatore, Tamil Nadu');

await page.click('#flip');
await page.waitForTimeout(800);
assert.equal(await page.$eval('#card3d', (el) => el.classList.contains('is-flipped')), true);
assert.equal(await page.textContent('#cap'), 'back');

const box = await page.$eval('#grab', (el) => {
  const rect = el.getBoundingClientRect();
  return { x: rect.x + rect.width / 2, y: rect.y + 40 };
});
await page.mouse.move(box.x, box.y);
await page.mouse.down();
await page.mouse.move(box.x + 120, box.y + 10, { steps: 8 });
await page.mouse.up();
await page.waitForTimeout(150);
assert.notEqual(await page.$eval('#swing', (el) => el.style.getPropertyValue('--swing')), '');

await page.click('#flip');
await page.waitForTimeout(800);
const [frontDownload] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#dl-front'),
]);
assert.equal(frontDownload.suggestedFilename(), 'id-card-front.svg');

const [backDownload] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#dl-back'),
]);
assert.equal(backDownload.suggestedFilename(), 'id-card-back.svg');

await page.click('#reset');
await page.waitForTimeout(200);
assert.equal(await page.textContent('#b-based-in'), 'Chennai, Tamil Nadu');
assert.equal(errors.length, 0, errors.join('\n'));

console.log('live card test passed:', path.basename(OUT));
await browser.close();
