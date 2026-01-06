const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const puppeteer = require('puppeteer');
const { createApp, ensureData } = require('../app');

jest.setTimeout(60000);

describe('visual: page snapshots (tour & admin)', () => {
  let server, port, browser, page;

  beforeAll(async () => {
    await ensureData();
    const app = createApp();
    server = app.listen(0);
    port = server.address().port;
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
  });

  afterAll(async () => {
    await browser.close();
    server.close();
  });

  test('tour page snapshot (first tour)', async () => {
    // fetch list of tours and pick first id
    const res = await (await page.goto(`http://localhost:${port}/api/tours`, { waitUntil: 'networkidle2' })).text();
    const list = JSON.parse(res);
    const id = list && list.length ? list[0].id : null;
    if (!id) return console.warn('No tours available to snapshot');

    const outDir = path.join(__dirname, '..', 'artwork');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const tmp = path.join(outDir, `tour-${id}-test.png`);
    const baseline = path.join(__dirname, 'baseline', `tour-${id}.png`);

    await page.goto(`http://localhost:${port}/tour/${id}`, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: tmp, fullPage: true });

    if (!fs.existsSync(baseline)) {
      fs.mkdirSync(path.dirname(baseline), { recursive: true });
      fs.copyFileSync(tmp, baseline);
      console.warn('Baseline created at', baseline);
      return;
    }

    const img1 = PNG.sync.read(fs.readFileSync(tmp));
    const img2 = PNG.sync.read(fs.readFileSync(baseline));
    const diff = new PNG({ width: img1.width, height: img1.height });
    const mismatched = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.12 });
    fs.writeFileSync(path.join(outDir, `tour-${id}-diff.png`), PNG.sync.write(diff));
    expect(mismatched).toBeLessThan(800);
  });

  test('admin page snapshot (login screen)', async () => {
    const outDir = path.join(__dirname, '..', 'artwork');
    const tmp = path.join(outDir, `admin-test.png`);
    const baseline = path.join(__dirname, 'baseline', `admin.png`);

    await page.goto(`http://localhost:${port}/admin`, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: tmp, fullPage: true });

    if (!fs.existsSync(baseline)) {
      fs.mkdirSync(path.dirname(baseline), { recursive: true });
      fs.copyFileSync(tmp, baseline);
      console.warn('Baseline created at', baseline);
      return;
    }

    const img1 = PNG.sync.read(fs.readFileSync(tmp));
    const img2 = PNG.sync.read(fs.readFileSync(baseline));
    const diff = new PNG({ width: img1.width, height: img1.height });
    const mismatched = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.12 });
    fs.writeFileSync(path.join(outDir, `admin-diff.png`), PNG.sync.write(diff));
    expect(mismatched).toBeLessThan(500);
  });
});