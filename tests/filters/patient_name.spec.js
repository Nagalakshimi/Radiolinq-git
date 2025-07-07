import { test, expect } from '@playwright/test';
import { Console } from 'console';
import { url, invaildlogin, vaildlogin, logout, checking_ifsuccessfully_loginintothedashbaord } from '../admin_login.helper';


let page;
test.beforeAll('Login using URL', async({browser})=>{
    page = await browser.newPage();
    //calling the url function
    await url(page);

    //Calling invaildlogin function
    await invaildlogin(page);

    //Calling valid function
    await vaildlogin(page);

   //Checking the cases text is visible inside the admin dashboard
    await checking_ifsuccessfully_loginintothedashbaord(page);

    //Selecting 50/page
    await page.locator('(//div[@class="ant-select-selector"])[7]').click();
    await page.locator('//div[contains(text(), "50 / page")]').click();

});   

test.afterAll('Logout from the application', async()=>{
    //calling the logout function
    await logout(page);
});

test('Case filter button',async()=>{

        //Case filter option is visible
        const casetext = await page.locator('.case-filter-form__toggle-button');
        await expect(casetext).toBeVisible();
});


test('Checking patient detail table is visible', async()=>{
    //Check the Patient details table is visible
      const patient_detail_table = page.locator('.ant-table-container');
      await expect(patient_detail_table).toBeVisible();
});

