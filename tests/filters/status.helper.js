const {expect} = require('@playwright/test');
import { downloadCase, downloadReport } from '../admin_case_listing/downloads.helper';

exports.status = async function (page) {

  console.log("** ======================================== Status Filter Started =========================================== **");
  
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
/*
** ================ This code is for individuals testcase run ======================== **
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
*/

    // Wait for the 2nd dropdown to appear (it's give two element, pick the second)
            const dropdownPanels = page.locator('//div[@class="rc-virtual-list-holder-inner"]');
            const fourthDropdownPanel = dropdownPanels.nth(4); // 0-based index: fifth element

            await expect.soft(fourthDropdownPanel).toBeVisible({ timeout: 5000 });

            // Now get options inside that 2nd panel
            const dropdownOptions = fourthDropdownPanel.locator('div.ant-select-item-option-content'); // Each direct option is a div

            await expect.soft(dropdownOptions.first()).toBeVisible({ timeout: 5000 });
        
            // Print options
            const optionCount = await dropdownOptions.count();
            console.log(`Found ${optionCount} options in status filter:`);

            console.log("\nAvailable status Filter Options:");
            for (let i = 0; i < optionCount; i++) {
            const optionText = await dropdownOptions.nth(i).textContent();
            console.log("   - " + (optionText?.trim()));
  }

            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);

       console.log("====================================================\n");

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
    else if (filtered.matchedStatusCount > 0 && status.trim().toLowerCase() === "reported") {
      //console.log("DEBUG: Filtered status is ->", statusText.trim().toLowerCase());
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