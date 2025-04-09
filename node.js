const puppeteer = require('puppeteer');

(async () => {
    console.log('[📦] Launching browser...');
    const browser = await puppeteer.launch({ headless: true }); // Set to false to see the browser
    const page = await browser.newPage();

    console.log('[🌐] Navigating to rollbet.gg...');
    await page.goto('https://rollbet.gg', { waitUntil: 'domcontentloaded' });

    console.log('[🔍] Waiting for timer element to appear...');
    await page.waitForSelector('div._270b8fcf');
    console.log('[✅] Timer element found.');

    let alertSent = false;

    const checkTimer = async () => {
        // console.log('[🕵️] Checking timer...');
        const time = await page.evaluate(() => {
            const el = document.querySelector('div._270b8fcf');
            if (!el) return null;

            const spans = el.querySelectorAll('span');
            if (spans.length < 2) return null;

            const minutes = parseInt(spans[0].textContent.trim(), 10);
            const seconds = parseInt(spans[1].textContent.trim(), 10);

            return { minutes, seconds };
        });

        if (time) {
            console.log(`Rain in: ${time.minutes}m ${time.seconds}s`);

            if (time.minutes === 0 && time.seconds === 0 && !alertSent) {
                console.log('⏰ TIMES UP! Action triggered.');
                alertSent = true;

                // Optional: Do something else here
            }
        } else {
            console.log('[⚠️] Timer element not found or could not be parsed.');
        }
    };

    console.log('[🚀] Starting timer check loop every 2 seconds...');
    setInterval(checkTimer, 1000);
})();
