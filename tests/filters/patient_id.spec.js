import{test, expect, _android} from '@playwright/test';
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

test('Checking patient id inside the table', async()=>{
    //Verify to have patient_id inside the table
    const patient_idintable = await page.locator('//thead[@class="ant-table-thead"]//th[2]//div[contains(text(),"Patient ID")]');
    await expect(patient_idintable).toBeVisible();
});

test('Checking all the filter options and giving inputs in patient_id filter', async()=>{
    //Check all the filter options is visible
    const filter_option = await page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');
    await expect(filter_option).toHaveCount(10);
    for(let i=0;i<10;i++)
    {
        await expect(filter_option.nth(i)).toBeVisible();
    }

    //Click the 1st filter - Patient_id and check the textbox is editable
    const Patient_idfilter = await (filter_option.nth(0)).locator('//input[@name="patientId"]');
    await Patient_idfilter.click();
    await expect(Patient_idfilter).toBeEditable();
    await page.waitForTimeout(1000);
     
    //Fill the text inside the patient_id textbox
    await Patient_idfilter.fill('2');
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
    const row_count = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
    const total_row_count = await row_count.count();
    console.log("Giving 2 in patient id filter and the case count = "+total_row_count);
    console.log(" ");

    let firstmatchedidcount = 0;

    //Handle empty case 
        if (total_row_count === 0) 
        {
            console.warn("No rows found for giving '2' in patient id filter — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
        }
        else 
        {
    //Locate the 2nd column(patientname) in each row
    for(let i=0; i<total_row_count; i++)
       {
         const patientid_column = row_count.nth(i).locator('td').nth(1);
         await expect(patientid_column).toBeVisible();
         //get the text
         const patientsid = await patientid_column.textContent();
              if (!patientsid || patientsid.trim() === '') 
                {
                    continue; // skip empty/fake rows
                }
                if (patientsid.includes('2')) 
                {
                    firstmatchedidcount++;
                    console.log("Row "+(i + 1) + " has id with '2': "+patientsid);
                    console.log("");
                }
       }
    }

       if(firstmatchedidcount!=total_row_count)
       {
        console.warn("ERROR-Mismatched: Found "+total_row_count +" row count but only "+firstmatchedidcount +" id is matching with number '2'. ")
        console.log("------------------------------------------------------------------");
        console.log(" ");
       }
       else
       {
        console.log("Filter Result : Row count is "+total_row_count+" and the id inclued number '2' count is "+firstmatchedidcount)
        console.log("------------------------------------------------------------------");
        console.log(" ");
       }

       //Filter the patient id with 2 number 
       await Patient_idfilter.press('Control+A');
       await Patient_idfilter.press('Backspace');
       await Patient_idfilter.fill('12');
       await page.waitForTimeout(3000);
       
       //Finding the no.of.rows inside the table                            
       const row_count1 = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
       const total_row_count1 = await row_count1.count();
       console.log("Giving 12 in patient id filter and the count = "+total_row_count1);
       console.log(" ");

       let secondmatchedidcount = 0;

       //Handle empty case 
        if (total_row_count1 === 0) 
        {
            console.warn("No rows found for giving '12' in patient id filter — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
        }
        else 
        {
       //Locate the 2nd column(patientid) in each row
       for(let i=0; i<total_row_count1; i++)
       {
         const patientid_column1 = row_count1.nth(i).locator('td').nth(1);
         await expect(patientid_column1).toBeVisible();
         //get the text
         const patientsid1 = await patientid_column1.textContent();
              if (!patientsid1 || patientsid1.trim() === '') 
                {
                continue; // skip empty/fake rows
                }
                if (patientsid1.includes('12')) {
                    secondmatchedidcount++;
                console.log("Row "+(i + 1) + " has number with '12': "+patientsid1);
                console.log("");
                }
       }
    }

       //Warn if count mismatched
       if(secondmatchedidcount != total_row_count1)
       {
        console.warn("ERROR-Mismatched: Found "+total_row_count1 +" row count but only "+secondmatchedidcount +" id is matching with number '12'. ");
        console.log("------------------------------------------------------------------");
        console.log(" ");
       }
       else
       {
        console.log("Filter Result : Row count is "+total_row_count1+" and the id inclued '12' count is "+secondmatchedidcount);
        console.log("------------------------------------------------------------------");
        console.log(" ");
       }

         //Pass full id inside patient id filter and check it's working

         // Filter the patient id with 0120
            await Patient_idfilter.press('Control+A');
            await Patient_idfilter.press('Backspace');
            await Patient_idfilter.fill('0120');
            await page.waitForTimeout(2000);
           
                const expectedid = '0120';  

        //Finding the no.of.rows inside the table
            const row_count2 = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
            const total_row_count2 = await row_count2.count();
            console.log("Giving full id "+expectedid+" in patientid filter and the count is = "+total_row_count2);
            console.log("");
            
            //Handle empty row
            if (total_row_count1 === 0) 
            {
            console.warn("No rows found for giving "+expectedid+" in patient id filter — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
            }
            else if(total_row_count2 !== 1)
            {
                console.warn("ERROR-Mismatched: Expected 1 result after filtering the id but received: "+total_row_count2)
                console.log("");
            }
            else
            {
                console.log("Checking when filtering with full id the count is 1 and it is: "+total_row_count2)
                console.log("");
                // Optionally verify id in the first row
                const patientid_column2 = await row_count2.nth(0).locator('td').nth(1);
                const id = await patientid_column2.textContent();
                if (!id || !id.trim().includes(expectedid)) 
                    {
                    //throw new Error("Row contains unexpected id: "+(id)+". Expected id is "+(expectedid)+".");
                    console.warn("Soft Assert Failed: Expected ID "+expectedid+" but found "+id);
                    expect.soft(id?.trim()).toContain(expectedid);
                    } 
                else 
                    {
                    console.log("Expected id: "+(expectedid)+". Getting Patient ID: "+(id)+".");
                    console.log("");
                    console.log("ID matched: "+(id)+"");
                    }
            }
              console.log("------------------------------------------------------------");  
        });



    