const { expect } = require('@playwright/test');


exports.edit = async function (page) 
{
    //Clicking on the First row to open an edit option
    const first_row_edit = await page.locator('//div[@class="ant-table-body"]//tr[2]');
    const editBtn = await first_row_edit.locator('//button[2]').click();

    //Asserting after clicking Edit button "Edit case" text is visible in case form
    const EditCase_text = await page.locator('//div[@class="case-form"]//h2[contains(text(),"Edit Case")]');
    await expect.soft(EditCase_text).toBeVisible();

    //Edit the patient id
    const patientId = await page.locator('//div[@class="case-form"]//input[@name="patientId"]');
    await patientId.press('Control+A');
    await patientId.press('Backspace');
    await page.waitForTimeout(1000); 
    await patientId.fill('ABC1234');
    console.log("Patient Id is edited with the id : 'ABC1234'.");
    console.log(" ");

    //Edit the patient name
    const patientName = await page.locator('//div[@class="case-form"]//input[@name="patientName"]');
    await patientName.fill('Ram Naren');
    console.log("Patient Name is edited with the id : 'Ram Naren'.");
    console.log(" ");

    //Edit Scantype
    const scantype = await page.locator('(//div[@class="ant-select ant-select-single ant-select-show-arrow ant-select-show-search"])[1]');
    await scantype.click();
    //Select "MR"
    await page.click('//div[contains(text(),"MR")]');
    console.log("Scantype is edited with the 'MR'.");
    console.log(" ");

    //Edit Body part
    //Close the not_set option
    await page.locator('//span[@class="ant-select-selection-item-remove"]//span[@aria-label = "close"]').click();
    await page.waitForTimeout(1000);

    //Choose "Brain"
    await page.locator('//div[@class="ant-select ant-select-multiple ant-select-show-search"]').click();
    await page.click('//div[contains(text(),"Brain")]');
    console.log("Bosypart is edited with the 'Brain'.");
    console.log(" ");

    //Click on "Edit case" because after choose body part the popup is not autoclose
    await EditCase_text.click();

    //Edit "Age"
    const age = page.locator('//input[@name="age"]');
    await age.press('Control+A');
    await age.press('Backspace');
    await age.fill('27');
    console.log("Age is edited with the : '27'.");
    console.log(" ");

    //Edit "Gender"
    const gender = await page.locator('(//div[@class="ant-select ant-select-single ant-select-show-arrow ant-select-show-search"])[2]');
    await gender.click();
    //Click "Male"
    await page.click('//div[contains(text(),"Male")]');
    console.log("Gender is edited with the 'Male'.");
    console.log(" ");
    await page.waitForTimeout(1000);

    //Scroll down 500px
    await page.evaluate(() => 
    {
    window.scrollBy(0, 500);
    });

    //Edit "Study Description"
    const studyDescription = page.locator('//input[@name="studyDescription"]');
    await studyDescription.press('Control+A');
    await studyDescription.press('Backspace');
    await studyDescription.fill('NECK');
    console.log("Study Description is edited with the: 'Neck'.");
    console.log(" ");

    //Edit "Contrast"
    const contrast = await page.locator('(//div[@class="ant-select ant-select-single ant-select-show-arrow ant-select-show-search"])[3]');
    await contrast.click();
    //Click Yes
    await page.click('//div[contains(text(),"Yes")]');
    console.log("Contrast is edited with the 'Yes'.");
    console.log(" ");

    //Edit "Referring Doctor"
    const referringDoctor = page.locator('//input[@name="referringDoctor"]');
    await referringDoctor.fill('Dr.Hari');
    console.log("Referrind Doctor is edited with the name : 'Dr.Hari'.");
    console.log(" ");

    //Edit "Patient History"
    const patient_history = await page.locator('//textarea[@name="patientHistory"]');
    await patient_history.fill('Focus on the nature, onset, and location of neck pain');
    console.log("Patient History is edited with the text : 'Focus on the nature, onset, and location of neck pain'.");
    console.log(" ");
    await page.waitForTimeout(2000);

    //Edit "Patient History Attachment"
/*
    const filePath = path.resolve('C:/Users/nagalakshimi/Downloads/radiolinq-screenshot (8).jpeg');

    // Wait for the file chooser and trigger it
    const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('//div[@class="attachment-upload__input"]') // update this if needed
    ]);

    // Upload the JPEG file
    await fileChooser.setFiles(filePath);
    await page.waitForTimeout(2000);
    */
   const fileAttached = await page.locator('//div[@class="ant-col ant-col-6 attachment-upload__img-wrapper"]').isVisible();

if (fileAttached) {
  console.log('File Already attached');
} else {
  console.log('No attachment found. Uploading now...');

  // Trigger file chooser
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('//div[@class="attachment-upload__input"]')
  ]);

  // Set the file path
  const path = require('path');
  const filePath = path.resolve('C:/Users/nagalakshimi/Downloads/radiolinq-screenshot (8).jpeg');

  // Upload the file
  await fileChooser.setFiles(filePath);
  await page.waitForTimeout(2000);

  console.log('File uploaded successfully.');

}
    //Click on "Update" button
    await page.click('//button[@type="submit"]');

    //Verify whether the patients details are changed in the row
    const row_count = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]')
    const row = row_count.nth(0);

    // Column indexes may vary: adjust if needed (starts from 0)
    const patientIdColumn = row.locator('td').nth(1);   // 2nd column
    const patientnameColumn      = row.locator('td').nth(2);   // 3rd column
    const scanType_BodypartColumn  = row.locator('td').nth(3);   // 4th column

    await expect.soft(patientIdColumn).toHaveText('ABC1234');
    await expect.soft(patientnameColumn).toHaveText('Ram Naren');
    await expect.soft(scanType_BodypartColumn).toHaveText('MR - Brain');

}