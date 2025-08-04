const { expect } = require('@playwright/test');
const clipboardy = require('clipboardy'); //Installed clipboardy package

exports.sharelink = async function (page, browser) 
{
    console.log('// ==================== Sharing the First case ========================\n');
    // 1. Make sure "Share link" button is visible and Click the button

    await page.evaluate(() => {
  window.scrollBy({ left: 500, behavior: 'smooth' }); // Scrolls right by 500 pixels
});

    const sharelink_btn = page.locator('(//button//span[@aria-label = "share-alt"])[1]');
    await expect.soft(sharelink_btn).toBeVisible();
    await sharelink_btn.click();

    // 2. Verify that after clicking on share link it is get open
    const sharecaselink_txt = await page.locator('//div//div[contains(text(),"Share Case Link")]');
    await expect.soft(sharecaselink_txt).toBeVisible();

//==================================== Copy Link option ===========================================
    // 3. Click on "Copy Sharing Link" and verify it's get copied
    const copylink = await page.locator('//li[contains(text(),"Copy Sharing Link")]');
    await expect.soft(copylink).toBeVisible();
    await copylink.click();
    //Ensure "Copied" notification appears
    const copied_notification = await page.locator('//div[contains(text(),"Copied")]');
    await expect.soft(copied_notification).toBeVisible();
    await page.waitForTimeout(1000);
    console.log("Copied notification is visible");

    const browserName = browser._name || browser.browserType().name?.(); // Compatibility
    const isHeadless = browser.options?.headless ?? true;

    let context;

  // Grant clipboard permissions if Chromium in headed mode
  if (browserName === 'chromium' && !isHeadless) {
  context = await browser.newContext();
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
  console.log(`✅ Clipboard permissions granted for ${browserName} in headed mode.`);
} else {
  context = await browser.newContext();
  console.warn(`⚠️ Clipboard permissions not granted. Browser: ${browserName}, Headless: ${isHeadless}`);
}

  const newTab = await context.newPage();

  let actualURL = '';

// ✅ Clipboard read — only in Chromium with fallback
  if (browserName === 'chromium'|| browserName === 'firefox') {
  try {
    const copiedLink = await clipboardy.read();
    const match = copiedLink.match(/https?:\/\/\S+/);
    if (match) {
      actualURL = match[0];
      console.log(`📋 Copied Link: ${actualURL}`);
    } else {
      throw new Error('No valid URL found in clipboard.');
    }
  } catch (err) {
    console.error(`❌ Failed to read clipboard: ${err.message}`);
    return; // Exit or handle failure
  }
} else {
  console.warn(`⚠️ Clipboard reading skipped in ${browserName}.`);
  return; // Skip further steps if no clipboard access
}

// ✅ Navigate to actualURL if set
try {
  await newTab.goto(actualURL, { waitUntil: 'load' });
  await page.waitForTimeout(5000);
  await newTab.waitForURL(/guest\/cases\/\d+/, { timeout: 10000 });
  await page.waitForTimeout(5000);
  await expect.soft(newTab).toHaveURL(/guest\/cases\/\d+/);
  console.log("✅ Link opened successfully in new tab.\n");
  await page.waitForTimeout(1000);
} catch (err) {
  console.error(`❌ Failed to open URL: ${err.message}`);
}

//}  
   finally {
    await newTab.close();
    await context.close();
    //await page.bringToFront();
  }

//======================== "Send to WhatsApp" option Send link using "Mobile number" ==============================
    // Define test cases: number + expected message
    const Mobno_testCases = [
    { number: '123', expectedMessage: 'Please enter a valid mobile number' },
    { number: '123456789099', expectedMessage: 'Please enter a valid mobile number' },
    { number: '9876543210', expectedMessage: 'Whatsapp Notification Sent!' },
    ];

    // Locate the input and send button
    const Mobileno_textbox = await page.locator('//input[@placeholder="Enter mobile number"]');
    const MobNo_send_btn = await page.locator('(//button//span[@aria-label="send"])[1]');
    await expect.soft(Mobileno_textbox).toBeVisible();

    // Loop over each test case
    for (const { number, expectedMessage } of Mobno_testCases) {
    await Mobileno_textbox.fill(number);
    await page.waitForTimeout(1000);
    await MobNo_send_btn.click();
    await page.waitForTimeout(1000);

    //Checking that Notification should appears
    const notification = page.locator(`//div[contains(text(),"${expectedMessage}")]`);
    await expect.soft(notification).toBeVisible({ timeout: 10000 });

    console.log("Checked Number: "+(number)+", Notification → '"+(expectedMessage)+"'");
    await page.waitForTimeout(2000);
}


//=================================== Send link to Referring Doctor ===========================================

    const ReferringDoctor_testcases = [{Doctorname: 'Nagalakshimi', expectedNotification: 'Whatsapp Notification Sent!'}];

    //Locate the Referring Doctor" dropdown
    const referringDoctor_dropdown = await page.locator('//div[@class="case-sharing__value"]//div[@class="ant-select-selector"]');
    await expect.soft(referringDoctor_dropdown).toBeVisible();

    //Loop through each doctor
    for(const {Doctorname, expectedNotification} of ReferringDoctor_testcases )
    {
        //Click the dropdown
        await referringDoctor_dropdown.click();
        await page.waitForTimeout(1000);

        //Select Doctor's
        const doctor_option = await page.locator(`//div[contains(text(),"${Doctorname}")]`);

        await expect.soft(doctor_option).toBeVisible();
        await doctor_option.click();
        await page.waitForTimeout(1000);

        //Click on Send button
        const Referringdoctor_send_btn = await page.locator('(//button//span[@aria-label="send"])[2]');
        await expect.soft(Referringdoctor_send_btn).toBeVisible();
        await Referringdoctor_send_btn.click();

        console.log("Sent referral to: "+Doctorname);
        console.log(" ");
        await page.waitForTimeout(1000); 

        //Checking that Notification should appears
        const notification1 = page.locator(`//div[contains(text(),"${expectedNotification}")]`);
        await expect.soft(notification1).toBeVisible({ timeout: 10000 });

        console.log("Clicked Reffering Doctor: "+(Doctorname)+", Notification → '"+(expectedNotification)+"'\n");
        await page.locator(2000);

        //To close the share link popup
        await page.locator('//div[contains(text(),"Reported Time")]').click();
    }
    

}
