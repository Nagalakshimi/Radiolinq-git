import{test, expect} from '@playwright/test';
import { url, invaildlogin, vaildlogin, logout, checking_ifsuccessfully_loginintothedashbaord } from '../admin_login.helper';
import { choosedate } from '../choosedate.spec';

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

    //Selecting From date and To date for getting case
    await choosedate(page);

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

test('Checking scancenter option is visible inside the table', async()=>{
    //Verify to have scancenter option inside the table
    const scancenter = await page.locator('//thead[@class="ant-table-thead"]//th[5]//div[contains(text(),"Scan Center")]');
    await expect(scancenter).toBeVisible();
});

test('Checking all the filter options and giving inputs in scancenter filter', async()=>{
    //Check all the filter options is visible
    const filter_option = await page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');
    await expect(filter_option).toHaveCount(10);
    for(let i=0;i<10;i++)
    {
        await expect(filter_option.nth(i)).toBeVisible();
    }

    //Click the 5th filter - Scancenter and check the dropdown is visible
    const Scancenterfilter = await (filter_option.nth(4));
    await Scancenterfilter.click();
    
    //Check if the dropdown is visible
    const scancenter_dropdown = await page.locator('.rc-virtual-list-holder-inner');
    await expect(scancenter_dropdown).toBeVisible();
    console.log("Scancenter dropdown is visible");
    console.log("");
    
    //Get all the Scan Center text content
    const scancenter_dropdown_text = await page.locator('//div[@class="rc-virtual-list-holder-inner"]//div[@class="ant-select-item ant-select-item-option"]//div[@class="ant-select-item-option-content"]');
    const get_scancenter_text = await scancenter_dropdown_text.allTextContents();
    const scancenter_dropdown_text_count = await get_scancenter_text.length;
    console.log("Total no.of dropdowns present in scantype = "+scancenter_dropdown_text_count);
    console.log("");
    console.log("Dropdown options = "+get_scancenter_text);
    console.log("");

    //Click "scancenter123" in dropdown
    await page.locator('//div[contains(text(),"scancenter123")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
        const row_count_scancenter123 = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count_scancenter123 = await row_count_scancenter123.count();
        console.log("Selecting Scancenter123 in the scancenter filter and the row count = "+total_row_count_scancenter123);
        console.log(" ");
    
        let matchedscancentercount_scancenter123 = 0;

    //Handle empty case 
        if (total_row_count_scancenter123 === 0) 
        {
        console.warn("No rows found for 'Scancenter123' filter — table is empty.");
        console.log("------------------------------------------------------------------");
        console.log(" ");
        } 
        else    
        {
    //Locate the 5th column(scancenter) in each row
        for(let i=0; i<total_row_count_scancenter123; i++)
           {
             const Scancenter_column_scancenter123 = row_count_scancenter123.nth(i).locator('td').nth(4);
             await expect(Scancenter_column_scancenter123).toBeVisible();
             //get the text
             const scancenter_name_scancenter123 = await Scancenter_column_scancenter123.textContent();
             
                  if (!scancenter_name_scancenter123 || scancenter_name_scancenter123.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (scancenter_name_scancenter123.toLowerCase().includes('scancenter123')) 
                    {
                        matchedscancentercount_scancenter123++;
                        console.log("Row "+(i + 1) + " having 'scancenter_name': "+scancenter_name_scancenter123.trim());
                        console.log("");
                    }
           }
        }

        if(matchedscancentercount_scancenter123!=total_row_count_scancenter123)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_scancenter123 +" row count but only "+matchedscancentercount_scancenter123 +" is matching with 'Scancenter123' Scancenter name. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_scancenter123+" and the Scancenter name inclued 'Scancenter123' count is "+matchedscancentercount_scancenter123)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }


    //Click "National Scancenter" in dropdown
    await page.locator('(//span[@class="ant-select-selection-item"])[1]').click(); //clicking the dropdown
    await page.locator('//div[contains(text(),"National Scancenter")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
    const row_count_Nationalscancenter = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
    const total_row_count_Nationalscancenter = await row_count_Nationalscancenter.count();
    console.log("Selecting National Scancenter in the scancenter filter and the row count = "+total_row_count_Nationalscancenter);
    console.log(" ");
    
        let matchedscancentercount_Nationalscancenter = 0;

    // Handle empty case 
        if (total_row_count_Nationalscancenter === 0) 
        {
            console.warn("No rows found for 'National Scancenter' filter — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
        }
        else 
        {
    //Locate the 5th column(scancenter) in each row
        for(let i=0; i<total_row_count_Nationalscancenter; i++)
           {
             const Scancenter_column_Nationalscancenter = row_count_Nationalscancenter.nth(i).locator('td').nth(4);
             await expect(Scancenter_column_Nationalscancenter).toBeVisible();
             //get the text
             const scancenter_name_Nationalscancenter = await Scancenter_column_Nationalscancenter.textContent();
             
                  if (!scancenter_name_Nationalscancenter || scancenter_name_Nationalscancenter.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (scancenter_name_Nationalscancenter.toLowerCase().includes('national scancenter')) 
                    {
                        matchedscancentercount_Nationalscancenter++;
                        console.log("Row "+(i + 1) + " having 'scancenter_name': "+scancenter_name_Nationalscancenter.trim());
                        console.log("");
                    }
           }
        }

        if(matchedscancentercount_Nationalscancenter!=total_row_count_Nationalscancenter)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_Nationalscancenter +" row count but only "+matchedscancentercount_Nationalscancenter +" is matching with 'National Scancenter' Scancenter name. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_Nationalscancenter+" and the Scancenter name inclued 'National Scancenter' count is "+matchedscancentercount_Nationalscancenter)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }

        });