const { test, expect } = require('playwright/test');
const { chromium } = require('@playwright/test');

//const { chromium } = require('playwright');

test('Login in to the application and check the title', async ({ page }) => {

//Login into the URL
await page.goto('https://staging.radiolinq.com/');
await expect(page).toHaveTitle("RadiolinQ - Imaging Anytime Anywhere");

//Clicking on Submit button without inputs and check the error message is shown
await page.click('//button[@type ="submit"]');
//Assert error messages should appear
await expect(page.getByText('E-mail is required')).toBeVisible();
await expect(page.getByText('Password is required')).toBeVisible();

//Login using invalid email id and check it show an error message
await page.locator('//input[@name="email"]').fill('doctor123@gmail.com');
await page.locator('//input[@name="password"]').fill('Doc@2309');
await page.click('//button[@type ="submit"]');
await expect(page.getByText('Invalid email id')).toBeVisible();

//Login using invalid password and check it show an error message
await page.locator('//input[@name="email"]').fill('doctor1@gmail.com');
await page.locator('//input[@name="password"]').fill('password123');
await page.click('//button[@type ="submit"]');
await expect(page.locator('.login-form')).toBeVisible();
});

//Login with invalid email and password and check it show as error
test('both invalid email and password', async({page}) => {
  await page.goto('https://staging.radiolinq.com/');
await page.locator('//input[@name="email"]').fill('doctor123@gmail.com');
await page.locator('//input[@name="password"]').fill('password123');
await page.click('//button[@type ="submit"]');
await expect(page.getByText('Invalid email id')).toBeVisible();

// Login with valid credentials
await page.locator('//input[@placeholder ="Enter email"]').fill('doctor1@gmail.com');
await page.locator('//input[@placeholder ="Enter password"]').fill('Doc@2309');
await page.click('//button[@type ="submit"]');
await expect(page.getByText('Cases')).toBeVisible();

});




/*
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
*/
