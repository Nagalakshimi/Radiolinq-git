/*
const {expect} =  require ('@playwright/test');

exports.assigncases_todoctors = async function (page) {

    //Check the Patient details table is visible
        const patient_detail_table = page.locator('.ant-table-container');
        await expect(patient_detail_table).toBeVisible();


        //Finding the no.of.rows inside the table                           
            const row_count = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
            const total_row_count = await row_count.count();
            console.log("No.of cases present in the row = "+total_row_count);
            console.log(" ");
*/
/*
        //Scroll the table right to view action column and access the assign case button
        await patient_detail_table.evaluate(el => el.scrollLeft = el.scrollWidth);
    
        //Handle empty case 
            if (total_row_count === 0) 
            {
            console.warn("No rows found inside the table of case listing — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
            } 
            else    
            {
        // List of doctors to assign in round-robin
        const doctors = ['Doctor Testing', 'Dr Hemanath'];
        let doctorIndex = 0;

        for (let i = 0; i < total_row_count; i++) 
        {
            const currentRow = row_count.nth(i);
            const statusCell = currentRow.locator('td').nth(9);
            const status_text = (await statusCell.textContent())?.trim().toLowerCase();
            console.log("Row "+(i + 1)+" - Status: "+(status_text));

        if (status_text?.toLowerCase() === 'unassigned') 
            {
            const doctorToAssign = doctors[doctorIndex % doctors.length];
            doctorIndex++;

        console.log("Try to Assign Row "+(i + 1)+" to "+doctorToAssign);

        // Scroll into view and click the Assign icon in the current row
      const assignIcon = currentRow.locator('span[aria-label="user-add"]');
      await assignIcon.scrollIntoViewIfNeeded();
      await assignIcon.click();
      console.log("Clicked Assign icon for Row "+(i + 1));

      // Select doctor
      //const doctorDropdownTrigger = page.locator('//div[@class="ant-select ant-select-single ant-select-show-arrow ant-select-show-search"]');////span[@class="ant-select-selection-search"]//input[@id="rc_select_30"] //span[contains(text(), "Select Doctor")]
      const doctorDropdownTrigger = page.locator('//div[@class="ant-select ant-select-single ant-select-show-arrow ant-select-show-search" and .//span[text()="Select Doctor"]]');
      await doctorDropdownTrigger.click();
      console.log("Opened doctor dropdown");

      const doctorDropdown = page.locator('//div[contains(@class,"ant-select-dropdown") and not(contains(@class,"hidden"))]');
      await expect(doctorDropdown).toBeVisible();
      await doctorDropdown.getByText(doctorToAssign, { exact: true }).click();

      // Click final Assign button
      const confirmAssignButton = page.locator('//button//span[contains(text(), "Assign")]');
      await expect(confirmAssignButton).toBeVisible();
      await confirmAssignButton.click();
      console.log("Successfully assigned Row "+(i + 1)+" to "+doctorToAssign);
      console.log("------------------------------------------------------------");

      await page.waitForTimeout(1000); // Optional: allow time for UI update
      await page.locator('//div[contains(text(), "Due Time")]').click(); //After assign it's does'nt auto close so click on random place
    }
  }
            }
        }

   */
  /*
  const { expect } = require('@playwright/test');

exports.assigncases_todoctors = async function (page) {
//Assiging "Unassigned" cases to Doctors
console.log("Checking case status....if it 'Unassigned' assigned to doctors\n");
  const patient_detail_table = page.locator('.ant-table-container');
  await expect(patient_detail_table).toBeVisible();

  // STEP 1: Count all unfiltered rows (handle pagination)
  let allRows = [];
  let pageIndex = 1;

  while (true) {
    console.log(`📄 Checking Page ${pageIndex} ...`);

    const currentPageRows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
    const count = await currentPageRows.count();

    for (let i = 0; i < count; i++) {
      allRows.push(currentPageRows.nth(i));
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

  console.log(`📊 Total cases before filter: ${allRows.length}`);
  console.log('----------------------------------------------------');

  if (allRows.length === 0) {
    console.warn('⚠️ No rows found in the table.');
    return;
  }

  // Scroll table to right (so assign icon is visible)
  await patient_detail_table.evaluate(el => el.scrollLeft = el.scrollWidth);

  // STEP 2: Assign unassigned cases
  const doctors = ['Doctor Testing', 'Lara Johnson'];
  let doctorIndex = 0;

  for (let i = 0; i < allRows.length; i++) {
    const currentRow = allRows[i];
    const statusCell = currentRow.locator('td').nth(9); // 10th column is status
    const statusText = (await statusCell.textContent())?.trim().toLowerCase();
    console.log(`Row ${i + 1} - Status: ${statusText}`);

    if (statusText === 'unassigned') {
      const doctorToAssign = doctors[doctorIndex % doctors.length];
      doctorIndex++;

      console.log(`🔄 Assigning Row ${i + 1} to ${doctorToAssign}`);

      const assignIcon = currentRow.locator('span[aria-label="user-add"]');
      await assignIcon.scrollIntoViewIfNeeded();
      await assignIcon.click();

      // Open doctor dropdown
      const doctorDropdownTrigger = page.locator('//div[@class="ant-select ant-select-single ant-select-show-arrow ant-select-show-search" and .//span[text()="Select Doctor"]]');
      await doctorDropdownTrigger.click();

      const doctorDropdown = page.locator('//div[contains(@class,"ant-select-dropdown") and not(contains(@class,"hidden"))]');
      await expect(doctorDropdown).toBeVisible();
      await doctorDropdown.getByText(doctorToAssign, { exact: true }).click();

      // Confirm assign
      const confirmAssignButton = page.locator('//button//span[contains(text(), "Assign")]');
      await expect(confirmAssignButton).toBeVisible();
      await confirmAssignButton.click();

      console.log(`✅ Assigned Row ${i + 1} to ${doctorToAssign}`);
      console.log('----------------------------------------------------');

      await page.waitForTimeout(1000);
      await page.locator('//div[contains(text(), "Due Time")]').click(); // Random click to close popup
    }
  }
};
   */
  
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
  
   // ✅ Click Previous button to go back one page
    const prevButton = page.locator('.ant-pagination-prev:not(.ant-pagination-disabled)');
    if (await prevButton.isVisible()) {
    await prevButton.click();
    await page.waitForTimeout(1000);
    console.log('⬅️ Clicked Previous button to return to earlier page.');
    } 
    else {
    console.warn('⚠️ Previous button is disabled or not visible. Cannot go back.');
      }
    console.log('===================== Finished assigning the unassigned cases to doctors. =======================');
};

    
    
        
