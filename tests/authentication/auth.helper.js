const{ expect } = require('@playwright/test');

 // ======================== Navigate to login page ========================
 
exports.navigateToLogin = async function (page) {
    await page.goto('https://staging.radiolinq.com/');
    await expect.soft(page.getByAltText('Radiolinq Login')).toBeVisible();
    await expect.soft(page.locator('.logo-form__logo-image')).toBeVisible();
    console.log("✅ Launched login page \n");
};

 // ======================== Attempt login with provided credentials =======================
 
exports.login = async function (page, email, password) {
    await page.locator('//input[@name="email"]').fill(email);
    await page.locator('//input[@name="password"]').fill(password);
    await page.click('//button[@type ="submit"]');
    console.log("Attempted login with: Email: "+email+", Password: "+password);    
};

  // ========================= Invalid login flows ===========================
 
exports.invalidLoginChecks = async function (page) {
    // No input
    await page.click('//button[@type="submit"]');
    await expect(page.getByText('E-mail is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    console.log("❌ Empty email and password error shown \n");
    await page.waitForTimeout(2000);

    // Invalid email
    await exports.login(page, 'nivi123@gmail.com', 'password');
    await expect(page.getByText('Invalid email id')).toBeVisible();
    console.log("❌ Invalid email \n");
    await page.waitForTimeout(2000);

    // Invalid password
    await exports.login(page, 'nivi2311@gmail.com', 'password123');
    await expect(page.locator('.login-form')).toBeVisible();
    console.log("❌ Invalid password \n");
    await page.waitForTimeout(2000);

    // Both invalid
    await exports.login(page, 'nivi123@gmail.com', 'password123');
    await expect(page.getByText('Invalid email id')).toBeVisible();
    console.log("❌ Invalid email and password \n");
};

 // ======================= Check if dashboard loaded ==================================
 
exports.verifyDashboard = async function (page) {
    await expect(page.locator('h2.mt-2', { hasText: 'Cases' })).toBeVisible();
    console.log("✅ Dashboard loaded \n");
};


 // ================================ Logout from app ===================================
 
exports.logout = async function (page) {
    await page.locator('span', { hasText: 'Logout' }).click();
    console.log("Logout successful");
};
