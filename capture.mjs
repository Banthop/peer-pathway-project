import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    try {
        console.log("Navigating to landing page...");
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Screenshot 1: Hero + banner (above the fold)
        await page.screenshot({ path: 'landing_hero.png' });
        console.log("Hero screenshot saved.");

        // Screenshot 2: Full page
        await page.screenshot({ path: 'landing_full.png', fullPage: true });
        console.log("Full page screenshot saved.");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await browser.close();
    }
})();
