const puppeteer = require('puppeteer-extra'); // Use puppeteer-extra with puppeteer
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Apply the stealth plugin to Puppeteer
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // Set headless to true
  const page = await browser.newPage();

  const targetURL = 'https://vegamovies.li/36201-gargi-2022-hindi-tamil-hdrip-720p-480p-1080p.html';

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const url = req.url();
    if (url.endsWith('.m3u8')) {
      console.log(`m3u8 file requested: ${url}`);
    }
    req.continue();
  });

  await page.goto(targetURL, { waitUntil: 'networkidle2' });

  await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 30 seconds to capture all requests

  await browser.close();
})();
