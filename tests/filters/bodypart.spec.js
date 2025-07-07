import{test, expect} from '@playwright/test';
import { url, invaildlogin, vaildlogin, logout, checking_ifsuccessfully_loginintothedashbaord } from '../admin_login.helper';

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

test('Checking study(bodypart) option is visible inside the table', async()=>{
    //Verify to have study option inside the table
    const bodypart = await page.locator('//thead[@class="ant-table-thead"]//th[4]//div[contains(text(),"Study")]');
    await expect(bodypart).toBeVisible();
});

test('Checking all the filter options and giving inputs in bodypart filter', async()=>{
    //Check all the filter options is visible
    const filter_option = await page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');
    await expect(filter_option).toHaveCount(10);
    for(let i=0;i<10;i++)
    {
        await expect(filter_option.nth(i)).toBeVisible();
    }

    //Click the 4th filter - bodypart and check the dropdown is visible
    const Bodypartfilter = await (filter_option.nth(3));
    await Bodypartfilter.click();

    //Check if the dropdown is visible
    const bodypart_dropdown = await page.locator('//div[contains(@class, "ant-select-dropdown") and not(contains(@class, "ant-select-dropdown-hidden"))]');
    await expect(bodypart_dropdown).toBeVisible();
    
    //Get all the Body Part text content
    const bodypart_dropdown_text = await page.locator('//div[@class="rc-virtual-list-holder-inner"]//div[@class="ant-select-item ant-select-item-option"]//div[@class="ant-select-item-option-content"]');
    const get_bodypart_text = await bodypart_dropdown_text.allTextContents();
    const bodypart_dropdown_text_count = await get_bodypart_text.length;
    console.log("Total no.of dropdowns present in scantype = "+bodypart_dropdown_text_count);
    console.log("");
    console.log("Dropdown options = "+get_bodypart_text);
    console.log("");

    //Click "Brain" in dropdown
    await page.locator('//div[contains(text(),"Brain")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
        const row_count_Brain = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count_Brain = await row_count_Brain.count();
        console.log("Selecting Brain in the bodypart filter and the row count = "+total_row_count_Brain);
        console.log(" ");
    
        let matchedstudycount_Brain = 0;

    //Handle empty case 
        if (total_row_count_Brain === 0) 
        {
        console.warn("No rows found for 'Brain' filter — table is empty.");
        console.log("------------------------------------------------------------------");
        console.log(" ");
        } 
        else    
        {
    //Locate the 4th column(study) in each row
        for(let i=0; i<total_row_count_Brain; i++)
           {
             const Study_column_Brain = row_count_Brain.nth(i).locator('td').nth(3);
             await expect(Study_column_Brain).toBeVisible();
             //get the text
             const bodypart_name_Brain = await Study_column_Brain.textContent();
             
                  if (!bodypart_name_Brain || bodypart_name_Brain.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (bodypart_name_Brain.toLowerCase().includes('brain')) 
                    {
                        matchedstudycount_Brain++;
                        console.log("Row "+(i + 1) + " having 'bodypart_name': "+bodypart_name_Brain.trim());
                        console.log("");
                    }
           }
        }

        if(matchedstudycount_Brain!=total_row_count_Brain)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_Brain +" row count but only "+matchedstudycount_Brain +" is matching with 'Brain' Bodypart. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_Brain+" and the Bodypart inclued 'Brain' count is "+matchedstudycount_Brain)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }


    //Click "MRV" in dropdown
    await page.locator('(//span[@class="ant-select-selection-item"])[1]').click(); //clicking the dropdown

    
    //Scrolling down into the dropdown
     const dropdown_scroll_container= await page.locator('(//div[@class="rc-virtual-list"])[1]');
     await dropdown_scroll_container.evaluate(node => 
    {
     node.scrollTop = node.scrollHeight;
    });

    await page.locator('//div[contains(text(),"MRV")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
    const row_count_MRV = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
    const total_row_count_MRV = await row_count_MRV.count();
    console.log("Selecting MRV in the bodypart filter and the row count = "+total_row_count_MRV);
    console.log(" ");
    
        let matchedstudycount_MRV = 0;

    // Handle empty case 
        if (total_row_count_MRV === 0) 
        {
            console.warn("No rows found for 'MRV' filter — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
        }
        else 
        {
    //Locate the 4th column(study) in each row
        for(let i=0; i<total_row_count_MRV; i++)
           {
             const Study_column_MRV = row_count_MRV.nth(i).locator('td').nth(3);
             await expect(Study_column_MRV).toBeVisible();
             //get the text
             const bodypart_name_MRV = await Study_column_MRV.textContent();
             
                  if (!bodypart_name_MRV || bodypart_name_MRV.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (bodypart_name_MRV.toLowerCase().includes('mrv')) 
                    {
                        matchedstudycount_MRV++;
                        console.log("Row "+(i + 1) + " having 'bodypart_name': "+bodypart_name_MRV.trim());
                        console.log("");
                    }
           }
        }

        if(matchedstudycount_MRV!=total_row_count_MRV)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_MRV +" row count but only "+matchedstudycount_MRV +" is matching with 'MRV' Bodypart. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_MRV+" and the Bodypart inclued 'MRV' count is "+matchedstudycount_MRV)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }

    //Click "not_set" in dropdown
    await page.locator('(//span[@class="ant-select-selection-item"])[1]').click(); //clicking the dropdown

    await page.locator('//div[contains(text(),"not_set")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
        const row_count_notset = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count_notset = await row_count_notset.count();
        console.log("Selecting 'not_set' in the bodypart filter and the row count = "+total_row_count_notset);
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
             const bodypart_name_notset = await Study_column_notset.textContent();
             
                  if (!bodypart_name_notset || bodypart_name_notset.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (bodypart_name_notset.toLowerCase().includes('not_set')) 
                    {
                        matchedstudycount_notset++;
                        console.log("Row "+(i + 1) + " having 'bodypart_name': "+bodypart_name_notset.trim());
                        console.log("");
                    }
           }
}

        if(matchedstudycount_notset!=total_row_count_notset)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_notset +" row count but only "+matchedstudycount_notset +" is matching with 'not_set' Bodypart. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_notset+" and the Bodypart inclued 'not_set' count is "+matchedstudycount_notset)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
            
});