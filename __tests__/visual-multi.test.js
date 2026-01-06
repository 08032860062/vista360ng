const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const puppeteer = require('puppeteer');
const { createApp, ensureData } = require('../app');

jest.setTimeout(60000);

const viewports = [
  { name: 'desktop', width: 1280, height: 900, threshold: 1000 },
  { name: 'tablet', width: 900, height: 800, threshold: 600 },
  { name: 'mobile', width: 375, height: 812, threshold: 300 }
];

describe('visual: homepage snapshots (multi-viewport)', () => {
  let server, port, browser, page;

  beforeAll(async () => {
    await ensureData();
    const app = createApp();
    server = app.listen(0);
    port = server.address().port;
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.close();
  });

  for (const vp of viewports) {
    test(`viewport ${vp.name}`, async () => {
      const url = `http://localhost:${port}/`;
      const outDir = path.join(__dirname, '..', 'artwork');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const tmp = path.join(outDir, `homepage-${vp.name}-test.png`);
      const baseline = path.join(__dirname, 'baseline', `homepage-${vp.name}.png`);
      const diffPath = path.join(outDir, `homepage-${vp.name}-diff.png`);

      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(url, { waitUntil: 'networkidle2' });
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
      expect(img1.width).toBe(img2.width);
      expect(img1.height).toBe(img2.height);
      const diff = new PNG({ width: img1.width, height: img1.height });
      const mismatched = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.12 });
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
      expect(mismatched).toBeLessThan(vp.threshold);
    });
  }
});