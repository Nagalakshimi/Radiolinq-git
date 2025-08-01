const { expect } = require('@playwright/test');

exports.assigncases_todoctors = async function (page) {
    //Assiging "Unassigned" cases to Doctors
console.log("\nChecking case status....if it 'Unassigned' assigned to doctors\n");

  const patient_detail_table = page.locator('.ant-table-container');
  await expect(patient_detail_table).toBeVisible();

  // Scroll right to reveal assign column
  await patient_detail_table.evaluate(el => el.scrollLeft = el.scrollWidth);

  const doctors = ['Doctor Testing', 'Lara Johnson'];
  let doctorIndex = 0;
  let pageIndex = 1;

  while (true) {
    console.log(`📄 Processing Page ${pageIndex}...`);

    const rows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const currentRow = rows.nth(i);
      const statusCell = currentRow.locator('td').nth(9);
      const statusText = (await statusCell.textContent())?.trim().toLowerCase();
      console.log(`Row ${i + 1} - Status: ${statusText}`);

      if (statusText === 'unassigned') {
        const doctorToAssign = doctors[doctorIndex % doctors.length];
        doctorIndex++;

        console.log(`🔄 Assigning Row ${i + 1} to ${doctorToAssign}`);

        const assignIcon = currentRow.locator('span[aria-label="user-add"]');
        await assignIcon.scrollIntoViewIfNeeded();
        await assignIcon.click();

        const doctorDropdownTrigger = page.locator(
          '//div[@class="ant-select ant-select-single ant-select-show-arrow ant-select-show-search" and .//span[text()="Select Doctor"]]'
        );
        await doctorDropdownTrigger.click();

        const doctorDropdown = page.locator('//div[contains(@class,"ant-select-dropdown") and not(contains(@class,"hidden"))]');
        await expect(doctorDropdown).toBeVisible();
        await doctorDropdown.getByText(doctorToAssign, { exact: true }).click();

        const confirmAssignButton = page.locator('//button//span[contains(text(), "Assign")]');
        await expect(confirmAssignButton).toBeVisible();
        await confirmAssignButton.click();

        console.log(`✅ Assigned Row ${i + 1} to ${doctorToAssign}`);
        await page.waitForTimeout(1000);
        await page.locator('//div[contains(text(), "Due Time")]').click();
      }
    }

    const nextButton = page.locator('.ant-pagination-next:not(.ant-pagination-disabled)');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      pageIndex++;
    } else {
      break;
    }
  }
  
   // ✅ Click Page 1 button to go back first page
    const page1_Button = page.locator('//ul[contains(@class,"ant-table-pagination")]//li[@class="ant-pagination-item ant-pagination-item-1"]');
    if (await page1_Button.isVisible()) {
    await page1_Button.click();
    await page.waitForTimeout(1000);
    console.log('⬅️ Clicked Page no.1 button to return first page.');
    } 
    else {
    console.warn('⚠️ Page no.1 button is disabled or not visible. Cannot go back.');
      }
    console.log('===================== Finished assigning the unassigned cases to doctors. =======================');
};

    
    
        
