const { test, expect } = require('playwright/test');
const { chromium } = require('@playwright/test');

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


//Clicking on Submit button without inputs
await page.click('//button[@type ="submit"]');
await page.waitForTimeout(2000);
//Email id required
 const errormessage = await page.locator('.input__error.email__error');
 await expect(errormessage).toBeVisible();
  const text = await errormessage.textContent();
  console.log("Empty email textbox = "+text);
//Password required
const errormessage1 = page.locator('.input__error.password__error');
await expect(errormessage1).toBeVisible();
const text1 = await errormessage1.textContent();
console.log("Empty password textbox = "+text1);
await page.waitForTimeout(2000);

//Login using invalid email id 
await page.locator('//input[@placeholder ="Enter email"]').fill('doctor123@gmail.com');
await page.waitForTimeout(1000);
await page.locator('//input[@placeholder ="Enter password"]').fill('password');
await page.waitForTimeout(1000);
await page.click('//button[@type ="submit"]');
await page.waitForTimeout(2000);
await expect(page.getByText('Invalid email id')).toBeVisible();
await page.waitForTimeout(2000);
/*
//Wrong email id
const errormessage2 = page.locator('//div[@class="ant-message-custom-content ant-message-error"]');
await page.waitForTimeout(70000);
await expect(errormessage2).toBeVisible();
const text2 = await errormessage2.textContent();
console.log("Entering wrong email_id = "+text2); 
await page.waitForTimeout(2000);
*/
/*
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
*/

// Login with valid credentials
await page.locator('//input[@placeholder ="Enter email"]').fill('doctor1@gmail.com');
await page.waitForTimeout(1000);
await page.locator('//input[@placeholder ="Enter password"]').fill('password');
await page.waitForTimeout(1000);
await page.click('//button[@type ="submit"]');
await page.waitForTimeout(2000);

//Clicking on Hard refresh button
await page.click('(//button[@class="ant-btn ant-btn-primary"])[1]');
await page.waitForTimeout(2000);

//Clicking on Profile section
await page.click('//span[@class="anticon anticon-setting ant-menu-item-icon"]');
await page.waitForTimeout(2000);

//Move the cursor
await page.mouse.move(50,50);

//Editing the profile section
await page.fill('[name = "firstName"]', '');
await page.fill('[name = "firstName"]', 'Doctor');
await page.waitForTimeout(2000);

await page.fill('[name = "lastName"]', '');
await page.fill('[name = "lastName"]', 'Testing');
await page.waitForTimeout(2000);

//Email address is not editable

await page.fill('[name = "mobileNumber"]', '');
await page.fill('[name = "mobileNumber"]', '9897563412');
await page.waitForTimeout(2000);

await page.fill('[placeholder = "Enter Specialisation"]', '');
await page.fill('[placeholder = "Enter Specialisation"]', 'Gynecologist');
await page.waitForTimeout(2000);

await page.fill('[name = "stateOfRegistration"]', '');
await page.fill('[name = "stateOfRegistration"]', 'Karnataka');
await page.waitForTimeout(2000);

//Scroll down the page
await page.evaluate( () =>{
    window.scrollBy(0, 1000);
});
await page.waitForTimeout(2000); 

await page.fill('[placeholder = "Enter Registration number"]', '');
await page.fill('[placeholder = "Enter Registration number"]', 'D465788');
await page.waitForTimeout(2000);

await page.fill('[placeholder = "Enter Address"]', '');
await page.fill('[placeholder = "Enter Address"]', '12/67 Fort street');
await page.waitForTimeout(2000);

//Checking the signature button is on or off
const toggle = await page.locator('//button[@role="switch"]');
 const toggle_check = await toggle.getAttribute('aria-checked');
 console.log("toggle button = " +toggle_check);

 if(toggle_check === 'true')
 {
    console.log("Add signature to report button is on");
 }
 else
 {
    console.log("Add signature to report button is off");
 }
await page.waitForTimeout(2000);

 //To upload the file
     // Step 1: Prepare to catch file chooser AND click the button at the same time
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      // Step 2: click triggers file chooser
      page.click('//button[@class="ant-btn ant-btn-dashed file-upload__input"]') 
]);
     // Step 3: Set the file to upload
    await fileChooser.setFiles('C:\\Users\\nagalakshimi\\Downloads\\signature1.png');
    await page.waitForTimeout(2000);

//Clicking the update button
await page.click('text="Update Profile"');
await page.waitForTimeout(2000);

//Logout
await page.click('(//button[@class="ant-btn ant-btn-primary"])[2]');
await page.waitForTimeout(2000);
await browser.close();
});