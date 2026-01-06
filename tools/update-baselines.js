const fs = require('fs');
const path = require('path');
const files = [ 'homepage-desktop-test.png', 'homepage-tablet-test.png', 'homepage-mobile-test.png' ];
const artwork = path.join(__dirname, '..', 'artwork');
const baselineDir = path.join(__dirname, '..', '__tests__', 'baseline');
if (!fs.existsSync(baselineDir)) fs.mkdirSync(baselineDir, { recursive: true });
files.forEach(f => {
  const src = path.join(artwork, f);
  if (!fs.existsSync(src)) {
    console.warn('Not found:', src);
    return;
  }
  const dest = path.join(baselineDir, f.replace('-test', ''));
  fs.copyFileSync(src, dest);
  console.log('Updated baseline:', dest);
});
