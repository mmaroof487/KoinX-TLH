const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  console.log("Initial HTML class:", await page.evaluate(() => document.documentElement.className));
  
  const button = await page.$('button[aria-label="Toggle theme"]');
  if (button) {
    await button.click();
    await new Promise(r => setTimeout(r, 500)); // wait for state
    console.log("HTML class after 1 click:", await page.evaluate(() => document.documentElement.className));
    await page.screenshot({ path: 'screenshot-1.png' });
    
    await button.click();
    await new Promise(r => setTimeout(r, 500)); // wait for state
    console.log("HTML class after 2 clicks:", await page.evaluate(() => document.documentElement.className));
    await page.screenshot({ path: 'screenshot-2.png' });
  } else {
    console.log("Toggle button not found!");
  }
  
  await browser.close();
})();
