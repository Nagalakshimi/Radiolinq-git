import{test, expect} from '@playwright/test';
import { url, invaildlogin, vaildlogin, logout, checking_ifsuccessfully_loginintothedashbaord } from '../admin_login.helper';
import { choosedate } from '../choosedate.spec';
import { downloadCase, downloadReport } from '../admin_case_listing/downloads.spec';

let page;
test.beforeAll('Login using URL', async({browser})=>{
    page = await browser.newPage();
    //calling the url function
    await url(page);

    //Calling valid function
    await vaildlogin(page);

    //Checking the cases text is visible inside the admin dashboard
    await checking_ifsuccessfully_loginintothedashbaord(page);

    //Selecting From date and To date for getting case
    await choosedate(page);

    //Selecting 50/page
    //await page.locator('(//div[@class="ant-select-selector"])[7]').click();
    //await page.locator('//div[contains(text(), "50 / page")]').click();

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

test('Checking status option is visible inside the table', async()=>{
    //Verify to have status option inside the table
    const status = await page.locator('//thead[@class="ant-table-thead"]//th[10]//div[contains(text(),"Status")]');
    await expect(status).toBeVisible();
});

test('Checking all the filter options and giving inputs in status filter', async()=>{

    // Function to count total rows (with or without filtering)
    async function countRowsAcrossPages(page, expectedStatus = null) {
    let totalRows = 0;
    let matchedStatusCount = 0;
    let pageIndex = 1;

  while (true) {
    console.log("Checking Page "+pageIndex+" ...");
    const rows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
    const rowCount = await rows.count();
    totalRows += rowCount;

    for (let i = 0; i < rowCount; i++) {
      const statusCell = rows.nth(i).locator('td').nth(9); // 10th column
      await expect(statusCell).toBeVisible();
      const statusText = (await statusCell.textContent())?.trim();

      if (expectedStatus) {
        if (expectedStatus.toLowerCase() === 'report pending') {
          if (statusText?.toLowerCase() === 'assigned') {
            matchedStatusCount++;
            console.log("Row "+(i + 1)+": Status = '"+(statusText)+"' is valid for 'Report Pending'");
          } else {
            console.warn("Row "+(i + 1)+": Unexpected status '"+(statusText)+"' under 'Report Pending'");
          }
        } else {
        if (statusText?.toLowerCase() === expectedStatus.toLowerCase()) {
          matchedStatusCount++;
        } else {
          console.warn("Mismatch: Row "+(i + 1)+" has status '"+statusText+"' instead of "+expectedStatus);
        }
      }
    }
}
  

    // Check if next page is available
    const nextButton = page.locator('.ant-pagination-next:not(.ant-pagination-disabled)');
    if (await nextButton.isVisible()) 
    {
      await nextButton.click();
      await page.waitForTimeout(1000);
      pageIndex++;
    } else {
      break; // No more pages
    }
  }

  return { totalRows, matchedStatusCount };
}

    // Step 1: Count total unfiltered rows
    console.log("\n================= Counting ALL CASES before filtering =================");
    const unfiltered = await countRowsAcrossPages(page);
    console.log("Total Rows before filter: "+unfiltered.totalRows);
    console.log("=====================================================================\n");

    // Step 1.5: Print all dropdown options before applying filters
    const statusDropdownTrigger = page.locator('(//div[contains(@class,"ant-select-selector")])[5]');
    await statusDropdownTrigger.click();

    //Check if the dropdown is visible
    const status_dropdown = await page.locator('.rc-virtual-list-holder-inner');
    await expect(status_dropdown).toBeVisible(); 

    // Wait for the dropdown to appear
    const dropdownList = page.locator('//div[@class="rc-virtual-list-holder-inner"]//div//div');
    const optionCount = await dropdownList.count();

    console.log("\n Available Status Filter Options:");
    for (let i = 0; i < optionCount; i++) {
        const optionText = await dropdownList.nth(i).textContent();
        console.log("   - "+(optionText?.trim()));
    }
    console.log("====================================================\n");

    // Close the dropdown (optional step)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Step 2: Loop over each status and count
    const statusList = ["Assigned", "Reported", "Unassigned", "To be approved", "Report Pending"];

    for (const status of statusList) {
    console.log("\n================= Applying Filter: "+(status.toUpperCase())+" =================");

    // Click on Status filter
    const dropdown = page.locator('(//div[contains(@class,"ant-select-selector")])[5]');
    await dropdown.click();

    // Select the desired status
    const option = page.locator(`//div[@class="rc-virtual-list"]//div[contains(text(),"${status}")]`);
    await expect(option).toBeVisible();
    await option.click();

    // Wait for table to reload 
    await page.waitForTimeout(1000);

    // Count filtered rows
    const filtered = await countRowsAcrossPages(page, status);
    console.log("Filtered by "+status+":");
    console.log("   → Total Rows: "+filtered.totalRows);
    console.log("   → Matching '"+(status)+"' Rows: "+filtered.matchedStatusCount);

    if (filtered.totalRows !== filtered.matchedStatusCount) {
    console.warn(" ===> Mismatch in status rows! : Total rows after filter "+(filtered.totalRows)+" But only "+(filtered.matchedStatusCount)+" has matched with "+status);
    console.log("========================================================");
  } else {
    console.log("All rows match the '"+(status)+"' status.");
    console.log("========================================================");
  }

  //Trigger downloads based on status
    if (filtered.totalRows === 0) {
    console.warn("Skipping download — No cases found for status '"+(status)+"'");
    console.log(" ");
    }   
    else if (status.toLowerCase() === "reported") {
    console.log("Calling 'downloadReport' for Reported status...");
    console.log(" ");
    await downloadReport(page);
    await page.waitForTimeout(1000);
    }   
    else {
    console.log("Calling 'downloadCase' for '"+(status)+"' status...");
    console.log(" ");
    await downloadCase(page);
    await page.waitForTimeout(1000);
}


    console.log("=====================================================================\n");
}



/*
    //Check all the filter options is visible
    const filter_option = await page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');
    await expect(filter_option).toHaveCount(10);
    for(let i=0;i<10;i++)
    {
        await expect(filter_option.nth(i)).toBeVisible();
    }

    //Click the 7th filter - Status and check the dropdown is visible
    const Statusfilter = await (filter_option.nth(6));
    await Statusfilter.click();

    //Check if the dropdown is visible
    const status_dropdown = await page.locator('.rc-virtual-list-holder-inner');
    await expect(status_dropdown).toBeVisible();
    
    //Get all the Status text content
    const status_dropdown_text = await page.locator('//div[@class="rc-virtual-list-holder-inner"]//div[@class="ant-select-item ant-select-item-option"]//div[@class="ant-select-item-option-content"]');
    const get_status_text = await status_dropdown_text.allTextContents();
    const status_dropdown_text_count = await get_status_text.length;
    console.log("Total no.of dropdowns present in status filter = "+status_dropdown_text_count);
    console.log("");
    console.log("Dropdown options = "+get_status_text);
    console.log("");

    //Click "Assigned" in dropdown
    await page.locator('//div[normalize-space(text())="Assigned"]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
        const row_count_Assigned = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count_Assigned = await row_count_Assigned.count();
        console.log("Selecting Assigned in the status filter and the row count = "+total_row_count_Assigned);
        console.log(" ");
    
        let matchedstatuscount_Assigned = 0;

    //Handle empty case 
        if (total_row_count_Assigned === 0) 
        {
        console.warn("No cases found for 'Assigned' filter — table is empty.");
        console.log("------------------------------------------------------------------");
        console.log(" ");
        } 
        else    
        {
    //Locate the 10th column(status) in each row
        for(let i=0; i<total_row_count_Assigned; i++)
           {
             const Status_column_Assigned = row_count_Assigned.nth(i).locator('td').nth(9);
             await expect(Status_column_Assigned).toBeVisible();
             //get the text
             const status_name_Assigned = await Status_column_Assigned.textContent();
             
                  if (!status_name_Assigned || status_name_Assigned.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (status_name_Assigned.toLowerCase().includes('assigned')) 
                    {
                        matchedstatuscount_Assigned++;
                        console.log("Row "+(i + 1) + " having 'Assigned' status: "+status_name_Assigned.trim());
                        console.log("");
                    }
           }
        }

        if(matchedstatuscount_Assigned!=total_row_count_Assigned)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_Assigned +" row count but only "+matchedstatuscount_Assigned +" is matching with 'ASSIGNED' Status. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_Assigned+" and the Status inclued 'ASSIGNED' count is "+matchedstatuscount_Assigned)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
*/
/*
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
            */
});