const {expect} = require('@playwright/test');

exports.scantype = async function (page) {

  console.log("** ======================================== Scantype Filter Started =========================================== **");
    
    // Function to count total rows (with or without filtering)
    async function countRowsAcrossPages(page, expectedScantype = null) {
    let totalRows = 0;
    let matchedScantypeCount = 0;
    let pageIndex = 1;

  while (true) {
    console.log("Checking Page "+pageIndex+" ...");
    const rows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
    const rowCount = await rows.count();
    totalRows += rowCount;

    for (let i = 0; i < rowCount; i++) {
      const scantypeCell = rows.nth(i).locator('td').nth(3); // 4th column
      await expect.soft(scantypeCell).toBeVisible();
      const scantypeText = (await scantypeCell.textContent())?.trim();

      if (expectedScantype) {
        if (scantypeText?.toLowerCase().includes(expectedScantype.toLowerCase())) {
          console.log("Row : "+(i+1)+" has '"+(scantypeText)+"' which is under "+(expectedScantype)+" Scantype.")
          matchedScantypeCount++;
        } else {
          console.warn("Mismatch: Row "+(i + 1)+" has scantype '"+scantypeText+"' instead of "+expectedScantype);
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

  return { totalRows, matchedScantypeCount };
}

    // Step 1: Count total unfiltered rows
    console.log("\n================= Counting ALL CASES before filtering =================");
    const unfiltered = await countRowsAcrossPages(page);
    console.log("Total Rows before filter: "+unfiltered.totalRows);
    console.log("=====================================================================\n");

    // Step 1.5: Print all dropdown options in scantype before applying filters
    const scantypeDropdownTrigger = page.locator('(//div[contains(@class,"ant-select-selector")])[1]');
    await scantypeDropdownTrigger.click();

    //Check if the dropdown is visible
    const scantype_dropdown = await page.locator('(//div[@class="rc-virtual-list-holder-inner"])[1]');
    await expect.soft(scantype_dropdown).toBeVisible(); 

    // Wait for the dropdown to appear
    const dropdownList = page.locator('//div[@class="rc-virtual-list-holder-inner"]//div//div');
    const optionCount = await dropdownList.count();

    console.log("\n Available Scantype Filter Options:");
    for (let i = 0; i < optionCount; i++) {
        const optionText = await dropdownList.nth(i).textContent();
        console.log("   - "+(optionText?.trim()));
    }
    console.log("====================================================\n");

    // Close the dropdown (optional step)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Step 2: Loop over each scantype and count
    const scantypeList = ["CT", "MR", "DX"];

    for (const scantype of scantypeList) {
    console.log("\n================= Applying Filter: "+(scantype.toUpperCase())+" =================");

    // Click on Scantype filter
    const dropdown = page.locator('(//div[contains(@class,"ant-select-selector")])[1]');
    await dropdown.click();

    // Select the desired scantype
    const option = page.locator(`//div[@class="rc-virtual-list"]//div[contains(text(),"${scantype}")]`);
    await expect.soft(option).toBeVisible();
    await option.scrollIntoViewIfNeeded();
    await option.click();

    // Wait for table to reload 
    await page.waitForTimeout(1000);

    // Count filtered rows
    const filtered = await countRowsAcrossPages(page, scantype);
    console.log("Filtered by "+scantype+":");
    console.log("   → Total Rows: "+filtered.totalRows);
    console.log("   → Matching '"+(scantype)+"' Rows: "+filtered.matchedScantypeCount);

    if (filtered.totalRows !== filtered.matchedScantypeCount) {
    console.warn(" ===> Mismatch in status rows! : Total rows after filter "+(filtered.totalRows)+" But only "+(filtered.matchedScantypeCount)+" has matched with "+scantype);
    console.log("========================================================");
  } else {
    console.log("All rows match the '"+(scantype)+"' status.");
    console.log("========================================================");
  }

  // ✅ Clear the filter input using visible close icon if present
    const closeIcon = page.locator('//span[contains(@class, "anticon-close-circle") and not(contains(@class, "ant-input-clear-icon-hidden"))]');
    if (await closeIcon.isVisible()) {
      await closeIcon.click();
      await page.waitForTimeout(1000);
      console.log("Cleared input using close icon.");
    } else {
      console.log("Close icon not visible, skipping clear.");
    }

    console.log("=====================================================================\n");
}
await page.locator('.case-filter-form__sync-button').click();
await page.waitForTimeout(2000);
}