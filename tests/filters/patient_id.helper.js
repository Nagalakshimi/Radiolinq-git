const {expect} = require('@playwright/test');

exports.patientIdFilter = async function (page) {
  console.log("** ======================================== Patient Id Filter Started =========================================== **");
  const patientIdList = ['2', '12', '0120'];

  // Utility to count rows that match the patient ID across all pages
  async function countMatchingPatientIdRows(page, patientId) {
    let totalRows = 0;
    let matchedPatientIdCount = 0;
    let pageIndex = 1;

    while (true) {
      console.log("\nChecking Page "+(pageIndex)+"...");

      const rows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
      const rowCount = await rows.count();
      totalRows += rowCount;

      for (let i = 0; i < rowCount; i++) {
        const patientIdCell = rows.nth(i).locator('td').nth(1); //Patient ID is in 2nd column
        const text = (await patientIdCell.textContent())?.trim();
        if (text && text.includes(patientId)) {
          matchedPatientIdCount++;
          console.log("Row "+(i + 1)+": ✅ Matched Patient ID = "+text);
        } else {
          console.warn("Row "+(i + 1)+": ❌ Patient ID mismatch. Found "+(text)+", expected "+patientId);
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

    return { totalRows, matchedPatientIdCount };
  }

  // Loop through each Patient ID from list
  for (const patientId of patientIdList) {
    console.log("\n================= Filtering by Patient ID: "+(patientId)+" =================");

    // Clear & fill the Patient ID textbox
    const input = page.locator('//span//input[@placeholder="Patient ID"]');
    await input.fill('');
    await input.fill(patientId);
    await page.waitForTimeout(1000);

    // Count matched rows
    const result = await countMatchingPatientIdRows(page, patientId);

    console.log("Filtered by Patient ID "+(patientId)+":\n");
    console.log(" → Total Rows After Filter: "+(result.totalRows)+"\n");
    console.log(" → Rows Matching Patient ID "+(patientId)+": "+(result.matchedPatientIdCount)+"\n");

    if (result.totalRows !== result.matchedPatientIdCount) {
      console.warn("⚠️  Mismatch: "+(result.totalRows)+" rows loaded, but only "+(result.matchedPatientIdCount)+" match "+(patientId)+"\n");
    } else {
      console.log("✅ All rows match the entered Patient ID");
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