import { test, expect } from '@playwright/test';


let page;

test.beforeAll('Login to the application', async({browser})=>{
     page = await browser.newPage();
     //Login to the page
    const Loginbrowserpage = await page.goto('https://staging.radiolinq.com/')

    //Checking the image is visible in login page
    await expect(page.getByAltText('Radiolinq Login')).toBeVisible();
    
    //Checking the radiolinQ img src is visible
    await expect(page.locator('.logo-form__logo-image')).toBeVisible();

    //Login admin page with credential
    await page.locator('//input[@placeholder ="Enter email"]').fill('nivi2311@gmail.com');
    await page.locator('//input[@placeholder ="Enter password"]').fill('password');
    await page.click('//button[@type ="submit"]');
    await expect(page.locator('h2.mt-2',{hasText: 'Cases'})).toBeVisible();

});

test('case filter',async()=>{

    //Case filter option is visible and click
    const casetext = await page.locator('.case-filter-form__toggle-button');
    await expect(casetext).toBeVisible();

    //Check all the filter option is available
    const filter_option = await page.locator('(//form[@action="#"])//div[contains(@class,"ant-col-xxl-4")]');
    await expect(filter_option).toHaveCount(10);
    for(let i=0;i<10;i++)
    {
        await expect(filter_option.nth(i)).toBeVisible();
    }

     //Click the 1st filter - Patient_name and check the textbox is editable
     const Patient_namefilter = await (filter_option.nth(0)).locator('//input[@name="patientId"]');
     await Patient_namefilter.click();
     await expect(Patient_namefilter).toBeEditable();

     //Click the from date and choose the date
      const fromdate = await (filter_option.nth(8)).locator('//input[@name="fromDate"]');
      await fromdate.click();
      const monthlocator = page.locator('//div[@class="ant-picker-date-panel"]//div[@class="ant-picker-header-view"]//button[contains(text(),"Jun")]');
      await expect(monthlocator).toBeVisible();

      //Click previous button to go to may month
       const choosemonth = await page.locator('.ant-picker-header-prev-btn');
       await choosemonth.click();
       const monthlocator1= page.locator('//div[@class="ant-picker-date-panel"]//div[@class="ant-picker-header-view"]//button[contains(text(),"May")]');
       await expect(monthlocator1).toBeVisible();

       //Choose the date(16-may-2025)
        await page.locator('//div[@class="ant-picker-body"]//tr//td//div[contains(text(),"16")]').click();


});



test.afterAll('Logout from the application', async()=>{
     const logout = await page.locator('span',{hasText: 'Logout'});
     await logout.click();

});




