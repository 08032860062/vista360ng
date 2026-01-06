const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const outDir = path.join(__dirname, '..', 'artwork');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const url = process.env.URL || 'http://localhost:3000/';
  console.log('Opening', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // wait a short while for fonts/styles
  await page.waitForTimeout(800);

  const out = path.join(outDir, 'homepage-mockup.png');
  await page.screenshot({ path: out, fullPage: true });
  console.log('Saved screenshot to', out);
  await browser.close();
})();
