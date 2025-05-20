const { chromium } = require('playwright');


(async ()=> {
const browser = await chromium.launch({headless:false}); //if it is true test run without UI
const context = await browser.newContext();  //opening a new window and maximize it
 const page = await context.newPage();
// Login into the URL
await page.goto('https://staging.radiolinq.com/');
await page.waitForTimeout(1000);
await page.locator('//input[@placeholder ="Enter email"]').fill('doctor1@gmail.com');
await page.waitForTimeout(1000);
await page.locator('//input[@placeholder ="Enter password"]').fill('password');
await page.waitForTimeout(1000);
await page.click('//button[@type ="submit"]');


//await browser.close();
})();