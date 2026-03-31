import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import path from 'path';

const DIR = './portfolio-screenshots';
await mkdir(DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const pages = [
  { url: '/', name: '01_homepage_hero.png' },
  { url: '/browse', name: '02_browse_coaches.png' },
  { url: '/webinar', name: '03_webinar_landing.png' },
  { url: '/resources/cold-email-checklist', name: '05_cold_email_checklist.png' },
  { url: '/resources/cold-email-guide', name: '06_cold_email_guide.png' },
  { url: '/guarantee', name: '07_guarantee_page.png' },
  { url: '/login', name: '08_login_page.png' },
];

for (const p of pages) {
  console.log(`📸 Capturing ${p.name}...`);
  await page.goto(`http://localhost:5174${p.url}`, { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000)); // wait for animations
  await page.screenshot({ path: path.join(DIR, p.name), fullPage: false });
  console.log(`   ✓ Saved ${p.name}`);
}

await browser.close();
console.log(`\n✅ All screenshots saved to ${DIR}/`);
