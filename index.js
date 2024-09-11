const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const app = express();

// Define a route to trigger Puppeteer


app.get('/',async(req,res)=>{

  res.json({
    message: 'Hello from Puppeteer our server is working !',
  })
})
app.get('/monitor', async (req, res) => {
  try {
    // Set the target URL from query params or hardcoded
    const targetURL = req.query.url || 'https://videoplayertarun.vercel.app/';
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Intercept network requests
    await page.setRequestInterception(true);
    let m3u8Urls = [];
    page.on('request', (req) => {
      const url = req.url();
      if (url.endsWith('.m3u8')) {
        console.log(`m3u8 file requested: ${url}`);
        m3u8Urls.push(url);
      }
      req.continue();
    });

    // Go to the target URL
    await page.goto(targetURL, { waitUntil: 'networkidle2' });

    // Wait for 30 seconds to ensure all network requests are captured
    await new Promise(resolve => setTimeout(resolve, 500));

    // Close the browser
    await browser.close();

    // Return the captured m3u8 URLs as a response
    res.json({ m3u8Urls });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error capturing the m3u8 file');
  }
});



app.get('/hdhub4u', async (req, res) => {
  try {
    // Set the target URL from query params or hardcoded
    const targetURL = req.query.url || 'https://videoplayertarun.vercel.app/';
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Intercept network requests
    await page.setRequestInterception(true);
    let m3u8Urls = [];
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('.m3u8')) {
        console.log(`m3u8 file requested: ${url}`);
        m3u8Urls.push(url);
      }
      req.continue();
    });

    // Go to the target URL
    await page.goto(targetURL, { waitUntil: 'networkidle2' });

    // Wait for 30 seconds to ensure all network requests are captured
    await new Promise(resolve => setTimeout(resolve, 100));

    // Close the browser
    await browser.close();

    // Return the captured m3u8 URLs as a response
    res.json({ m3u8Urls });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error capturing the m3u8 file');
  }
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
