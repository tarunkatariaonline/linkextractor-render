const express = require('express');
const { timeout } = require('puppeteer-core');
const puppeteer = require('puppeteer-extra');
var cors = require('cors')
require('dotenv').config()
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const app = express();


app.use(cors({
  
  origin:"*",
  methods: ["GET", "POST"],
}))

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
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-infobars',
        '--window-size=1920,1080',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled',]
    });
    const page = await browser.newPage();

    // Intercept network requests
    await page.setRequestInterception(true);
    let m3u8Urls = [];

    
    page.on('request', async(req) => {
      const url = req.url();
      const resourceType = req.resourceType();
      console.log(`url requested: ${url}`);
     
      if (url.endsWith('.m3u8')) {
        
        
        m3u8Urls.push(url);
     
      
      }else if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();  // Block unnecessary resources
      } else {
        req.continue();
      }
    });

    // Go to the target URL
    await page.goto(targetURL, { waitUntil: 'networkidle2'});

    // Wait for 30 seconds to ensure all network requests are captured
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Close the browser
    await browser.close();

    // Return the captured m3u8 URLs as a response
    res.json({ m3u8Urls });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error occurred while monitoring the target URL.'
    });
  }
});



app.get('/hdhub4u', async (req, res) => {
  let m3u8Urls = [];
  try {
    // Set the target URL from query params or hardcoded
    const targetURL = req.query.url || 'https://hdstream4u.com/file/tfqcy2shtutk';
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Intercept network requests
    await page.setRequestInterception(true);
   
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
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Close the browser
    await browser.close();

    // Return the captured m3u8 URLs as a response
    res.json({ m3u8Urls });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:"Error in m3u8 link caputureing",
      links:m3u8Urls
    });
  }
});

// Start the Express server
const PORT = process.env.PORT|| 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
