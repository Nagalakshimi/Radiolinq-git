const {expect} = require('@playwright/test');
const { assigncases_todoctors } = require('../admin_case_listing/assign_case_todoctor.helper');

    exports.doctor = async function (page) {

      console.log("** ======================================== Doctor Filter Started =========================================== **");

            // Step 1: Assign cases to Doctors
            //Calling assign case function from admin_case_listing
            await assigncases_todoctors(page);
            

            // Function to count total rows (with or without filtering)
            async function countRowsAcrossPages(page, expecteddoctor = null) {
            let totalRows = 0;
            let matcheddoctorCount = 0;
            let pageIndex = 1;
        
          while (true) {
            console.log("Checking Page "+pageIndex+" ...");
            const rows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
            const rowCount = await rows.count();
            totalRows += rowCount;
        
            for (let i = 0; i < rowCount; i++) {
              const doctorCell = rows.nth(i).locator('td').nth(6); // 5th column
              await expect.soft(doctorCell).toBeVisible();
              const doctorText = (await doctorCell.textContent())?.trim();
        
              if (expecteddoctor) {
                if (doctorText?.toLowerCase().includes(expecteddoctor.toLowerCase())) {
                  console.log("Filtering with: "+(expecteddoctor)+", Row : "+(i+1)+" Doctor name: '"+(doctorText)+"\n")
                  matcheddoctorCount++;
                } else {
                  console.warn("Mismatch: Row "+(i + 1)+" has doctor '"+doctorText+"' instead of "+expecteddoctor+".\n");
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
        
          return { totalRows, matcheddoctorCount };
        }
        
            // Step 1: Count total unfiltered rows
            console.log("\n================= Counting ALL CASES before filtering =================");
            const unfiltered = await countRowsAcrossPages(page);
            console.log("Total Rows before filter: "+unfiltered.totalRows);
            console.log("=====================================================================\n");
       
            
            // Step 1.5: Print all dropdown options in doctor before applying filters
            const doctorDropdownTrigger = page.locator('(//div[contains(@class,"ant-select-selector")])[4]');
            await doctorDropdownTrigger.click();

     /*      
        // ** ================ This code is for individuals testcase run ======================== **
        //Check if the dropdown is visible
        const doctor_dropdown = await page.locator('(//div[@class="rc-virtual-list-holder-inner"])');
        await expect.soft(doctor_dropdown).toBeVisible(); 

        // Wait for the dropdown to appear
        const dropdownList = page.locator('//div[@class="rc-virtual-list-holder-inner"]//div//div');
        const optionCount = await dropdownList.count();

        console.log("\n Available doctor Filter Options:");
        for (let i = 0; i < optionCount; i++) {
        const optionText = await dropdownList.nth(i).textContent();
        console.log("   - "+(optionText?.trim()));
    }
        console.log("====================================================\n");
*/
    
        
            // Wait for the 2nd dropdown to appear (it's give two element, pick the second)
            const dropdownPanels = page.locator('//div[@class="rc-virtual-list-holder-inner"]');
            const fourthDropdownPanel = dropdownPanels.nth(3); // 0-based index: fourth element

            await expect.soft(fourthDropdownPanel).toBeVisible({ timeout: 5000 });

            // Now get options inside that 2nd panel
            const dropdownOptions = fourthDropdownPanel.locator('div.ant-select-item-option-content'); // Each direct option is a div

            await expect.soft(dropdownOptions.first()).toBeVisible({ timeout: 5000 });
        
            // Print options
            const optionCount = await dropdownOptions.count();
            console.log(`Found ${optionCount} options in Doctor filter:`);

            console.log("\nAvailable doctor Filter Options:");
            for (let i = 0; i < optionCount; i++) {
            const optionText = await dropdownOptions.nth(i).textContent();
            console.log("   - " + (optionText?.trim()));
  }

            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);

            console.log("====================================================\n");
       
            // Step 2: Loop over each doctor and count
            const doctorList = ["Doctor Testing", "Lara Johnson"];
        
            for (const doctor of doctorList) {
            console.log("\n================= Applying Filter: "+(doctor.toUpperCase())+" =================");
        
            // Click on doctor filter
            const dropdown = page.locator('(//div[contains(@class,"ant-select-selector")])[4]');
            await dropdown.click();
        
            // Select the desired scantype
            const option = page.locator(`//div[@class="rc-virtual-list"]//div[contains(text(),"${doctor}")]`);
            await expect.soft(option).toBeVisible();
            //await page.waitForTimeout(1000);
            await option.scrollIntoViewIfNeeded();
            await option.click();
        
            // Wait for table to reload 
            await page.waitForTimeout(500);
        
            // Count filtered rows
            const filtered = await countRowsAcrossPages(page, doctor);
            console.log("Filtered by "+doctor+":");
            console.log("   → Total Rows: "+filtered.totalRows);
            console.log("   → Matching '"+(doctor)+"' Rows: "+filtered.matcheddoctorCount);
        
            if (filtered.totalRows !== filtered.matcheddoctorCount) {
            console.warn(" ===> Mismatch in status rows! : Total rows after filter "+(filtered.totalRows)+" But only "+(filtered.matcheddoctorCount)+" has matched with "+doctor);
            console.log("========================================================");
          } else {
            console.log("All rows match the '"+(doctor)+"' status.");
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
  





