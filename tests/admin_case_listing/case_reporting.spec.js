import {test, expect} from '@playwright/test'
import { url, vaildlogin, logout, checking_ifsuccessfully_loginintothedashbaord } from '../admin_login.helper';
import { choosedate } from '../choosedate.spec';
import { edit } from './edit.spec';
import { morecase_details } from './morecase_details.spec';
import { generatereport } from './generate_report.spec';
import { downloadCase, downloadReport } from './downloads.spec';

let page;
test.beforeAll('Login using URL', async({browser})=>{
    page = await browser.newPage();
    //calling the url function
    await url(page);

    //Calling valid function
    await vaildlogin(page);

    //Checking the cases text is visible inside the admin dashboard
    await checking_ifsuccessfully_loginintothedashbaord(page);

    //Selecting From date and To date for getting case
    await choosedate(page);

    //Selecting 50/page
    await page.locator('(//div[@class="ant-select-selector"])[7]').click();
    await page.locator('//div[contains(text(), "50 / page")]').click();

});   

/*
test.afterAll('Logout from the application', async()=>{
    //calling the logout function
    await logout(page);
});
*/
test('Checking the case listing table is visible', async()=>{
    //Check the Patient details table is visible
        const patient_detail_table = page.locator('.ant-table-container');
        await expect(patient_detail_table).toBeVisible();
});
    
    //Self-Assigning the cases
test.skip('Counting the number of cases and do self-assign action', async()=>{
    
    //Finding the no.of.rows inside the table                           
        const row_count = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count = await row_count.count();
        console.log("No.of cases present in the row = "+total_row_count);
        console.log(" ");
    

    if (total_row_count === 0) 
    {
    console.warn("No rows found inside the table of case listing — table is empty.");
    console.log("------------------------------------------------------------------");
    console.log(" ");
    }
    else
    {
        let assignedCount = 0;

        for (let i = 0; i < total_row_count; i++) 
            {
        if (assignedCount === 2) break; // Stop after 2 assignments

      const currentRow = row_count.nth(i);
      const statusCell = currentRow.locator('td').nth(9);
      const status_text = (await statusCell.textContent())?.trim().toLowerCase();
      console.log("Row " + (i + 1) + " - Status: " + (status_text || 'N/A'));
      console.log(" ");

      console.log("Try to Assign the case in Row " + (i + 1));
      console.log(" ");

      // Click Assign icon
      const assignIcon = currentRow.locator('span[aria-label="user-add"]');
      await assignIcon.scrollIntoViewIfNeeded();
      await assignIcon.click();
      await page.waitForTimeout(2000);
      console.log("Clicked Assign icon for Row " + (i + 1));
      console.log(" ");

      // Self-Assign
      const selfAssign_btn = page.locator('//button[@type="button"]//div[@class="ant-switch-handle"]');
      await expect(selfAssign_btn).toBeVisible();
      await selfAssign_btn.click();
      console.log("Clicked Self-assigned toggle button");
      console.log(" ");

      // Confirm Assign
      const confirmAssignButton = page.locator('//button//span[contains(text(), "Assign")]');
      await expect(confirmAssignButton).toBeVisible();
      await confirmAssignButton.click();
      console.log("Successfully Self-assigned Row " + (i + 1) + ".");
      console.log(" ");
      await page.waitForTimeout(500);
      const assigned_notification = await page.locator('//div[contains(text(),"Case has been assigned to you!")]');
      await expect.soft(assigned_notification).toBeVisible();
      await page.waitForTimeout(500);

      // Click elsewhere to close assign dialog
      await page.locator('//div[contains(text(), "Due Time")]').click();

      // Verify assigned doctor
      const updatedAssigneddoctor_cell = currentRow.locator('td').nth(6); // Adjust index as needed
      const assignedDoctor = (await updatedAssigneddoctor_cell.textContent())?.trim().toLowerCase();
      console.log("Assigned doctor name = " + assignedDoctor);
      console.log(" ");

      if (assignedDoctor.includes('nivethitha hemachandran')) {
        console.log("Case in row " + (i + 1) + " successfully assigned to: " + assignedDoctor);
      } else {
        console.warn("Case in row " + (i + 1) + " not assigned correctly. Found: " + assignedDoctor);
      }

      console.log("------------------------------------------------------------");
      assignedCount++;
      await page.waitForTimeout(500);
    }

    if (assignedCount === 0) {
      console.warn("No cases were assigned.");
    }
  }

});

    //Editing the case in Row 1
test.skip('Clicking the Edit button and perform edit actions', async()=>{
    //Calling "edit" function
    await edit(page);
});

    //View Row 1 "More case details" and compare the Values in Edit
test.skip('Clicking the More case details button and get the value and compare with edit inputs whether the values are same', async()=>{
    //Calling "morecase_details" function
    await morecase_details(page);
});

    //Generate the Report in Row 1
test.skip('Clicking the Generate report button and perform reporting actions', async()=>{
    //Calling "generate_report" function
    await generatereport(page);
});

    //Download the First case
test('Download the case', async()=>{
    //Calling the "Download Case" function
    await downloadCase(page);

});

    //Download the First Reports
test("Download the Report",async()=>{
    //Calling the "Download Report" function
    await downloadReport(page);
});


























































































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