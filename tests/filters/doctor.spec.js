import{test, expect} from '@playwright/test';
import { url, invaildlogin, vaildlogin, logout, checking_ifsuccessfully_loginintothedashbaord } from '../admin_login.helper';
import { assigncases } from '../case_listing/assign_case.spec';

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

    
test('Assign the cases to doctor if unassigned',async()=>{
    //Calling assign case function admin_login.helper
    await assigncases(page);
});

test('Checking Assigned doctor option is visible inside the table', async()=>{
    //Verify to have assigned doctor option inside the table
    const assigned_doctor = await page.locator('//thead[@class="ant-table-thead"]//th[7]//div[contains(text(),"Assigned Doctor")]');
    await expect(assigned_doctor).toBeVisible();
});

test('Checking all the filter options and giving inputs in assigned_doctor filter', async()=>{
    //Check all the filter options is visible
    const filter_option = await page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');
    await expect(filter_option).toHaveCount(10);
    for(let i=0;i<10;i++)
    {
        await expect(filter_option.nth(i)).toBeVisible();
    }

    //Click the 6th filter - Doctor and check the dropdown is visible
    const Doctorfilter = await (filter_option.nth(5));
    await Doctorfilter.click();
    
    //Check if the dropdown is visible
    const doctor_dropdown = await page.locator('.rc-virtual-list-holder-inner');
    await expect(doctor_dropdown).toBeVisible();
    console.log("Doctor dropdown is visible");
    console.log("");
    
    //Get all the Doctor text content
    const doctor_dropdown_text = await page.locator('//div[@class="rc-virtual-list-holder-inner"]//div[@class="ant-select-item ant-select-item-option"]//div[@class="ant-select-item-option-content"]');
    const get_doctors_text = await doctor_dropdown_text.allTextContents();
    const doctor_dropdown_text_count = await get_doctors_text.length;
    console.log("Total no.of dropdowns present in Doctors filter = "+doctor_dropdown_text_count);
    console.log("");
    console.log("Dropdown options = "+get_doctors_text);
    console.log("");

    //Click "Doctor Testing" in dropdown
    await page.locator('//div[contains(text(),"Doctor Testing")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
        const row_count_doctorTesting = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count_doctorTesting = await row_count_doctorTesting.count();
        console.log("Selecting 'Doctor Testing' in the Doctor filter and the row count = "+total_row_count_doctorTesting);
        console.log(" ");
    
        let matcheddoctorcount_doctorTesting = 0;

    //Handle empty case 
        if (total_row_count_doctorTesting === 0) 
        {
        console.warn("No rows found for 'Doctor Testing' filter — table is empty.");
        console.log("------------------------------------------------------------------");
        console.log(" ");
        } 
        else    
        {
    //Locate the 7th column(Assigned Doctor) in each row
        for(let i=0; i<total_row_count_doctorTesting; i++)
           {
             const AssignedDoctor_column_doctorTesting = row_count_doctorTesting.nth(i).locator('td').nth(6);
             await expect(AssignedDoctor_column_doctorTesting).toBeVisible();
             //get the text
             const AssignedDoctor_name_doctorTesting = await AssignedDoctor_column_doctorTesting.textContent();
             
                  if (!AssignedDoctor_name_doctorTesting || AssignedDoctor_name_doctorTesting.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (AssignedDoctor_name_doctorTesting.toLowerCase().includes('doctor testing')) 
                    {
                        matcheddoctorcount_doctorTesting++;
                        console.log("Row "+(i + 1) + " having 'Assigned_Doctor_name': "+AssignedDoctor_name_doctorTesting.trim());
                        console.log("");
                    }
           }
        }

        if(matcheddoctorcount_doctorTesting!=total_row_count_doctorTesting)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_doctorTesting +" row count but only "+matcheddoctorcount_doctorTesting +" is matching with 'Doctor Testing' in Assigned Doctor name. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_doctorTesting+" and the Assigned Doctor name inclued 'Doctor Testing' count is "+matcheddoctorcount_doctorTesting)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }


    //Click "Dr Hemanath" in dropdown
    await page.locator('(//span[@class="ant-select-selection-item"])[1]').click(); //clicking the dropdown
    await page.locator('//div[contains(text(),"Dr Hemanath")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
    const row_count_DrHemanath = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
    const total_row_count_DrHemanath = await row_count_DrHemanath.count();
    console.log("Selecting 'Dr Hemanath' in the Doctor filter and the row count = "+total_row_count_DrHemanath);
    console.log(" ");
    
        let matcheddoctorcount_DrHemanath = 0;

    // Handle empty case 
        if (total_row_count_DrHemanath === 0) 
        {
            console.warn("No rows found for 'Dr Hemanath' filter — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
        }
        else 
        {
    //Locate the 7th column(Assgined Doctor) in each row
        for(let i=0; i<total_row_count_DrHemanath; i++)
           {
             const Doctor_column_DrHemanath = row_count_DrHemanath.nth(i).locator('td').nth(6);
             await expect(Doctor_column_DrHemanath).toBeVisible();
             //get the text
             const Doctor_name_DrHemanath = await Doctor_column_DrHemanath.textContent();
             
                  if (!Doctor_name_DrHemanath || Doctor_name_DrHemanath.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (Doctor_name_DrHemanath.toLowerCase().includes('dr hemanath')) 
                    {
                        matcheddoctorcount_DrHemanath++;
                        console.log("Row "+(i + 1) + " having 'Dr Hemanath': "+Doctor_name_DrHemanath.trim());
                        console.log("");
                    }
           }
        }

        if(matcheddoctorcount_DrHemanath!=total_row_count_DrHemanath)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_DrHemanath +" row count but only "+matcheddoctorcount_DrHemanath +" is matching with 'Dr Hemanath' in Assigned Doctor name. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_DrHemanath+" and the Assigned Doctor name inclued 'Dr Hemanath' count is "+matcheddoctorcount_DrHemanath)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }

    //Click the Doctor filter dropdown
    await page.locator('(//span[@class="ant-select-selection-item"])[1]').click(); //clicking the dropdown
    //Scroll down and click "Lara Johnson"
    const DoctorscrollContainer = page.locator('//div[@class="rc-virtual-list-holder"]');
    await DoctorscrollContainer.evaluate(el => {
    el.scrollTop = el.scrollHeight; // scroll to bottom
    });
    await page.locator('//div[contains(text(),"Lara Johnson")]').click();
    await page.waitForTimeout(2000);

    //Finding the no.of.rows inside the table                           
    const row_count_LaraJonhson = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
    const total_row_count_LaraJohnson = await row_count_LaraJonhson.count();
    console.log("Selecting 'Lara Johnson' in the Doctor filter and the row count = "+total_row_count_LaraJohnson);
    console.log(" ");
    
        let matcheddoctorcount_LaraJohnson = 0;

    // Handle empty case 
        if (total_row_count_LaraJohnson === 0) 
        {
            console.warn("No rows found for 'Lara Johnson' filter — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
        }
        else 
        {
    //Locate the 7th column(Assgined Doctor) in each row
        for(let i=0; i<total_row_count_LaraJohnson; i++)
           {
             const Doctor_column_LaraJohnson = row_count_LaraJonhson.nth(i).locator('td').nth(6);
             await expect(Doctor_column_LaraJohnson).toBeVisible();
             //get the text
             const Doctor_name_LaraJohnson = await Doctor_column_LaraJohnson.textContent();
             
                  if (!Doctor_name_LaraJohnson || Doctor_name_LaraJohnson.trim() === '') 
                    {
                        continue; // skip empty/fake rows
                    }
                    if (Doctor_name_LaraJohnson.toLowerCase().includes('lara johnson')) 
                    {
                        matcheddoctorcount_LaraJohnson++;
                        console.log("Row "+(i + 1) + " having 'Lara Johnson': "+Doctor_name_LaraJohnson.trim());
                        console.log("");
                    }
           }
        }

        if(matcheddoctorcount_LaraJohnson!=total_row_count_LaraJohnson)
           {
            console.warn("ERROR-Mismatched: Found "+total_row_count_LaraJohnson +" row count but only "+matcheddoctorcount_LaraJohnson +" is matching with 'Lara Johnson' in Assigned Doctor name. ")
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }
        else
           {
            console.log("Filter Result : Row count is "+total_row_count_LaraJohnson+" and the Assigned Doctor name inclued 'Lara Johnson' count is "+matcheddoctorcount_LaraJohnson)
            console.log("------------------------------------------------------------------");
            console.log(" ");
           }

        });