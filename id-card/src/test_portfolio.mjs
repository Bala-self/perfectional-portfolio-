import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const cardDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const portfolioDir = path.resolve(cardDir, '..');
const pageUrl = pathToFileURL(path.join(portfolioDir, 'index.html')).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(pageUrl);
await page.waitForTimeout(5200);

for (const selector of ['#profileCardRig', '#profileCardHolder', '#profileCardFrame', '#profileCardTether', '#profileCard']) {
  assert.ok(await page.$(selector), `missing ${selector}`);
}

const card = await page.$('#profileCard');
const rigBox = await page.$eval('#profileCardRig', (element) => {
  const box = element.getBoundingClientRect();
  return { top: box.top, bottom: box.bottom };
});
assert.ok(rigBox.top <= 1, 'lanyard is not anchored to the top of the viewport');
const box = await card.boundingBox();
assert.ok(box, 'profile card has no layout box');
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
assert.equal(await page.$eval('#profileCard', (element) => element.classList.contains('is-dragging')), true);
await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2 + 45, { steps: 8 });
const pulled = await page.$eval('#profileCardRig', (element) => ({
  x: element.style.getPropertyValue('--pull-x'),
  y: element.style.getPropertyValue('--pull-y'),
  angle: element.style.getPropertyValue('--tether-angle'),
  scale: element.style.getPropertyValue('--tether-scale'),
}));
await page.mouse.up();

assert.ok(Math.abs(Number.parseFloat(pulled.x)) > 0, 'elastic pull did not update');
assert.ok(Math.abs(Number.parseFloat(pulled.angle)) > 0, 'tether did not follow the pull');
assert.ok(Number.parseFloat(pulled.scale) > 1, 'tether did not stretch with the card');
await page.waitForFunction(() => {
  const element = document.querySelector('#profileCardRig');
  const values = ['--pull-x', '--pull-y', '--tether-angle'].map((name) =>
    Math.abs(Number.parseFloat(element.style.getPropertyValue(name)))
  );
  return values.every((value) => value < 0.01)
    && Number.parseFloat(element.style.getPropertyValue('--tether-scale')) === 1;
}, null, { timeout: 4500 });

const restBox = await card.boundingBox();
await page.mouse.move(restBox.x + restBox.width / 2, restBox.y + restBox.height / 2);
await page.mouse.down();
await page.mouse.move(restBox.x + restBox.width / 2, restBox.y + restBox.height / 2 - 260, { steps: 10 });
assert.equal(await page.$eval('#profileCardRig', (element) => element.classList.contains('is-pull-locked')), true);
const locked = await page.$eval('#profileCardRig', (element) => ({
  y: element.style.getPropertyValue('--pull-y'),
  angle: element.style.getPropertyValue('--tether-angle'),
}));
assert.ok(Number.parseFloat(locked.y) < -130, 'upper pull did not reach its safety stop');
await page.mouse.up();
assert.equal(await page.$eval('#profileCardRig', (element) => element.classList.contains('is-pull-locked')), true);

const lockedBox = await card.boundingBox();
const lockedPointerY = Math.max(8, lockedBox.y + lockedBox.height / 2);
await page.mouse.move(lockedBox.x + lockedBox.width / 2, lockedPointerY);
await page.mouse.down();
await page.mouse.move(lockedBox.x + lockedBox.width / 2, lockedPointerY + 48, { steps: 6 });
assert.equal(await page.$eval('#profileCardRig', (element) => element.classList.contains('is-pull-locked')), false);
await page.mouse.up();
await page.waitForFunction(() => {
  const element = document.querySelector('#profileCardRig');
  return element.style.getPropertyValue('--pull-x') === '0.00px'
    && element.style.getPropertyValue('--pull-y') === '0.00px'
    && element.style.getPropertyValue('--tether-angle') === '0.00deg';
}, null, { timeout: 5000 });
await page.click('#profileCard');
assert.equal(await page.$eval('#profileCard', (element) => element.classList.contains('is-flipped')), true);
assert.equal(await page.$eval('#profileCardFrame', (element) => element.classList.contains('is-flipped')), true);
assert.equal(await page.$eval('.profile-card__face--front', (element) => element.getAttribute('aria-hidden')), 'true');
assert.equal(await page.$eval('.profile-card__face--back', (element) => element.getAttribute('aria-hidden')), 'false');
assert.equal(errors.length, 0, errors.join('\n'));

console.log('portfolio card test passed:', { pulled, locked });
await browser.close();
