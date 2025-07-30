
const {expect} = require('@playwright/test');
        
        exports.scancenter = async function (page) {

        console.log("** ======================================== Scancenter Filter Started =========================================== **");
            
            // Function to count total rows (with or without filtering)
            async function countRowsAcrossPages(page, expectedscancenter = null) {
            let totalRows = 0;
            let matchedscancenterCount = 0;
            let pageIndex = 1;
        
          while (true) {
            console.log("Checking Page "+pageIndex+" ...");
            const rows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
            const rowCount = await rows.count();
            totalRows += rowCount;
        
            for (let i = 0; i < rowCount; i++) {
              const scancenterCell = rows.nth(i).locator('td').nth(4); // 5th column
              await expect.soft(scancenterCell).toBeVisible();
              const scancenterText = (await scancenterCell.textContent())?.trim();
        
              if (expectedscancenter) {
                if (scancenterText?.toLowerCase().includes(expectedscancenter.toLowerCase())) {
                  console.log("Row : "+(i+1)+" has '"+(scancenterText)+"' which is under "+(expectedscancenter)+" scancenter.\n")
                  matchedscancenterCount++;
                } else {
                  console.warn("Mismatch: Row "+(i + 1)+" has scancenter '"+scancenterText+"' instead of "+expectedscancenter+".\n");
                }
              }
        }
          
        
            // Check if next page is available
            const nextButton = page.locator('.ant-pagination-next:not(.ant-pagination-disabled)');
            if (await nextButton.isVisible()) 
            {
              await nextButton.click();
              await page.waitForTimeout(500);
              pageIndex++;
            } else {
              break; // No more pages
            }
          }
        
          return { totalRows, matchedscancenterCount };
        }
        
            // Step 1: Count total unfiltered rows
            console.log("\n================= Counting ALL CASES before filtering =================");
            const unfiltered = await countRowsAcrossPages(page);
            console.log("Total Rows before filter: "+unfiltered.totalRows);
            console.log("=====================================================================\n");
       
            
            // Step 1.5: Print all dropdown options in scancenter before applying filters
            const scancenterDropdownTrigger = page.locator('(//div[contains(@class,"ant-select-selector")])[3]');
            await scancenterDropdownTrigger.click();

            /*
    ** ================ This code is for individuals testcase run ======================== **
    //Check if the dropdown is visible
    const scancenter_dropdown = await page.locator('(//div[@class="rc-virtual-list-holder-inner"])');
    await expect.soft(scancenter_dropdown).toBeVisible(); 

    // Wait for the dropdown to appear
    const dropdownList = page.locator('//div[@class="rc-virtual-list-holder-inner"]//div//div');
    const optionCount = await dropdownList.count();

    console.log("\n Available Scancenter Filter Options:");
    for (let i = 0; i < optionCount; i++) {
        const optionText = await dropdownList.nth(i).textContent();
        console.log("   - "+(optionText?.trim()));
    }
    console.log("====================================================\n");

    */
        
            // Wait for the 2nd dropdown to appear (it's give two element, pick the second)
            const dropdownPanels = page.locator('//div[@class="rc-virtual-list-holder-inner"]');
            const thirdDropdownPanel = dropdownPanels.nth(2); // 0-based index: third element

            await expect.soft(thirdDropdownPanel).toBeVisible({ timeout: 5000 });

            // Now get options inside that 2nd panel
            const dropdownOptions = thirdDropdownPanel.locator('div.ant-select-item-option-content'); // Each direct option is a div

            await expect.soft(dropdownOptions.first()).toBeVisible({ timeout: 5000 });
        
            // Print options
            const optionCount = await dropdownOptions.count();
            console.log(`Found ${optionCount} options in Scancenter filter:`);

            console.log("\nAvailable Scancenter Filter Options:");
            for (let i = 0; i < optionCount; i++) {
            const optionText = await dropdownOptions.nth(i).textContent();
            console.log("   - " + (optionText?.trim()));
  }

            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);

       
            // Step 2: Loop over each scancenter and count
            const scancenterList = ["scancenter123", "National Scancenter"];
        
            for (const scancenter of scancenterList) {
            console.log("\n================= Applying Filter: "+(scancenter.toUpperCase())+" =================");
        
            // Click on scancenter filter
            const dropdown = page.locator('(//div[contains(@class,"ant-select-selector")])[3]');
            await dropdown.click();
        
            // Select the desired scantype
            const option = page.locator(`//div[@class="rc-virtual-list"]//div[contains(text(),"${scancenter}")]`);
            await expect.soft(option).toBeVisible();
            //await page.waitForTimeout(1000);
            await option.scrollIntoViewIfNeeded();
            await option.click();
        
            // Wait for table to reload 
            await page.waitForTimeout(500);
        
            // Count filtered rows
            const filtered = await countRowsAcrossPages(page, scancenter);
            console.log("Filtered by "+scancenter+":");
            console.log("   → Total Rows: "+filtered.totalRows);
            console.log("   → Matching '"+(scancenter)+"' Rows: "+filtered.matchedscancenterCount);
        
            if (filtered.totalRows !== filtered.matchedscancenterCount) {
            console.warn(" ===> Mismatch in status rows! : Total rows after filter "+(filtered.totalRows)+" But only "+(filtered.matchedscancenterCount)+" has matched with "+scancenter);
            console.log("========================================================");
          } else {
            console.log("All rows match the '"+(scancenter)+"' status.");
            console.log("========================================================");
          }
        
          // ✅ Clear the filter input using visible close icon if present
          const closeIcon = page.locator('//span[contains(@class, "anticon-close-circle") and not(contains(@class, "ant-input-clear-icon-hidden"))]');
          if (await closeIcon.isVisible()) {
          await closeIcon.click();
          await page.waitForTimeout(1000);
          console.log("Cleared input using close icon.");
    }     else {
          console.log("Close icon not visible, skipping clear.");
    }
            console.log("=====================================================================\n");
  }
}
  


