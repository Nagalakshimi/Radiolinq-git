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
await page.waitForTimeout(2000);

  //Clear and search another term
  await searchbar.press('Control+A');
  await searchbar.press('Backspace');
  await searchbar.fill('CT');

 //Scroll down & up
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollBy(0, -500));
  await page.waitForTimeout(2000);

  //Click first template edit
  await page.locator('(//button[@class="ant-btn ant-btn-primary ant-btn-icon-only"])[1]').click();
  await page.keyboard.press('PageDown');
  await page.waitForTimeout(2000);

  //Edit template name
  const nameInput = page.locator('//input[@name="name"]');
  await page.waitForTimeout(2000);
  await nameInput.press('Control+A');
  await nameInput.press('Backspace');
  await page.waitForTimeout(2000);
  await nameInput.fill('Playwright testing template');
  await page.waitForTimeout(2000);

  //Fill the text editor
  const editor = page.locator('//div[@role="textbox"]');
  await editor.click();
   await page.waitForTimeout(2000);
  await editor.press('Control+A');
  await editor.press('Backspace');
  await page.waitForTimeout(2000);
  await editor.fill('RadiolinQ Testing Doctor Dashboard');
  await page.waitForTimeout(2000);

  //Click Save
  await page.locator('(//button[@class="ant-btn ant-btn-primary"])[3]').click({force: true});
  await page.waitForTimeout(2000);

  //Click the second template and just close it
    await page.locator('(//button[@class="ant-btn ant-btn-primary ant-btn-icon-only"])[2]').click({force: true});
    await page.waitForTimeout(2000);
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

     //Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(2000);
/*
    //Choose the pageNo/page
    const pagination_dropdown = page.locator('//div[@class="ant-select ant-pagination-options-size-changer ant-select-single ant-select-show-arrow"]');
    await expect(pagination_dropdown).toBeVisible({ timeout: 5000 });
    // Click it
    await pagination_dropdown.click({ force: true });
    //await expect(pagination_dropdown).toBeVisible();
    //await pagination_dropdown.click();
    await page.waitForTimeout(2000);
    //await page.locator('(//div[@class="ant-select-item-option-content"])[2]').click({force: true}); // choose "20 / page"
    //await page.waitForTimeout(2000);
*/
/*
// Open modal (clicking second template edit icon)
await page.locator('(//button[@class="ant-btn ant-btn-primary ant-btn-icon-only"])[2]').click();
await page.waitForTimeout(2000);

// Scroll inside modal
await page.keyboard.press('PageDown');
await page.waitForTimeout(1000);

// Close modal
await page.locator('.ant-modal-close').click();
*/
// Click Add Template button
await page.locator('//button[contains(@class, "float-right")]').click();
await page.waitForTimeout(2000);

// Scroll modal if needed
await page.keyboard.press('PageDown');
await page.waitForTimeout(2000);

// Fill template name
await page.locator('input[placeholder="Enter name"]').fill('Automation testing');
await page.waitForTimeout(2000);

// Paragraph input
await page.locator('(//p)[2]').fill('Testing');
await page.keyboard.press('Enter');
await page.waitForTimeout(2000);

// Dropdown: select "MR"
//await page.locator('(//span[@class="ant-select-selection-search"])[2]').click();
await page.locator('(//input[@class="ant-select-selection-search-input"])[2]').click({force: true});
await page.waitForTimeout(2000);
//await page.locator('(//input[@class="ant-select-selection-search-input"])[2]').fill('MR');
await page.locator('(//input[@class="ant-select-selection-search-input"])[2]').fill('MR');
await page.waitForTimeout(2000);
await page.keyboard.press('Enter');

// Locate the hidden file input or click to open upload
await page.locator('(//button[contains(@class, "ck-dropdown__button")])[6]').click();
await page.waitForTimeout(2000);

// Click upload button inside
await page.locator('(//button[contains(@class, "ck-button")])[22]').click();

// Handle file chooser (if input is hidden and triggered by button)
const [fileChooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.click('(//button[contains(@class, "ck-button")])[22]')
]);

await fileChooser.setFiles('C:/Users/admin/Downloads/radiolinq-screenshot (6).jpeg');






});