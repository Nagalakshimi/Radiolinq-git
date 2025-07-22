const{ expect } = require('@playwright/test');


exports.choosedate = async function (page) {

    // Click on From Date
    const fromdate_locator = await page.locator('//input[@name="fromDate"]');
    await expect.soft(fromdate_locator).toBeVisible();
    await fromdate_locator.click();

    //Click year selector and choose 2025
    await page.locator('(//div[@class="ant-picker-header-view"])[1]//button[@class="ant-picker-year-btn"]').click();
    await page.locator('//td//div[contains(text(),"2025")]').click();

    // Click month selector and choose Jul
    await page.locator('(//div[@class="ant-picker-header-view"])[1]//button[@class="ant-picker-month-btn"]').click();
    await page.locator('//td//div[contains(text(),"Jul")]').click();

    // Ensure correct month and year are selected
    await expect.soft(page.locator('(//div[@class="ant-picker-header-view"])[1]//button[contains(text(), "Jul")]')).toBeVisible();
    await expect.soft(page.locator('(//div[@class="ant-picker-header-view"])[1]//button[contains(text(), "2025")]')).toBeVisible();

    // Select 07 Jul 2025
    await page.locator('(//div[@class="ant-picker-body"])[1]//td[@title="2025-07-07"]').click();
    await page.waitForTimeout(500);

    console.log("From Date selected: 07-Jul-2025");

    // Click on To Date
    const todate_locator = await page.locator('//input[@name="toDate"]');
    await expect.soft(todate_locator).toBeVisible();
    await todate_locator.click();
    await page.waitForTimeout(500);

    //Click year selector and choose 2025
    await page.locator('(//div[@class="ant-picker-header-view"])[2]//button[@class="ant-picker-year-btn"]').click();
    await page.locator('//td//div[contains(text(),"2025")]').click();

    // Choose July
    await page.locator('(//div[@class="ant-picker-header-view"])[2]//button[@class="ant-picker-month-btn"]').click();
    await page.locator('//td//div[contains(text(),"Jul")]').click();

    // Ensure correct month and year are selected
    await expect.soft(page.locator('(//div[@class="ant-picker-header-view"])[2]//button[contains(text(), "Jul")]')).toBeVisible();
    await expect.soft(page.locator('(//div[@class="ant-picker-header-view"])[2]//button[contains(text(), "2025")]')).toBeVisible();

    // Select 09 Jul 2025
    await page.locator('(//div[@class="ant-picker-body"])[2]//td[@title="2025-07-09"]').click();
    await page.waitForTimeout(1000);

    console.log("To Date selected: 09-Jul-2025");
}