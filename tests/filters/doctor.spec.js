import{test, expect} from '@playwright/test';
import { url, invaildlogin, vaildlogin, logout, checking_ifsuccessfully_loginintothedashbaord } from '../login.helper';
import { assigncases } from '../case_listing/assign_case.spec';

let page;
test.beforeAll('Login using URL', async({browser})=>{
    page = await browser.newPage();
    //calling the url function
    await url(page);

    //Calling invaildlogin function
    await invaildlogin(page);

    //Calling valid function
    await vaildlogin(page);

    //Checking the cases text is visible inside the admin dashboard
    await checking_ifsuccessfully_loginintothedashbaord(page);

    //Selecting 50/page
    await page.locator('(//div[@class="ant-select-selector"])[7]').click();
    await page.locator('//div[contains(text(), "50 / page")]').click();

});   

test.afterAll('Logout from the application', async()=>{
    //calling the logout function
    await logout(page);
});

test('Case filter button',async()=>{
    //Case filter option is visible
    const casetext = await page.locator('.case-filter-form__toggle-button');
    await expect(casetext).toBeVisible();
});

    
test('Assign the cases to doctor if unassigned',async()=>{
    //Calling assign case function
    await assigncases(page);
});