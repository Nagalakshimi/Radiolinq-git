const { default: test } = require("node:test");

const{ expect } = require('@playwright/test');

exports.url = async function (page) {

        await page.goto('https://staging.radiolinq.com/');

        //Checking the image is visible in login page
            await expect.soft(page.getByAltText('Radiolinq Login')).toBeVisible();
                
        //Checking the radiolinQ img src is visible
            await expect.soft(page.locator('.logo-form__logo-image')).toBeVisible();

            console.log("Successfully launching the application");
            console.log("");
};

        //Login admin page with invaild credentials
exports.invaildlogin = async function (page) {

        //Clicking on Submit button without inputs and check the error message is shown
        await page.click('//button[@type ="submit"]');
        
        //Assert error messages should appear
        await expect(page.getByText('E-mail is required')).toBeVisible();
        await expect(page.getByText('Password is required')).toBeVisible();
        console.log('Unable to Login - E-mail and password is required');
        console.log('');
        
        //Login using invalid email id and check it show an error message
        await page.locator('//input[@name="email"]').fill('nivi123@gmail.com');
        await page.locator('//input[@name="password"]').fill('password');
        await page.click('//button[@type ="submit"]');
        await expect(page.getByText('Invalid email id')).toBeVisible();
        console.log('Unable to Login - Invaild E-mail id');
        console.log('');
        
        //Login using invalid password and check it show an error message
        await page.locator('//input[@name="email"]').fill('nivi2311@gmail.com');
        await page.locator('//input[@name="password"]').fill('password123');
        await page.click('//button[@type ="submit"]');
        await expect(page.locator('.login-form')).toBeVisible();
        console.log('Unable to Login - Invaild Password');
        console.log('');
        await page.waitForTimeout(2000);
        
        //Login with invalid email and password and check it show as error
        await page.locator('//input[@name="email"]').fill('nivi123@gmail.com');
        await page.locator('//input[@name="password"]').fill('password123');
        await page.click('//button[@type ="submit"]');
        await expect(page.getByText('Invalid email id')).toBeVisible();
        console.log('Unable to Login - Invaild E-mail id and Password');
        console.log('');
};

        //Login with vaild credential
exports.vaildlogin = async function(page) {
        await page.locator('//input[@placeholder ="Enter email"]').fill('nivi2311@gmail.com');
        await page.locator('//input[@placeholder ="Enter password"]').fill('password');
        await page.click('//button[@type ="submit"]');   
        console.log("Login successfull");
        console.log("");
};    

exports.checking_ifsuccessfully_loginintothedashbaord = async function(page) {
        //Checking the cases text is visible inside the admin dashboard
        await expect(page.locator('h2.mt-2',{hasText: 'Cases'})).toBeVisible();
        await page.waitForTimeout(2000);
        console.log("Case Listing dashboard is visible");
        console.log("");
    
}

exports.logout = async function (page) {
        await page.locator('span',{hasText: 'Logout'}).click();
        console.log("Logout successfull");
        console.log("");
    
};