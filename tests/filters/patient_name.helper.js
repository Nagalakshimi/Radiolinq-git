const {expect} = require('@playwright/test');

exports.patientNameFilter = async function (page) {
  console.log("** ======================================== Patient Name Filter Started =========================================== **");
  const patientNameList = ['S','SA','SAHIL'];

  // Utility to count rows that match the patient Name across all pages
  async function countMatchingPatientNameRows(page, patientName) {
    let totalRows = 0;
    let matchedPatientNameCount = 0;
    let pageIndex = 1;

    while (true) {
      console.log("Checking Page "+(pageIndex)+"...");

      const rows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
      const rowCount = await rows.count();
      totalRows += rowCount;

      for (let i = 0; i < rowCount; i++) {
        const patientNameCell = rows.nth(i).locator('td').nth(2); //Patient name is in 3rd column
        const text = (await patientNameCell.textContent())?.trim();
        if (text && text.toLowerCase().includes(patientName.toLowerCase())) {
          matchedPatientNameCount++;
          console.log("Row "+(i + 1)+": ✅ Matched Patient Name = "+(text)+"\n");
        } else {
          console.warn("Row "+(i + 1)+": ❌ Patient Name mismatch. Found "+(text)+", expected "+(patientName)+"\n");
        }
      }

      // Check for next page
      const nextButton = page.locator('.ant-pagination-next:not(.ant-pagination-disabled)');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(1000);
        pageIndex++;
      } else {
        break;
      }
    }

    return { totalRows, matchedPatientNameCount };
  }

  

  // Loop through each Patient Name from list
  for (const patientName of patientNameList) {
    console.log("\n================= Filtering by Patient Name: "+(patientName)+" =================");

    // Clear & fill the Patient Name textbox
    const input = page.locator('//span//input[@placeholder="Patient Name"]');
    await input.fill('');
    await input.fill(patientName);
    await page.waitForTimeout(1000);

    // Count matched rows
    const result = await countMatchingPatientNameRows(page, patientName);

    console.log("Filtered by Patient Name "+(patientName)+":\n");
    console.log(" → Total Rows After Filter: "+(result.totalRows)+"\n");
    console.log(" → Rows Matching Patient Name "+(patientName)+": "+(result.matchedPatientNameCount)+"\n");

    if (result.totalRows !== result.matchedPatientNameCount) {
      console.warn("⚠️  Mismatch: "+(result.totalRows)+" rows loaded, but only "+(result.matchedPatientNameCount)+" match "+(patientName)+"\n");
    } else {
      console.log("✅ All rows match the entered Patient Name\n");
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

    console.log("================================================================\n");
  }
};


