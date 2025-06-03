const { test, expect } = require('playwright/test');
const { chromium } = require('@playwright/test');
const { error } = require('console');

test('Login Test', async ({ page }) => {

//Login into the URL
await page.goto('https://staging.radiolinq.com/');

//Enter with valid credentials
await page.locator('//input[@placeholder ="Enter email"]').fill('doctor1@gmail.com');
await page.locator('//input[@placeholder ="Enter password"]').fill('password');
await page.click('//button[@type ="submit"]');
await page.waitForTimeout(2000);

//Clicking on Hard refresh button
await page.click('(//button[@class="ant-btn ant-btn-primary"])[1]');
await page.waitForTimeout(2000);

//Clicking on Report_Templates button
await page.locator('//span[@class="anticon anticon-diff ant-menu-item-icon"]').click();

//Choose the pagination dropdown
    const pagination_dropdown = await page.locator('//span[@class="ant-select-selection-item"]');
    await expect(pagination_dropdown).toBeVisible();
    await pagination_dropdown.click();

    //Choose 20/page
    await page.locator('(//div[@class="ant-select-item-option-content"])[2]').click();
    await page.waitForTimeout(2000);

    //Choose 50/page
    await pagination_dropdown.click();
    await page.locator('(//div[@class="ant-select-item-option-content"])[3]').click();
    await page.waitForTimeout(2000);

    //Click next pagination button
    await page.locator('(//button[@class="ant-pagination-item-link"])[2]').click();
    
    //Click next pagination button
    await page.locator('//li[@class="ant-pagination-item ant-pagination-item-3"]').click();
   
  //Click previous pagination button
    await page.locator('(//button[@class="ant-pagination-item-link"])[1]').click();
    await page.waitForTimeout(2000);


//Clicking the search textbox
const searchbar = await page.locator('//input[@placeholder="Search by Template name"]');
await searchbar.click();
await searchbar.fill('MRI');
await page.waitForTimeout(2000);

  //Clear and search another term
  await searchbar.press('Control+A');
  await searchbar.press('Backspace');
  await searchbar.fill('CT');

 //Scroll down & up
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.evaluate(() => window.scrollBy(0, -500));

  //Click first template edit
  await page.locator('(//button[@class="ant-btn ant-btn-primary ant-btn-icon-only"])[1]').click();
  await page.keyboard.press('PageDown');

  //Edit template name
  const nameInput = await page.locator('//input[@name="name"]');
  await nameInput.press('Control+A');
  await nameInput.press('Backspace');
  await nameInput.fill('Playwright testing template');

  //Fill the text editor(paragraph)
  const editor = await page.locator('//div[@role="textbox"]');
  await editor.click();
  await editor.press('Control+A');
  await editor.press('Backspace');
  await editor.fill('RadiolinQ Testing Doctor Dashboard');
  await page.waitForTimeout(2000);

  //Click Save
  await page.locator('(//button[@class="ant-btn ant-btn-primary"])[3]').click({force: true});
  await page.waitForTimeout(2000);

  //Click the second template and just close it
    await page.locator('(//button[@class="ant-btn ant-btn-primary ant-btn-icon-only"])[2]').click({force: true});
     const close = await page.locator('//span[@class="anticon anticon-close ant-modal-close-icon"]'); 
     await expect(close).toBeVisible();
     await close.click({force: true});//close
    await page.waitForTimeout(2000);

  //Click next pagination button
    await page.locator('(//button[@class="ant-pagination-item-link"])[2]').click({force: true });
    await page.waitForTimeout(2000);

  //Click previous pagination button
    await page.locator('(//button[@class="ant-pagination-item-link"])[1]').click({force: true});
    await page.waitForTimeout(2000);
    
/*
     //...Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(2000);
    */

// Click Add Template button
await page.locator('//button[contains(@class, "float-right")]').click();

//For debugging
//check the scantype_dropdown locators is present or not
 const modal= await page.locator('.ant-modal-content');
 if(await modal.isVisible())
 {
  console.log('Modal content is visible');
 }
 else
 {
  console.log('modal content is not visible');
 }

// Fill template name
await page.locator('input[placeholder="Enter name"]').fill('Playwright Automation testing');
await page.waitForTimeout(2000);

//check the count of scantype_dropdown locators
const find_scantype = await page.locator('(//input[contains(@class, "ant-select-selection-search-input")])');
console.log('Scantype_dropdown Element Found: ',await find_scantype.count());

//Click it
await find_scantype.click();
await page.waitForTimeout(6000);

//Check the dropdown is visible
const dropdownElement = await page.locator('//div[contains(@class, "ant-select-dropdown")]');
await expect(dropdownElement).toBeVisible();

//Choose "MR" in dropdown
  await page.locator('(//div[@class="ant-select-item-option-content"])[3]').click();

  //Fill the textbox(paragraph)
  await page.locator('//div[@role="textbox"]').fill("Playwright automation testing in textbox");
  
  //Clicking on the add button
  await page.locator('(//button[@type="submit"])[2]').click();
  await page.waitForTimeout(2000);
  






/*
//Choose the pagination dropdown
    const pagination_dropdown = await page.locator('//span[@class="ant-select-selection-item"]');
    await expect(pagination_dropdown).toBeVisible();
    await pagination_dropdown.click();

    //Choose 20/page
    await page.locator('(//div[@class="ant-select-item-option-content"])[2]').click();
    await page.waitForTimeout(2000);

    //Choose 50/page
    await pagination_dropdown.click();
    await page.locator('(//div[@class="ant-select-item-option-content"])[3]').click();
    await page.waitForTimeout(2000);

    //Click next pagination button
    await page.locator('(//button[@class="ant-pagination-item-link"])[2]').click();
    
    //Click next pagination button
    await page.locator('//li[@class="ant-pagination-item ant-pagination-item-3"]').click();
   
  //Click previous pagination button
    await page.locator('(//button[@class="ant-pagination-item-link"])[1]').click();
    await page.waitForTimeout(2000);
*/
});