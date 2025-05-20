const { test, expect } = require('playwright/test');

//const { chromium } = require('playwright');

/*
(async()=>{
const browser = await chromium.launch({headless:false}); //if it is true test run without UI
const context = await browser.newContext();  //opening a new window and maximize it
const page = await context.newPage();
await page.goto('https://staging.radiolinq.com/');
});
*/

test('Login Test', async ({ page }) => {

//Login into the URL
await page.goto('https://staging.radiolinq.com/');
await page.waitForTimeout(1000);

//Login using wrong email id 
await page.locator('//input[@placeholder ="Enter email"]').fill('doctor123@gmail.com');
await page.waitForTimeout(1000);
await page.locator('//input[@placeholder ="Enter password"]').fill('password');
await page.waitForTimeout(1000);
await page.click('//button[@type ="submit"]');
await expect(page.getByText('Invalid email id')).toBeVisible();
await page.waitForTimeout(2000);

//Login using invalid password
await page.locator('//input[@placeholder ="Enter email"]').fill('doctor1@gmail.com');
await page.waitForTimeout(1000);
await page.locator('//input[@placeholder ="Enter password"]').fill('password123');
await page.waitForTimeout(2000);
await page.click('//button[@type ="submit"]');
//await expect(page.getByText('Login failed')).toBeVisible();
await page.waitForTimeout(2000);

//Login with invalid email and password
await page.locator('//input[@placeholder ="Enter email"]').fill('doctor123@gmail.com');
await page.waitForTimeout(1000);
await page.locator('//input[@placeholder ="Enter password"]').fill('password123');
await page.waitForTimeout(2000);
await page.click('//button[@type ="submit"]');
await expect(page.getByText('Invalid email id')).toBeVisible();
await page.waitForTimeout(2000);

// Login with valid credentials
await page.locator('//input[@placeholder ="Enter email"]').fill('doctor1@gmail.com');
await page.waitForTimeout(1000);
await page.locator('//input[@placeholder ="Enter password"]').fill('password');
await page.waitForTimeout(1000);
await page.click('//button[@type ="submit"]');
await page.waitForTimeout(4000);

//Logout
await page.click('(//button[@class="ant-btn ant-btn-primary"])[2]').click;
await page.waitForTimeout(2000);



//await browser.close();
});