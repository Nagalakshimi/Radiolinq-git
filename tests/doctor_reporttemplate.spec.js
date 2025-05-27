const { test, expect } = require('playwright/test');
const { chromium } = require('@playwright/test');

test('Login Test', async ({ page }) => {

//Login into the URL
await page.goto('https://staging.radiolinq.com/');
await page.waitForTimeout(1000);


//Enter with valid credentials
await page.locator('//input[@placeholder ="Enter email"]').fill('doctor1@gmail.com');
await page.waitForTimeout(1000);
await page.locator('//input[@placeholder ="Enter password"]').fill('password');
await page.waitForTimeout(1000);
await page.click('//button[@type ="submit"]');
await page.waitForTimeout(3000);

//Clicking on Hard refresh button
await page.click('(//button[@class="ant-btn ant-btn-primary"])[1]');
await page.waitForTimeout(2000);

//Clicking on Report_Templates button
await page.locator('//span[@class="anticon anticon-diff ant-menu-item-icon"]').click();
await page.waitForTimeout(2000);


//Clicking the search textbox
const searchbar = await page.locator('//input[@placeholder="Search by Template name"]');
await searchbar.click();
await page.waitForTimeout(2000);
await searchbar.fill('MRI');

});