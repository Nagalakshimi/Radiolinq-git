const { expect } = require('@playwright/test');
const {tagsMark} = require('../admin_case_listing/tags_mark.helper');

exports.tagsCheck = async function (page) {

    //Calling the tags_mark function from "admin_case_listing" to tagged the cases if it is untagged
    await tagsMark(page);

  const tagColors = {
    "Urgent": "rgb(255,0,0)",
    "Critical": "rgb(255,69,0)",
    "Interesting": "rgb(30,144,255)",
    "Case Opened": "rgb(50,205,50)"
  };

  // Reusable function to count rows across all pages and match tags
  async function countRowsAcrossPages(page, expectedTag = null, expectedBgColor = null) {
    let totalRows = 0;
    let matchedTagCount = 0;
    let pageIndex = 1;

    while (true) {
      console.log(`Checking Page ${pageIndex} ...`);
      const rows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
      const rowCount = await rows.count();
      totalRows += rowCount;

      for (let i = 0; i < rowCount; i++) {
        const tagBox = rows.nth(i).locator('td').nth(0).locator('.admin-cases__tags .admin-cases__tag-item').first();

        if (await tagBox.isVisible()) {
          let bgColor = await tagBox.evaluate(el =>
            window.getComputedStyle(el).getPropertyValue('background-color')
          );
          bgColor = bgColor.replace(/\s+/g, '').toLowerCase();

          if (expectedTag && bgColor === expectedBgColor) {
            console.log(`Row ${i + 1}: '${expectedTag}' tag matched — background: ${bgColor}`);
            matchedTagCount++;
          } else if (expectedTag) {
            console.warn(`Row ${i + 1} tag mismatch — expected: ${expectedBgColor}, found: ${bgColor}`);
          }
        }
      }

      const nextButton = page.locator('.ant-pagination-next:not(.ant-pagination-disabled)');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
        pageIndex++;
      } else {
        break;
      }
    }

    return { totalRows, matchedTagCount };
  }

  // Step 1: Count total rows before applying any filter
  console.log("\n================= Counting ALL CASES before filtering =================");
  const unfiltered = await countRowsAcrossPages(page);
  console.log("Total Rows before filter: " + unfiltered.totalRows);
  console.log("=====================================================================\n");

  // Open Tag filter dropdown
  const filter_option = page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');
  const Tagfilter = filter_option.nth(7);
  await Tagfilter.click();

  /*
  ** ================ This code is for individuals testcase run ======================== **
  const dropdownPanels = page.locator('//div[@class="rc-virtual-list-holder-inner"]');
  const tagDropdown = dropdownPanels.first();
  await expect.soft(tagDropdown).toBeVisible({ timeout: 5000 });

  const dropdownOptions = tagDropdown.locator('div.ant-select-item-option-content');
  const optionCount = await dropdownOptions.count();

  console.log("\nAvailable Tag Filter Options:");
  for (let i = 0; i < optionCount; i++) {
    const optionText = await dropdownOptions.nth(i).textContent();
    console.log("   - " + (optionText?.trim()));
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
*/

    // Wait for the 2nd dropdown to appear (it's give two element, pick the second)
            const dropdownPanels = page.locator('//div[@class="rc-virtual-list-holder-inner"]');
            const fourthDropdownPanel = dropdownPanels.nth(5); // 0-based index: sixth element

            await expect.soft(fourthDropdownPanel).toBeVisible({ timeout: 5000 });

            // Now get options inside that 2nd panel
            const dropdownOptions = fourthDropdownPanel.locator('div.ant-select-item-option-content'); // Each direct option is a div

            await expect.soft(dropdownOptions.first()).toBeVisible({ timeout: 5000 });
        
            // Print options
            const optionCount = await dropdownOptions.count();
            console.log(`Found ${optionCount} options in tag filter:`);

            console.log("\nAvailable tag Filter Options:");
            for (let i = 0; i < optionCount; i++) {
            const optionText = await dropdownOptions.nth(i).textContent();
            console.log("   - " + (optionText?.trim()));
  }

            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);

       console.log("====================================================\n");

  // Step 2: Loop through each tag and validate rows
  for (const [tag, bgColor] of Object.entries(tagColors)) {
    console.log(`\n================= Applying Filter: ${tag.toUpperCase()} =================`);
    await Tagfilter.click();
    const tagOption = page.locator(`//div[@class="rc-virtual-list"]//div[contains(text(),"${tag}")]`);
    await expect.soft(tagOption).toBeVisible();
    await tagOption.scrollIntoViewIfNeeded();
    await tagOption.click();
    await page.waitForTimeout(500);

    const filtered = await countRowsAcrossPages(page, tag, bgColor);

    console.log(`Filtered by ${tag}:`);
    console.log(`   → Total Rows: ${filtered.totalRows}`);
    console.log(`   → Matching '${tag}' Rows: ${filtered.matchedTagCount}`);

    if (filtered.totalRows !== filtered.matchedTagCount) {
      console.warn(` ===> Mismatch: ${filtered.totalRows} rows filtered, but only ${filtered.matchedTagCount} matched '${tag}' tag.`);
    } else {
      console.log(`All rows match the '${tag}' tag.`);
    }

    console.log("=====================================================================");

    // Clear tag filter using close icon
    const closeIcon = page.locator('//span[contains(@class, "anticon-close-circle") and not(contains(@class, "ant-input-clear-icon-hidden"))]');
    if (await closeIcon.isVisible()) {
      await closeIcon.click();
      await page.waitForTimeout(1000);
      console.log("Cleared filter using close icon.");
    } else {
      console.log("No clear icon, skipping filter reset.");
    }
  }
};
