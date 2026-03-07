import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Capture console messages
    page.on('console', msg => {
        console.log(`[PAGE CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    // Capture failed requests
    page.on('requestfailed', request => {
        console.log(`[PAGE REQUEST FAILED] ${request.url()} - ${request.failure()?.errorText}`);
    });

    await page.goto('http://localhost:8081/admin', { waitUntil: 'networkidle2', timeout: 30000 });

    console.log("Page loaded. Waiting 5 seconds to collect logs...");
    // Wait to capture post-load errors
    await new Promise(resolve => setTimeout(resolve, 5000));

    await browser.close();
})();
