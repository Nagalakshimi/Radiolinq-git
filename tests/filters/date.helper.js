import{test, expect} from '@playwright/test';
import { choosedate } from '../helper/choosedate.helper';

exports.datefilters = async function (page) {
  

    //Verify to have Date Uploaded inside the table
    const date_uploadedintable = await page.locator('//thead[@class="ant-table-thead"]//th[6]//div[contains(text(),"Date Uploaded")]');
    await expect.soft(date_uploadedintable).toBeVisible();

    //Check the filter options is visible and choose random date
    const filter_option = await page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');

    //Click the 9th filter - From Date
    const from_datefilter = await (filter_option.nth(8)).locator('//input[@name="fromDate"]');
    await from_datefilter.click();
    await page.waitForTimeout(1000);
    
    await page.waitForSelector('.ant-picker-panel-container', {state: 'visible'});
    const monthlocator_jul = page.locator('//div[@class="ant-picker-date-panel"]//div[@class="ant-picker-header-view"]//button[contains(text(),"Jul")]').first();
    await expect.soft(monthlocator_jul).toBeVisible();

    //Choose the date(09-jul-2025)
    const jul09 = await page.locator('//div[@class="ant-picker-body"]//td[@title="2025-07-09"]').first();
    await jul09.click();
    await page.waitForTimeout(1000);

    //Click the 10th filter - To date
    const to_datefilter = await (filter_option.nth(9)).locator('//input[@name="toDate"]');
    await to_datefilter.click();
    await page.waitForTimeout(1000);

    //Choose the date(09-jul-2025)
    await page.locator('(//div[@class="ant-picker-body"])[2]//td[@title="2025-07-09"]').click();
    await page.waitForTimeout(1000);

    // Wait for cases to load and filter the row count
    const row_locator_jul9 = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
    const total_row_count_jul9 = await row_locator_jul9.count();
    console.log("Selected From Date: 09-07-2025");
    console.log("Selected To Date: 09-07-2025 ");
    console.log("Filtered Row Count: " + total_row_count_jul9);
    console.log(" ");

    let matchedDateCount = 0;

    if (total_row_count_jul9 === 0) {
        console.warn("No rows found — table is empty.");
        console.log("----------------------------------------------------");
        console.log(" ");
    } else {
        for (let i = 0; i < total_row_count_jul9; i++) {
            const date_uploaded_cell = row_locator_jul9.nth(i).locator('td').nth(5); // 6th column is "Date Uploaded"
            await expect.soft(date_uploaded_cell).toBeVisible();
            const date_uploaded_text = await date_uploaded_cell.textContent();
            //console.log("Date text content : "+date_uploaded_text);

            if (!date_uploaded_text || date_uploaded_text.trim() === '') {
                continue; // skip empty rows
            }

            const trimmedDate = date_uploaded_text.trim();
            const dateOnly = trimmedDate.split(' ')[0]; // Extracts '09-Jul-25'

            if (dateOnly === '09-Jul-25') {
                matchedDateCount++;
                console.log("Row " + (i + 1) + " has Date Uploaded: " + trimmedDate);
                console.log("");
            }
        }
    }

    // Final check
    if (matchedDateCount !== total_row_count_jul9) {
        console.warn("ERROR - Mismatch: Found " + total_row_count_jul9 + " rows, but only " + matchedDateCount + " match with date 09-07-2025.");
        console.log("----------------------------------------------------");
        console.log(" ");
    } else {
        console.log("Filter Result: All " + total_row_count_jul9 + " rows matched with date 09-07-2025.");
        console.log("----------------------------------------------------");
        console.log(" ");
    }


// Choosing the month (From: 26 May 2025 To: 09 Jul 2025) and counting cases across pages
    console.log("Selecting From Date: 26-May-2025");

    // Click on From Date
    await page.locator('//input[@name="fromDate"]').click();

    // Click month selector and choose May
    await page.locator('(//div[@class="ant-picker-header-view"])[1]//button[@class="ant-picker-month-btn"]').click();
    await page.locator('//td//div[contains(text(),"May")]').click();

    // Ensure correct month and year are selected
    await expect.soft(page.locator('(//div[@class="ant-picker-header-view"])[1]//button[contains(text(), "May")]')).toBeVisible();
    await expect.soft(page.locator('(//div[@class="ant-picker-header-view"])[1]//button[contains(text(), "2025")]')).toBeVisible();

    // Select 26 May 2025
    await page.locator('(//div[@class="ant-picker-body"])[1]//td[@title="2025-05-26"]').click();
    await page.waitForTimeout(500);

    console.log("From Date selected: 26-May-2025");

    // Click on To Date
    await page.locator('//input[@name="toDate"]').click();
    await page.waitForTimeout(500);

    // Choose July
    await page.locator('(//div[@class="ant-picker-header-view"])[2]//button[@class="ant-picker-month-btn"]').click();
    await page.locator('//td//div[contains(text(),"Jul")]').click();

    // Select 09 Jul 2025
    await page.locator('(//div[@class="ant-picker-body"])[2]//td[@title="2025-07-09"]').click();
    await page.waitForTimeout(1000);

    console.log("To Date selected: 09-Jul-2025");

    // Start counting paginated rows
    let totalRowCount = 0;
    let pageNumber = 1;

    console.log("Counting rows across pages...");

    while (true) {
    const rowsOnPage = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row")]');
    const rowCount = await rowsOnPage.count();
    totalRowCount += rowCount;

    console.log("Page "+pageNumber+": Rows = "+rowCount+", Running Total = "+totalRowCount);

    const nextButton = page.locator('.ant-pagination-next:not(.ant-pagination-disabled)');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      pageNumber++;
    } else {
      break; // No more pages
    }
  }

    // Final Result
    console.log("------------------------------------------------");
    console.log("Total number of cases between 26-May-2025 and 09-Jul-2025: "+totalRowCount);
    console.log("------------------------------------------------");

// Just Checking the UI once we click the previous year
    
    console.log("Selecting From Date: 13-Nov-2024");

  // Click on From Date
    await page.locator('//input[@name="fromDate"]').click();

  // Click year selector and choose 2024
    await page.locator('(//div[@class="ant-picker-header-view"])[1]//button[@class="ant-picker-year-btn"]').click();
    await page.locator('//td//div[contains(text(),"2024")]').click();

  // Click month selector and choose May
    await page.locator('(//div[@class="ant-picker-header-view"])[1]//button[@class="ant-picker-month-btn"]').click();
    await page.locator('//td//div[contains(text(),"Nov")]').click();

  // Ensure correct month and year are selected
    await expect.soft(page.locator('(//div[@class="ant-picker-header-view"])[1]//button[contains(text(), "Nov")]')).toBeVisible();
    await expect.soft(page.locator('(//div[@class="ant-picker-header-view"])[1]//button[contains(text(), "2024")]')).toBeVisible();

  // Select 13 Nov 2024
    await page.locator('(//div[@class="ant-picker-body"])[1]//td[@title="2024-11-13"]').click();
    await page.waitForTimeout(500);

  //Asserting 13 Nov 2024 is visible
    const Selecteddate= await page.locator('//div[@class="ant-picker-input"]//input[@value="13/11/2024"]');
    await expect.soft(Selecteddate).toBeVisible();
    console.log('');
    console.log("From date '13-Nov-2024' is visible");
    await page.waitForTimeout(2000);

    //Calling choose date function to do further actions
    await choosedate(page);

}
