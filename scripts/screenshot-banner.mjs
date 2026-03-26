import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, '../public/gen-banner.html');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Set viewport to exact LinkedIn banner size @ 2x for retina quality
await page.setViewportSize({ width: 1128, height: 191 });

await page.goto(`file://${htmlPath}`);

// Wait for fonts to settle
await page.waitForTimeout(1000);

// Screenshot just the page content - no browser chrome
await page.screenshot({
  path: '/Users/dongraham/Desktop/peer-pathway-project/public/earlyedge-linkedin-banner.png',
  fullPage: false,
  omitBackground: false,
});

console.log('Saved!');
await browser.close();
