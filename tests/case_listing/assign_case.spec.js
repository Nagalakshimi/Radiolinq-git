const {expect} =  require ('@playwright/test');

exports.assigncases = async function (page) {

    //Check the Patient details table is visible
        const patient_detail_table = page.locator('.ant-table-container');
        await expect(patient_detail_table).toBeVisible();

    
        //Finding the no.of.rows inside the table                           
            const row_count = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
            const total_row_count = await row_count.count();
            console.log("No.of cases present in the row = "+total_row_count);
            console.log(" ");

        //Scroll the table to view and access the assign case button
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
        const doctors = ['Doctor Testing', 'Hemanath Dr'];
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
      const doctorDropdownTrigger = page.locator('//div[@class="ant-select ant-select-single ant-select-show-arrow ant-select-show-search"]');////span[@class="ant-select-selection-search"]//input[@id="rc_select_30"] //span[contains(text(), "Select Doctor")]
      await doctorDropdownTrigger.click();
      console.log("Opened doctor dropdown");

      const doctorDropdown = page.locator('//div[contains(@class,"ant-select-dropdown") and not(contains(@class,"hidden"))]');
      await expect(doctorDropdown).toBeVisible();
      await doctorDropdown.getByText(doctorToAssign, { exact: true }).click();

      // Click final Assign button
      const confirmAssignButton = page.locator('//button//span[contains(text(), "Assign")]');
      await confirmAssignButton.click();
      console.log("Successfully assigned Row "+(i + 1)+" to "+doctorToAssign);
      console.log("------------------------------------------------------------");

      await page.waitForTimeout(1000); // Optional: allow time for UI update
      await page.locator('//div[contains(text(), "Due Time")]').click();
    }
  }
            }
        }

        /*
        // Click on the assign button
        const assigncase_button = await page.locator('(//span[@aria-label="user-add"])[1]');
        await assigncase_button.click();
        console.log("Clicked assign button for row "+(i + 1));

        //Click the Select doctor dropdown
        await page.locator('//span[contains(text(), "Select Doctor")]').click();
        console.log("Opened doctor dropdown for row "+(i + 1));

        // Wait for dropdown
        const doctor_dropdown = page.locator('//div[contains(@class,"ant-select-dropdown") and not(contains(@class,"hidden"))]');
        await expect(doctor_dropdown).toBeVisible();

        // Select the doctor by name
        await doctor_dropdown.getByText(doctorToAssign, { exact: true }).click();

        // Click Assign button
        const assign_button = page.locator('//button//span[contains(text(), "Assign")]');
        await assign_button.click();

        console.log("Assigned to "+doctorToAssign);
        await page.waitForTimeout(1000); // wait for UI update if necessary
         }
    }
            }
    */
        
