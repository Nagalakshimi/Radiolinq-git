const {test, expect} = require ('@playwright/test');

exports.selfAssign = async function (page) {
    
    console.log('** ========================== Self Assigning =========================== **');

// Locate all rows
const rowLocator = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');

// Step 1: Count total rows across all pages
let totalRowCount = 0;
let pageNum = 1;

while (true) {
  const currentRows = await rowLocator.count();
  totalRowCount += currentRows;
  console.log(`Page ${pageNum}: Found ${currentRows} rows`);

  const nextBtn = page.locator('.ant-pagination-next:not(.ant-pagination-disabled)');
  if (await nextBtn.isVisible()) {
    await nextBtn.click();
    await page.waitForTimeout(1000);
    pageNum++;
  } else {
    break;
  }
}
console.log(`Total number of rows across all pages = ${totalRowCount}`);
console.log("------------------------------------------------------------");

// Step 2: Click Page 1 button to go back first page
    const page1_Button = page.locator('//ul[contains(@class,"ant-table-pagination")]//li[@class="ant-pagination-item ant-pagination-item-1"]');
    if (await page1_Button.isVisible()) {
    await page1_Button.click();
    await page.waitForTimeout(1000);
    console.log('⬅️ Clicked Page no.1 button to return first page.');
    } 
    else {
    console.warn('⚠️ Page no.1 button is disabled or not visible. Cannot go back.');
      }
console.log("------------------------------------------------------------");

// Step 3: Perform action on up to 2 unassigned cases from first page
const firstPageRows = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row-level-0")]');
const firstPageRowCount = await firstPageRows.count();

if (firstPageRowCount === 0) {
  console.warn("No rows found inside the table on the first page.");
} else {
  let assignedCount = 0;

  for (let i = 0; i < firstPageRowCount; i++) {
    if (assignedCount === 2) break;

    const currentRow = firstPageRows.nth(i);
    const statusCell = currentRow.locator('td').nth(9);
    const statusText = (await statusCell.textContent())?.trim().toLowerCase();

    console.log(`Row ${i + 1} - Status: ${statusText || 'N/A'}`);
   // if (!statusText || statusText.includes('assigned')) continue;

    console.log(`Try to assign the case in Row ${i + 1}`);

    const assignIcon = currentRow.locator('span[aria-label="user-add"]');
    await assignIcon.scrollIntoViewIfNeeded();
    await assignIcon.click();
    await page.waitForTimeout(2000);

    const selfAssignBtn = page.locator('//button[@type="button"]//div[@class="ant-switch-handle"]');
    await expect(selfAssignBtn).toBeVisible();
    await selfAssignBtn.click();

    const confirmAssignBtn = page.locator('//button//span[contains(text(), "Assign")]');
    await expect(confirmAssignBtn).toBeVisible();
    await confirmAssignBtn.click();
    await page.waitForTimeout(500);

    const notification = page.locator('//div[contains(text(),"Case has been assigned to you!")]');
    await expect.soft(notification).toBeVisible();
    await page.locator('//div[contains(text(), "Due Time")]').click();

    const assignedDoctorCell = currentRow.locator('td').nth(6);
    const doctorName = (await assignedDoctorCell.textContent())?.trim().toLowerCase();

    if (doctorName.includes('nivethitha hemachandran')) {
      console.log(`Row ${i + 1} successfully assigned to: ${doctorName}`);
    } else {
      console.warn(`Row ${i + 1} not correctly assigned. Found: ${doctorName}`);
    }

    console.log("------------------------------------------------------------");
    assignedCount++;
    await page.waitForTimeout(500);
  }

  if (assignedCount === 0) {
    console.warn("No cases were assigned.");
  }
}

}




















































































/*
        for (let i = 0; i < total_row_count; i++) 
        {
            const currentRow = row_count.nth(i);
            const statusCell = currentRow.locator('td').nth(9);
            const status_text = (await statusCell.textContent())?.trim().toLowerCase();
            console.log("Row "+(i + 1)+" - Status: "+(status_text));
            console.log(" ");

        if (status_text?.toLowerCase() === 'unassigned') 
        {
            console.log("Try to Self-Assign the case");

            // Scroll into view and click the Assign icon in the current row
            const assignIcon = currentRow.locator('span[aria-label="user-add"]');
            await assignIcon.scrollIntoViewIfNeeded();
            await assignIcon.click();
            await page.waitForTimeout(2000);
            console.log("Clicked Assign icon for Row "+(i + 1));

            //Self-Assign steps

            //Clicking on self-assign button
            const selfAssign_btn = await page.locator('//button[@type="button"]//div[@class="ant-switch-handle"]');
            await expect(selfAssign_btn).toBeVisible();
            await selfAssign_btn.click();

            //Clicking on Final Assign button
            const confirmAssignButton = page.locator('//button//span[contains(text(), "Assign")]');
            await expect(confirmAssignButton).toBeVisible();
            await confirmAssignButton.click();
            console.log("Successfully Self-assigned Row "+(i + 1)+" . ");
            await page.waitForTimeout(1000);
            await page.locator('//div[contains(text(), "Due Time")]').click(); //After assign it's does'nt auto close so click on random place

            // Verify that the doctor's name is updated to "Nivethitha Hemachandran"
            const updatedAssigneddoctor_cell = currentRow.locator('td').nth(6); 
            const assignedDoctor = (await updatedAssigneddoctor_cell.textContent())?.trim().toLowerCase();
            console.log("Assigned doctor name = "+assignedDoctor);

            if (assignedDoctor.includes('nivethitha hemachandran')) 
                {
                 console.log("Case in row "+(i + 1)+" successfully assigned to: "+assignedDoctor);
                 console.log("------------------------------------------------------------");
                } 
            else 
                {
                 console.warn("Case in row "+(i + 1)+" not assigned correctly. Found: "+assignedDoctor);
                 console.log("------------------------------------------------------------");
                }

            assignedCount++;

            // wait after assignment
            await page.waitForTimeout(500);

            // Break after assigning two cases
            if (assignedCount === 2) {
            console.log("Assigned 2 unassigned cases. Exiting loop.");
            break;
      }

    }

        }
    }

    });
    */