const { expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// ============== DOWNLOAD REPORT =================
exports.downloadReport = async function (page) 
{
    // Step 1: Ensure the downloads folder exists
    const downloadDir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadDir)) 
    {
    fs.mkdirSync(downloadDir);
    }

    // Step 2: Click the main "Download Report" button
    const downloadReportBtn = page.locator('(//button//span[@aria-label = "download"])[1]'); //Clicking on donwload report in first row
    await expect.soft(downloadReportBtn).toBeVisible();
    await downloadReportBtn.click();

    // Step 3: Ensure options are visible
    const downloadMenu = page.locator('.ant-popover-inner-content'); 
    await expect.soft(downloadMenu).toBeVisible();

    // Step 4: Loop through each download option
    const downloadOptions = [
    //'Download with Letterhead',
    //'Download without Letterhead',
    'Download as Word'
    ];

    for (const optionText of downloadOptions) {
    // Wait for download and click the menu option
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click(`.ant-menu-item:has-text("${optionText}")`) 
    ]);

    // Save the file
    const suggestedName = await download.suggestedFilename();
    const downloadPath = path.join(downloadDir, suggestedName);
    await download.saveAs(downloadPath);

    // Verify the file exists
    const fileExists = fs.existsSync(downloadPath);
    expect.soft(fileExists).toBeTruthy();

    console.log("Downloaded: "+optionText+" as "+suggestedName);

    // Open the dropdown again for next option if it closes automatically
    if (optionText !== downloadOptions[downloadOptions.length - 1]) {
      await downloadReportBtn.click(); // Reopen dropdown if needed
      await expect.soft(downloadMenu).toBeVisible();
    }
  }
}

// ============== DOWNLOAD CASE =================
exports.downloadCase = async function (page) 
{
    // Step 1: Make sure the download folder exists
  const downloadDir = path.join(__dirname, 'downloads');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

    //Get the download button and ensure that is visible
    const downloadCase_btn = await page.locator('(//button//span[@aria-label = "cloud-download"])[1]'); //Clicking on download case in first row
    await expect.soft(downloadCase_btn).toBeVisible();

  // Step 2: Wait for download after clicking the button
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    downloadCase_btn.click()
  ]);

  // Step 3: Save the file to downloads folder
  const suggestedName = await download.suggestedFilename();
  const downloadPath = path.join(downloadDir, suggestedName);
  await download.saveAs(downloadPath);

  // Step 4: Check if the file exists
  const fileExists = fs.existsSync(downloadPath);
  expect.soft(fileExists).toBeTruthy();

  console.log(" ");
  console.log("File downloaded - The Path: "+downloadPath);

}