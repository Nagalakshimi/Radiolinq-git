import{test, expect} from '@playwright/test';
import { url, invaildlogin, vaildlogin, logout, checking_ifsuccessfully_loginintothedashbaord } from '../admin_login.helper';
import { tagsMark } from '../case_listing/tags_mark.spec';

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

test('Right click on the cases and choose the tags', async()=>{
    //Calling the tags_mark function to tagged the cases if it is untagged
    await tagsMark(page);
});

test('Checking Tags option is visible inside the table', async()=>{
    //Verify to have Tags option inside the table
    const Tags = await page.locator('//thead[@class="ant-table-thead"]//th[1]//div[contains(text(),"Tags")]');
    await expect(Tags).toBeVisible();
});

test('Checking all the filter options and giving inputs in Tag filter', async()=>{
    //Check all the filter options is visible
    const filter_option = await page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');
    await expect(filter_option).toHaveCount(10);
    for(let i=0;i<10;i++)
    {
        await expect(filter_option.nth(i)).toBeVisible();
    }

    //Click the 8th filter - Tag and check the dropdown is visible
    const Tagfilter = await (filter_option.nth(7));
    await Tagfilter.click();
    
    //Check if the dropdown is visible
    const tag_dropdown = await page.locator('.rc-virtual-list-holder-inner');
    await expect(tag_dropdown).toBeVisible();
    console.log("Tag dropdown is visible");
    console.log("");
    
    //Get all the Tags text content
    const tag_dropdown_text = await page.locator('//div[@class="rc-virtual-list-holder-inner"]//div[@aria-selected]//div[@class="ant-select-item-option-content"]');
    const get_tag_text = await tag_dropdown_text.allTextContents();
    const tag_dropdown_text_count = await get_tag_text.length;
    console.log("Total no.of dropdowns present in Tag filter = "+tag_dropdown_text_count);
    console.log("");
    console.log("Dropdown options = "+get_tag_text+", ");
    console.log("");

    //Click "Urgent" in dropdown
    await page.locator('//div[contains(text(),"Urgent")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
        const row_count_urgent = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count_urgent = await row_count_urgent.count();
        console.log("Selecting 'Urgent' in the tag filter and the row count = "+total_row_count_urgent);
        console.log(" ");
    
        let matchedtagcount_urgent = 0;

    //Handle empty case 
        if (total_row_count_urgent === 0) 
        {
        console.warn("No rows found for 'Urgent' filter — table is empty.");
        console.log("------------------------------------------------------------------");
        console.log(" ");
        } 
        else    
        {
    //Locate the 1st column(Tags) in each row
        for (let i = 0; i < total_row_count_urgent; i++) {
        const currentRow_urgent = row_count_urgent.nth(i);
        const tagCell_urgent = currentRow_urgent.locator('td').nth(0);
        const tagBox_urgent = tagCell_urgent.locator('.admin-cases__tags .admin-cases__tag-item');

        const isVisible = await tagBox_urgent.isVisible();
        if (!isVisible) continue;

        let bgColor_urgent = await tagBox_urgent.evaluate(el =>
        window.getComputedStyle(el).getPropertyValue('background-color')
    );
        bgColor_urgent = bgColor_urgent.replace(/\s+/g, '').toLowerCase();

    // Match only rows with 'Urgent' background color
        if (bgColor_urgent === 'rgb(255,0,0)') {
        matchedtagcount_urgent++;
        console.log("Row "+(i + 1)+" has 'Urgent' tag — background: "+bgColor_urgent);
        } 
    else {
      console.warn("Row "+(i + 1)+" has WRONG tag color: "+bgColor_urgent);
        }
    }
        }

    if (matchedtagcount_urgent !== total_row_count_urgent) {
    console.warn("ERROR-Mismatched: Found "+total_row_count_urgent+" row(s) but only "+matchedtagcount_urgent+" has correct 'Urgent' tag background");
    console.log("------------------------------------------------------------------");
    console.log(" ");
    } 
    else {
    console.log("Filter Result: All "+total_row_count_urgent+" rows are correctly tagged as 'Urgent'");
    console.log("------------------------------------------------------------------");
    console.log(" ");
    }

    //Click "Critical" in dropdown
    await Tagfilter.click();
    await page.locator('//div[contains(text(),"Critical")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
        const row_count_critical = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count_critical = await row_count_critical.count();
        console.log("Selecting 'Critical' in the tag filter and the row count = "+total_row_count_critical);
        console.log(" ");
    
        let matchedtagcount_critical = 0;

    //Handle empty case 
        if (total_row_count_critical === 0) 
        {
        console.warn("No rows found for 'Critical' filter — table is empty.");
        console.log("------------------------------------------------------------------");
        console.log(" ");
        } 
        else    
        {
    //Locate the 1st column(Tags) in each row
        for (let i = 0; i < total_row_count_critical; i++) {
        const currentRow_critical = row_count_critical.nth(i);
        const tagCell_critical = currentRow_critical.locator('td').nth(0);
        const tagBox_critical = tagCell_critical.locator('.admin-cases__tags .admin-cases__tag-item');

        const isVisible = await tagBox_critical.isVisible();
        if (!isVisible) continue;

        let bgColor_critical = await tagBox_critical.evaluate(el =>
        window.getComputedStyle(el).getPropertyValue('background-color')
    );
        bgColor_critical = bgColor_critical.replace(/\s+/g, '').toLowerCase();

    // Match only rows with 'Critical' background color
        if (bgColor_critical === 'rgb(255,69,0)') {
        matchedtagcount_critical++;
        console.log("Row "+(i + 1)+" has 'Critical' tag — background: "+bgColor_critical);
        } 
    else {
      console.warn("Row "+(i + 1)+" has WRONG tag color: "+bgColor_critical);
        }
    }
        }

    if (matchedtagcount_critical !== total_row_count_critical) {
    console.warn("ERROR-Mismatched: Found "+total_row_count_critical+" row(s) but only "+matchedtagcount_critical+" has correct 'Critical' tag background.");
    console.log("------------------------------------------------------------------");
    console.log(" ");
    } 
    else {
    console.log("Filter Result: All "+total_row_count_critical+" rows are correctly tagged as 'Critical'.");
    console.log("------------------------------------------------------------------");
    console.log(" ");
    }

    //Click "Interesting" in dropdown
    await Tagfilter.click();
    await page.locator('//div[contains(text(),"Interesting")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
        const row_count_interesting = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count_interesting = await row_count_interesting.count();
        console.log("Selecting 'Interesting' in the tag filter and the row count = "+total_row_count_interesting);
        console.log(" ");
    
        let matchedtagcount_interesting = 0;

    //Handle empty case 
        if (total_row_count_interesting === 0) 
        {
        console.warn("No rows found for 'Interesting' filter — table is empty.");
        console.log("------------------------------------------------------------------");
        console.log(" ");
        } 
        else    
        {
    //Locate the 1st column(Tags) in each row
        for (let i = 0; i < total_row_count_interesting; i++) {
        const currentRow_interesting = row_count_interesting.nth(i);
        const tagCell_interesting = currentRow_interesting.locator('td').nth(0);
        const tagBox_interesting = tagCell_interesting.locator('.admin-cases__tags .admin-cases__tag-item');

        const isVisible = await tagBox_interesting.isVisible();
        if (!isVisible) continue;

        let bgColor_interesting = await tagBox_interesting.evaluate(el =>
        window.getComputedStyle(el).getPropertyValue('background-color')
    );
        bgColor_interesting = bgColor_interesting.replace(/\s+/g, '').toLowerCase();

    // Match only rows with 'Interesting' background color
        if (bgColor_interesting === 'rgb(30,144,255)') {
        matchedtagcount_interesting++;
        console.log("Row "+(i + 1)+" has 'Interesting' tag — background: "+bgColor_interesting);
        } 
    else {
      console.warn("Row "+(i + 1)+" has WRONG tag color: "+bgColor_interesting);
        }
    }
        }

    if (matchedtagcount_interesting !== total_row_count_interesting) {
    console.warn("ERROR-Mismatched: Found "+total_row_count_interesting+" row(s) but only "+matchedtagcount_interesting+" has correct 'Interesting' tag background.");
    console.log("------------------------------------------------------------------");
    console.log(" ");
    } 
    else {
    console.log("Filter Result: All "+total_row_count_interesting+" rows are correctly tagged as 'Interesting'.");
    console.log("------------------------------------------------------------------");
    console.log(" ");
    }

    //Click "Case Opened" in dropdown
    await Tagfilter.click();
    await page.locator('//div[contains(text(),"Case Opened")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
        const row_count_caseopened = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count_caseopened = await row_count_caseopened.count();
        console.log("Selecting 'Case Opened' in the tag filter and the row count = "+total_row_count_caseopened);
        console.log(" ");
    
        let matchedtagcount_caseopened = 0;

    //Handle empty case 
        if (total_row_count_caseopened === 0) 
        {
        console.warn("No rows found for 'Case Opened' filter — table is empty.");
        console.log("------------------------------------------------------------------");
        console.log(" ");
        } 
        else    
        {
    //Locate the 1st column(Tags) in each row
        for (let i = 0; i < total_row_count_caseopened; i++) {
        const currentRow_caseopened = row_count_caseopened.nth(i);
        const tagCell_caseopened = currentRow_caseopened.locator('td').nth(0);
        const tagBox_caseopened = tagCell_caseopened.locator('.admin-cases__tags .admin-cases__tag-item');

        const isVisible = await tagBox_caseopened.isVisible();
        if (!isVisible) continue;

        let bgColor_caseopened = await tagBox_caseopened.evaluate(el =>
        window.getComputedStyle(el).getPropertyValue('background-color')
    );
        bgColor_caseopened = bgColor_caseopened.replace(/\s+/g, '').toLowerCase();

    // Match only rows with 'Case Opened' background color
        if (bgColor_caseopened === 'rgb(50,205,50)') {
        matchedtagcount_caseopened++;
        console.log("Row "+(i + 1)+" has 'Case Opened' tag — background: "+bgColor_caseopened);
        } 
    else {
      console.warn("Row "+(i + 1)+" has WRONG tag color: "+bgColor_caseopened);
        }
    }
        }

    if (matchedtagcount_caseopened !== total_row_count_caseopened) {
    console.warn("ERROR-Mismatched: Found "+total_row_count_caseopened+" row(s) but only "+matchedtagcount_caseopened+" has correct 'Case Opened' tag background.");
    console.log("------------------------------------------------------------------");
    console.log(" ");
    } 
    else {
    console.log("Filter Result: All "+total_row_count_caseopened+" rows are correctly tagged as 'Case Opened'.");
    console.log("------------------------------------------------------------------");
    console.log(" ");
    }

        });