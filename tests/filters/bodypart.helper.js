const { expect } = require('@playwright/test');

exports.bodypart = async function (page) {

  console.log("** ======================================== Bodypart Filter Started =========================================== **");

  // STEP 1: Count all rows before any filter is applied
  async function countUnfilteredRows(page) {
    let totalRows = 0;
    let pageIndex = 1;

    while (true) {
      console.log("Unfiltered - Checking Page " + pageIndex + " ...");
      const rows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
      const rowCount = await rows.count();
      totalRows += rowCount;

      // Check if next page exists
      const nextButton = page.locator('.ant-pagination-next:not(.ant-pagination-disabled)');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(1000);
        pageIndex++;
      } else {
        break;
      }
    }

    return totalRows;
  }

  // STEP 2: After filtering — count + validate each row via case viewer
  async function countFilteredRowsWithValidation(page, expectedBodypart) {
    let totalRows = 0;
    let matchedBodypartCount = 0;
    let pageIndex = 1;

    while (true) {
      console.log("Filtered - Checking Page " + pageIndex + " ...");
      const rows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
      const rowCount = await rows.count();
      totalRows += rowCount;

      for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);

        // Click the ellipsis button to open More Case Details
        const moreDetailsButton = row.locator('.ant-btn span[aria-label="ellipsis"]');
        await expect.soft(moreDetailsButton).toBeVisible();
        await moreDetailsButton.click();

        // Wait and get Bodypart field
        const bodypartElement = page.locator('//div[.//div[text()="Body parts"]]/div[@class="case-overview__value"]');
        await expect.soft(bodypartElement).toBeVisible();
        const bodypartText = (await bodypartElement.textContent())?.trim();

        if (bodypartText?.toLowerCase().includes(expectedBodypart.toLowerCase())) {
          console.log("✔️ Row "+(i + 1)+": has '"+(bodypartText)+"' bodypart, Checking Body part values in more case details options which is '"+(expectedBodypart)+"'");
          matchedBodypartCount++;
        } else {
          console.warn("❌ Row "+(i + 1)+": Expected '"+(expectedBodypart)+"', got '"+(bodypartText)+"'");
        }

        // Close the case viewer
        const closeBtn = page.locator('//span[@aria-label="close"]');
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await page.waitForTimeout(500);
        }
      }

      // Check if there's another page
      const nextButton = page.locator('.ant-pagination-next:not(.ant-pagination-disabled)');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(1000);
        pageIndex++;
      } else {
        break;
      }
    }

    return { totalRows, matchedBodypartCount };
  }

  // STEP 3: Click "Body Part" filter options
  const bodypartDropdownTrigger = page.locator('(//div[contains(@class,"ant-select-selector")])[2]');
    await bodypartDropdownTrigger.click();

    /*
    ** ================ This code is for individuals testcase run ======================== **
    //Check if the dropdown is visible
    const bodypart_dropdown = await page.locator('(//div[@class="rc-virtual-list-holder-inner"])');
    await expect.soft(bodypart_dropdown).toBeVisible(); 

    // Wait for the dropdown to appear
    const dropdownList = page.locator('//div[@class="rc-virtual-list-holder-inner"]//div//div');
    const optionCount = await dropdownList.count();

    console.log("\n Available Bodypart Filter Options:");
    for (let i = 0; i < optionCount; i++) {
        const optionText = await dropdownList.nth(i).textContent();
        console.log("   - "+(optionText?.trim()));
    }
    console.log("====================================================\n");

    */

// Wait for the 2nd dropdown to appear (it's give two element, pick the second)
const dropdownPanels = page.locator('//div[@class="rc-virtual-list-holder-inner"]');
const secondDropdownPanel = dropdownPanels.nth(1); // 0-based index: second element

await expect.soft(secondDropdownPanel).toBeVisible({ timeout: 5000 });

// Now get options inside that 2nd panel
const dropdownOptions = secondDropdownPanel.locator('div.ant-select-item-option-content'); // Each direct option is a div

await expect.soft(dropdownOptions.first()).toBeVisible({ timeout: 5000 });

// Print options
const optionCount = await dropdownOptions.count();
console.log(`Found ${optionCount} options in Bodypart filter:`);

  console.log("\nAvailable Bodypart Filter Options:");
  for (let i = 0; i < optionCount; i++) {
    const optionText = await dropdownOptions.nth(i).textContent();
    console.log("   - " + (optionText?.trim()));
  }

  console.log("===============================================================================\n");

  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);


  // Step 4: Count rows BEFORE filter
  console.log("\n================= Counting ALL CASES before filtering =================");
  const unfilteredTotal = await countUnfilteredRows(page);
  console.log(`Total Rows BEFORE filter: ${unfilteredTotal}`);
  console.log("=====================================================================\n");

  // STEP 5: Apply filter → validate via case viewer
  const bodypartList = ["not_set", "Brain", "MRV"];

  for (const bodypart of bodypartList) {
    console.log("\n================= Applying Filter: " + bodypart.toUpperCase() + " =================");

    const bodypartdropown = page.locator('(//div[contains(@class,"ant-select-selector")])[2]');
    await bodypartdropown.click();

// Get the correct dropdown panel (2nd one)
/*
  const dropdownPanels = page.locator('//div[@class="rc-virtual-list-holder-inner"]');
  const secondDropdownPanel = dropdownPanels.nth(1); // 0-based index
  await expect.soft(secondDropdownPanel).toBeVisible({ timeout: 5000 });
*/
  // Get the desired option from that dropdown
  const option = secondDropdownPanel.locator(`div:has-text("${bodypart}")`).first();
  await expect.soft(option).toBeVisible();
  await option.scrollIntoViewIfNeeded();
  await option.click();

  await page.waitForTimeout(1000);

    // Count + Validate all filtered rows
    const filtered = await countFilteredRowsWithValidation(page, bodypart);
    console.log("Filtered by " + bodypart + ":");
    console.log("   → Total Filtered Rows: " + filtered.totalRows);
    console.log("   → Matching Bodypart Rows: " + filtered.matchedBodypartCount);

    if (filtered.totalRows !== filtered.matchedBodypartCount) {
      console.warn(" ===> ❗ Mismatch! Filtered rows: "+(filtered.totalRows)+", matched: "+filtered.matchedBodypartCount);
    } else {
      console.log("✅ All rows match the '"+(bodypart)+"' filter.");
    }

    // Clear filter
    const closeIcon = page.locator('//span[contains(@class, "anticon-close-circle") and not(contains(@class, "ant-input-clear-icon-hidden"))]');
    if (await closeIcon.isVisible()) {
      await closeIcon.click();
      await page.waitForTimeout(1000);
      console.log("Cleared filter input.");
    }

    console.log("=====================================================================\n");
    
  }
};
