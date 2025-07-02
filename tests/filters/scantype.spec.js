import{test, expect} from '@playwright/test';
import { url, invaildlogin, vaildlogin, logout, checking_ifsuccessfully_loginintothedashbaord } from '../login.helper';

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


test('Checking patient detail table is visible', async()=>{
    //Check the Patient details table is visible
    const patient_detail_table = page.locator('.ant-table-container');
    await expect(patient_detail_table).toBeVisible();
});

test('Checking study(scantype) option is visible inside the table', async()=>{
    //Verify to have study option inside the table
    const scantype = await page.locator('//thead[@class="ant-table-thead"]//th[4]//div[contains(text(),"Study")]');
    await expect(scantype).toBeVisible();
});

test('Checking all the filter options and giving inputs in scantype filter', async()=>{
    //Check all the filter options is visible
    const filter_option = await page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');
    await expect(filter_option).toHaveCount(10);
    for(let i=0;i<10;i++)
    {
        await expect(filter_option.nth(i)).toBeVisible();
    }

    //Click the 3rd filter - Scantype and check the dropdown is visible
    const Scantypefilter = await (filter_option.nth(2));
    await Scantypefilter.click();

    //Check if the dropdown is visible
    const scantype_dropdown = await page.locator('.rc-virtual-list-holder-inner');
    await expect(scantype_dropdown).toBeVisible();
    
    //Get all the Scan types text content
    const scantype_dropdown_text = await page.locator('//div[@class="rc-virtual-list-holder-inner"]//div[@class="ant-select-item ant-select-item-option"]//div[@class="ant-select-item-option-content"]');
    const get_scantype_text = await scantype_dropdown_text.allTextContents();
    const scantype_dropdown_text_count = await get_scantype_text.length;
    console.log("Total no.of dropdowns present in scantype = "+scantype_dropdown_text_count);
    console.log("");
    console.log("Dropdown options = "+get_scantype_text);
    console.log("");

    //Click "CT" in dropdown
    await page.locator('//div[contains(text(),"CT")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
        const row_count_CT = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count_CT = await row_count_CT.count();
        console.log("Selecting CT in the scantype filter and the row count = "+total_row_count_CT);
        console.log(" ");
    
        let matchedstudycount_CT = 0;

    //Handle empty case 
        if (total_row_count_CT === 0) 
        {
        console.warn("No rows found for 'CT' filter — table is empty.");
        console.log("------------------------------------------------------------------");
        console.log(" ");
        } 
        else    
        {
    //Locate the 4th column(study) in each row
        for(let i=0; i<total_row_count_CT; i++)
           {
             const Study_column_CT = row_count_CT.nth(i).locator('td').nth(3);
             await expect(Study_column_CT).toBeVisible();
             //get the text
             const scantype_name_CT = await Study_column_CT.textContent();
             
                  if (!scantype_name_CT || scantype_name_CT.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (scantype_name_CT.toLowerCase().includes('ct')) 
                    {
                        matchedstudycount_CT++;
                        console.log("Row "+(i + 1) + " having 'scantype_name': "+scantype_name_CT.trim());
                        console.log("");
                    }
           }
        }

        if(matchedstudycount_CT!=total_row_count_CT)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_CT +" row count but only "+matchedstudycount_CT +" is matching with 'CT' Scantype. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_CT+" and the Scantype inclued 'CT' count is "+matchedstudycount_CT)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }


    //Click "MR" in dropdown
    await page.locator('(//span[@class="ant-select-selection-item"])[1]').click(); //clicking the dropdown
    await page.locator('//div[contains(text(),"MR")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
    const row_count_MR = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
    const total_row_count_MR = await row_count_MR.count();
    console.log("Selecting MR in the scantype filter and the row count = "+total_row_count_MR);
    console.log(" ");
    
        let matchedstudycount_MR = 0;

    // Handle empty case 
        if (total_row_count_MR === 0) 
        {
            console.warn("No rows found for 'MR' filter — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
        }
        else 
        {
    //Locate the 4th column(study) in each row
        for(let i=0; i<total_row_count_MR; i++)
           {
             const Study_column_MR = row_count_MR.nth(i).locator('td').nth(3);
             await expect(Study_column_MR).toBeVisible();
             //get the text
             const scantype_name_MR = await Study_column_MR.textContent();
             
                  if (!scantype_name_MR || scantype_name_MR.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (scantype_name_MR.toLowerCase().includes('mr')) 
                    {
                        matchedstudycount_MR++;
                        console.log("Row "+(i + 1) + " having 'scantype_name': "+scantype_name_MR.trim());
                        console.log("");
                    }
           }
        }

        if(matchedstudycount_MR!=total_row_count_MR)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_MR +" row count but only "+matchedstudycount_MR +" is matching with 'MR' Scantype. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_MR+" and the Scantype inclued 'MR' count is "+matchedstudycount_MR)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }

    //Click "not_set" in dropdown
    await page.locator('(//span[@class="ant-select-selection-item"])[1]').click(); //clicking the dropdown

    //Scrolling down into the dropdown
     const dropdown_scroll_container= await page.locator('(//div[@class="rc-virtual-list"])[1]');
     await dropdown_scroll_container.evaluate(node => {
     node.scrollTop = node.scrollHeight;
    });

    await page.locator('//div[contains(text(),"not_set")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
        const row_count_notset = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count_notset = await row_count_notset.count();
        console.log("Selecting 'not_set' in the scantype filter and the row count = "+total_row_count_notset);
        console.log(" ");
    
        let matchedstudycount_notset = 0;
    //Handle empty case 
        if (total_row_count_notset === 0) 
        {
            console.warn("No rows found for 'not_set' filter — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
        } 
        else 
            {

    //Locate the 4th column(study) in each row
        for(let i=0; i<total_row_count_notset; i++)
           {
             const Study_column_notset = row_count_notset.nth(i).locator('td').nth(3);
             await expect(Study_column_notset).toBeVisible();
             //get the text
             const scantype_name_notset = await Study_column_notset.textContent();
             
                  if (!scantype_name_notset || scantype_name_notset.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (scantype_name_notset.toLowerCase().includes('not_set')) 
                    {
                        matchedstudycount_notset++;
                        console.log("Row "+(i + 1) + " having 'scantype_name': "+scantype_name_notset.trim());
                        console.log("");
                    }
           }
}

        if(matchedstudycount_notset!=total_row_count_notset)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_notset +" row count but only "+matchedstudycount_notset +" is matching with 'not_set' Scantype. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_notset+" and the Scantype inclued 'not_set' count is "+matchedstudycount_notset)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
});