import { test, expect } from '@playwright/test';
import { navigateToLogin, invalidLoginChecks, login, verifyDashboard, logout } from '../authentication/auth.helper';
import { choosedate } from '../helper/choosedate.helper';
import {all_Filters} from '../filters/all_filters.helper';
import { actionButtons } from '../admin_case_listing/Allaction_buttons.helper';
let page;

//Login to the admin
test.beforeAll('Login flow', async ({ browser }) => {
    page = await browser.newPage();

    //URL
    await navigateToLogin(page);

    //Login with Invalid credentials
    await invalidLoginChecks(page);

    //Login with Valid credentials
    await login(page, 'nivi2311@gmail.com', 'password'); // dynamic credentials 
    await page.waitForTimeout(2000);

    //Verifing the dashboard is visible after login
    await verifyDashboard(page);
});

//Logout from admin
test.afterAll('Logout', async () => {
    await logout(page);
});

//Selecting From date and To date for getting case
test('Choose Date', async ()=>{
    await page.waitForTimeout(1000);
    await choosedate(page);
});

//Checking "Case filter" button is visible
test('Case filter button',async()=>{
    const casetext = await page.locator('.case-filter-form__toggle-button');
    await expect.soft(casetext).toBeVisible();
});

//Checking the "Patient details" table is visible
test('Checking patient detail table is visible', async()=>{ 
    const patient_detail_table = page.locator('.ant-table-container');
    await expect.soft(patient_detail_table).toBeVisible();
});

//Checking all the filters option is vicible 
test('Checking all the filter options and giving inputs in patient_id filter', async()=>{
    //Check all the filter options is visible
    const filter_option = await page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');
    await expect.soft(filter_option).toHaveCount(10);
    for(let i=0;i<10;i++)
    {
        await expect.soft(filter_option.nth(i)).toBeVisible();
    }
});

//Executing All Filter options
test('All Filter', async()=>{
await all_Filters(page);
});

//Executing Action Buttons
test('Action Buttons', async({browser})=>{
    await page.waitForTimeout(2000);
    await actionButtons(page, browser);
});
