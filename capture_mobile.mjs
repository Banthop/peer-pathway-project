import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// Mobile viewport (iPhone 14 Pro)
await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });

console.log('Navigating to landing page (mobile)...');
await page.goto('http://localhost:8080', { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 2000));

await page.screenshot({ path: 'landing_mobile.png', fullPage: false });
console.log('Mobile above-fold screenshot saved.');

await page.screenshot({ path: 'landing_mobile_full.png', fullPage: true });
console.log('Mobile full-page screenshot saved.');

await browser.close();