test('Checking patient name inside the table', async()=>{
     //Verify to have patient_name inside the table
      const patient_nameintable = await page.locator('//thead[@class="ant-table-thead"]//th[3]//div[contains(text(),"Patient Name")]');
      await expect(patient_nameintable).toBeVisible();

});

    
test('Checking all the filter options and giving inputs in patient_name filter', async()=>{
    //Check all the filter options is visible
    const filter_option = await page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');
    await expect(filter_option).toHaveCount(10);
    for(let i=0;i<10;i++)
    {
        await expect(filter_option.nth(i)).toBeVisible();
    }

    //Click the 2nd filter - Patient_name and check the textbox is editable
     const Patient_namefilter = await (filter_option.nth(1)).locator('//input[@name="patientName"]');
     await Patient_namefilter.click();
     await expect(Patient_namefilter).toBeEditable();
     await page.waitForTimeout(1000);
     
     //Fill the text inside the patient_name textbox
     await Patient_namefilter.fill('S');
     await page.waitForTimeout(4000);

    //Finding the no.of.rows inside the table                           
       const row_count = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
       const total_row_count = await row_count.count();
       console.log("Giving S in patient name filter and the count = "+total_row_count);
       console.log(" ");

       let firstmatchednamecount = 0;

       //Handle empty case 
        if (total_row_count === 0) 
        {
            console.warn("No rows found for giving 'S' in patient name filter — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
        }
        else 
        {
    //Locate the 3rd column(patientname) in each row
       for(let i=0; i<total_row_count; i++)
       {
         const patientname_column = row_count.nth(i).locator('td').nth(2);
         await expect(patientname_column).toBeVisible();
         //get the text
             const patientsname = await patientname_column.textContent();
              if (!patientsname || patientsname.trim() === '') 
                {
                    continue; // skip empty/fake rows
                }
                if (patientsname.toLowerCase().includes('s')) 
                {
                    firstmatchednamecount++;
                    console.log("Row "+(i + 1) + " has name with 's': "+patientsname);
                    console.log("");
                }
       }
    }

       if(firstmatchednamecount!=total_row_count)
       {
        console.warn("ERROR-Mismatched: Found "+total_row_count +" row count but only "+firstmatchednamecount +" name is matching with 'S'. ")
        console.log("------------------------------------------------------------------");
        console.log(" ");
       }
       else
       {
        console.log("Filter Result : Row count is "+total_row_count+" and the name inclued 'S' count is "+firstmatchednamecount)
        console.log("------------------------------------------------------------------");
        console.log(" ");
       }

       //Filter the patient name with 2 letter 
       await Patient_namefilter.press('Control+A');
       await Patient_namefilter.press('Backspace');
       await Patient_namefilter.fill('SA');
       await page.waitForTimeout(3000);
       
       //Finding the no.of.rows inside the table                            
       const row_count1 = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
       const total_row_count1 = await row_count1.count();
       console.log("Giving SA in patient name filter and the count = "+total_row_count1);
       console.log(" ");

       let secondmatchednamecount = 0;

       //Handle empty case 
        if (total_row_count1 === 0) 
        {
            console.warn("No rows found for giving 'SA' in patient name filter — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
        }
        else 
        {
       //Locate the 3rd column(patientname) in each row
       for(let i=0; i<total_row_count1; i++)
       {
         const patientname_column1 = row_count1.nth(i).locator('td').nth(2);
         await expect(patientname_column1).toBeVisible();
         //get the text
             const patientsname1 = await patientname_column1.textContent();
              if (!patientsname1 || patientsname1.trim() === '') 
                {
                continue; // skip empty/fake rows
                }
                if (patientsname1.toLowerCase().includes('sa')) {
                    secondmatchednamecount++;
                console.log("Row "+(i + 1) + " has name with 'sa': "+patientsname1);
                console.log("");
                    }
       }
    }

       //Warn if count mismatched
       if(secondmatchednamecount != total_row_count1)
       {
        console.warn("ERROR-Mismatched: Found "+total_row_count1 +" row count but only "+secondmatchednamecount +" name is matching with 'SA'. ")
        console.log("------------------------------------------------------------------");
        console.log(" ");
       }
       else
       {
        console.log("Filter Result : Row count is "+total_row_count1+" and the name inclued 'SA' count is "+secondmatchednamecount)
        console.log("------------------------------------------------------------------");
        console.log(" ");
       }

         //Pass single name inside patient name filter and check it's working

         // Filter the patient name with Sahil
            await Patient_namefilter.press('Control+A');
            await Patient_namefilter.press('Backspace');
            await Patient_namefilter.fill('CHINNA');
            await page.waitForTimeout(2000);
           
                const expectedName = 'Chinna';  

            // Get all rows in the table
            const rowLocator = page.locator('//div[@class="ant-table-body"]//tr[contains(@class, "ant-table-row")]');
            const totalRowCount = await rowLocator.count();

            console.log("Filtered with name "+expectedName+" — Total rows found: "+totalRowCount);
            console.log("------------------------------------------------------------");

           let matchedNameCount = 0;

            if (totalRowCount === 0) 
                {
                console.warn("No rows found when filtering with name "+expectedName);
                } 
            else 
            {
                for (let i = 0; i < totalRowCount; i++) {
                const patientNameCell = rowLocator.nth(i).locator('td').nth(2); // 3rd column (index 2)
                await expect(patientNameCell).toBeVisible();

                const cellText = await patientNameCell.textContent();
                const trimmedText = cellText?.trim() || '';

                if (trimmedText.toLowerCase().includes(expectedName.toLowerCase())) 
                {
                matchedNameCount++;
                console.log("Row "+(i + 1)+" matched: "+trimmedText);
                } 
                else 
                {
                console.warn("Row "+(i + 1)+" does NOT match "+expectedName+". Found: "+trimmedText);
                expect.soft(trimmedText.toLowerCase()).toContain(expectedName.toLowerCase()); // Soft assertion
                }
    }

            // Final summary
            console.log("");
            if (matchedNameCount === totalRowCount) 
            {
            console.log("All "+matchedNameCount+" rows matched expected name "+expectedName);
            } else 
            {
            console.warn(" Mismatch: "+matchedNameCount+" out of "+totalRowCount+" rows matched "+expectedName);
            }
  }

            console.log("------------------------------------------------------------");

    /*
        //Finding the no.of.rows inside the table
            const row_count2 = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
            const total_row_count2 = await row_count2.count();
            console.log("Giving single name in patient name filter and the count is = "+total_row_count2);
            console.log("");
            //await expect.soft(total_row_count2).toBe(1);
            if (total_row_count2 === 0) 
                {
                console.warn("Total row count is = "+total_row_count2+"found when filtering by name: " + expectedName);
                console.log("");
                }
            else if(total_row_count2 !== 1)
            {
                console.warn("ERROR - Expected 1 result after filtering the name but received: "+total_row_count2)
                console.log("");
            }
            else
            {
                console.log("Checking when filtering with single name the count is 1 and it is: "+total_row_count2)
                console.log("");
                // Optionally verify name in the first row
                const patientname_column2 = await row_count2.nth(0).locator('td').nth(2);
                const nameText = await patientname_column2.textContent();
                if (!nameText || !nameText.trim().toLowerCase().includes(expectedName.toLowerCase())) 
                    {
                    throw new Error("Row contains unexpected name: "+(nameText)+". Expected name is "+(expectedName)+".");
                } 
                else 
                {
                    console.log("Expected name: "+(expectedName)+". Getting text name: "+(nameText)+".");
                    console.log("");
                    console.log("Name matched: "+(nameText)+"");
                }
            }

         */  
    });


