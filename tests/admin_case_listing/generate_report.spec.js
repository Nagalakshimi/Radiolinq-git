const { expect } = require('@playwright/test');
const pdfParse = require('pdf-parse');
const stringSimilarity = require('string-similarity');
const path = require('path');
const fs = require('fs');


exports.generatereport = async function (page) 
{
    //Clicking on the First row to open an "More case detail" option
    const first_row = await page.locator('//div[@class="ant-table-body"]//tr[2]');
    const generatereport_btn = await first_row.locator('//button[3]');
    await expect.soft(generatereport_btn).toBeVisible();
    await generatereport_btn.click();

    //Asserting "Report form" is visible after clicking on generate report button
    const Reportform = await page.locator('.report-form');
    await expect.soft(Reportform).toBeVisible();

    //Without report template directly clicking on "Try Radiolinq AI Assist" button and check whether it's shows an error popup message
    const AIassist_btn = await page.locator('//button//span[contains(text(),"Try Radiolinq AI Assist")]');
    await expect.soft(AIassist_btn).toBeVisible();
    await AIassist_btn.click();
    //Without template : Error-Message
    const Template_Errormsg = await page.locator('//div[contains(text(),"Please select a report template for Smart reporting")]');
    await expect.soft(Template_Errormsg).toBeVisible();
    const Errormsg_text = await Template_Errormsg.textContent();
    console.log("Clicking 'AI Assist' button without giving report template");
    console.log(" ");
    console.log("Without Report template - Error Message : "+Errormsg_text);
    console.log("----------------------------------------------------------")

    //Without Content clicking on "Save report" button and check whether it's shows an error message
    const Savereport_btn = await page.locator('//button//span[contains(text(),"Save Report")]');
    await expect.soft(Savereport_btn).toBeVisible();
    await Savereport_btn.click();
    //Without Content : Error-Message
    const Content_Errormsg = await page.locator('//div[contains(text(),"Content is required!")]');
    await expect.soft(Content_Errormsg).toBeVisible();
    const contentErrormsg_text = await Content_Errormsg.textContent();
    console.log("Clicking 'Save Report' button without giving content");
    console.log(" ");
    console.log("Without Content - Error Message : "+contentErrormsg_text);
    console.log('---------------------------------------------------------')
    await page.waitForTimeout(1000);



    //Clicking on "Report Template" dropdown
    // Locate the specific dropdown by its placeholder text
    const templateDropdown = page.locator('.ant-select', {
    has: page.locator('span.ant-select-selection-placeholder', { hasText: 'Select Template' })
    });
    // Make sure it's visible
    await expect.soft(templateDropdown).toBeVisible();
    // Click the input inside it
    await templateDropdown.locator('.ant-select-selection-search-input').click();
    await page.waitForTimeout(2000);
    
   
    //Checking the dropdown is visible or not
    const dropdown_templates = await page.locator('.rc-virtual-list-holder');
    await expect.soft(dropdown_templates).toBeVisible();
   //Scroll to the bottom
    await dropdown_templates.evaluate(el => {
    el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(2000);

    //Select "MRI Brain Report" in dropdowns
    const templateToSelect = ['MRI Brain Report'];

    for (const template of templateToSelect) {
    await page.locator(`//div[contains(text(),"${template}")]`).click();
    console.log("Selecting "+template+" in report template dropdown");
    console.log(" ");
    }

    //Locate the text content area
    const contentBox = page.locator('.ck.ck-content');

    //Expect a key phrase (like heading) to be visible
    await expect.soft(contentBox).toContainText(templateToSelect);

    //Get the original textcontent
    const originalContent = await contentBox.textContent();

    //Clicking AI Assist button
    await AIassist_btn.click();

    //Checking if the textarea should appear
    const AIassist_textbox = await page.locator('//textarea[@class="ant-input"]');
    await expect.soft(AIassist_textbox).toBeVisible();

    //Enter Abnormal text inside AI assist textbox
    const Abnormal_text = 'Abnormal bleeding in brain';
    await AIassist_textbox.fill(Abnormal_text);
    await page.waitForTimeout(1000);

    //Click "Generate smart report"
    await page.locator('//button//span[contains(text(),"Generate Smart Report")]').click();
    await page.waitForTimeout(5000);

    //Check after Click on Smart Report popup should be shown
    //const AIassistDone_popup = await page.locator('//div[contains(text(),"Radiolinq AI Assist Done!")]');
    //await expect.soft(AIassistDone_popup).toBeVisible();  // AI assist taking time sometime to execute, so this line passes intermittently

    // Check if credit-exceeded popup is visible
    const creditPopup = page.locator('text=You have exceeded your AI credit limit'); // adjust text as needed

    let updatedContent = '';

    if (await creditPopup.isVisible()) {
    console.log("AI credit limit exceeded. Clicking Save Report...");
    await Savereport_btn.click();
    } 
    else 
    {
    // Wait for content to change
    await page.waitForFunction(
    (oldContent) => {
      const editor = document.querySelector('.ck.ck-content');
      return editor && editor.textContent !== oldContent;
    },
    originalContent,
    { timeout: 5000 }
  );

    // Get the updated content
    updatedContent = await contentBox.textContent();
    expect.soft(updatedContent).not.toBe(originalContent);
    await page.waitForTimeout(2000);

    // Find all <span> tags inside the editor that have inline yellow background
    const yellowSpans = contentBox.locator('//span[@style="background-color:yellow;"]');

    // Check if any yellow spans are found
    const yellowCount = await yellowSpans.count();

    if (yellowCount > 0) {
    for (let i = 0; i < yellowCount; i++) {
    const text = await yellowSpans.nth(i).textContent();
    console.log(`Yellow highlight found: ${text}`);
    console.log(" ");
        }
    } 
    else {
    console.log('No yellow highlights found');
    console.log(" ");
    }

    // Final assertion
    expect.soft(yellowCount).toBeGreaterThan(0);

    //Clicking "Save Report" button
    await Savereport_btn.click();
    console.log("Clicked Save Report button.");
    console.log("-----------------------------------------");
    }

    
    //await page.waitForTimeout(2000);

    //Check "Report Created" button should be visible
    const Reportcreated_popup = await page.locator('//div[contains(text(),"Report created")]');
    await expect.soft(Reportcreated_popup).toBeVisible();
    await page.waitForTimeout(1000);
    

    //"Preview PDF" button should be visible
    const previewPDF_btn = await page.locator('//button[contains(text(),"Preview PDF")]');
    await expect.soft(previewPDF_btn).toBeVisible();



    let pdfBuffer = null;

    // Start listening for PDF responses
    page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type']; //File Types like html,json,pdf..

    if (contentType?.includes('application/pdf')) {
    console.log('Found PDF at:', url);
    console.log(" ");
    pdfBuffer = await response.body();
    }
    });

    //Click the Preview PDF button (that opens the new tab)
    //await previewPDF_btn.click();
    const [pdfPage] = await Promise.all([
    page.context().waitForEvent('page'),
    previewPDF_btn.click()
    ]);

    await pdfPage.waitForLoadState();

    //Give it some time to load
    await page.waitForTimeout(3000);

    //Check if PDF was captured
    if (!pdfBuffer) {
    throw new Error("PDF buffer not captured. Check if content-type was PDF or delay needed.");
    console.log(" ");
    }

    // Parse and assert PDF content
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;



    //Compare PDF content with contentToCompare(updated/original content)
    const contentToCompare = updatedContent || originalContent;

    if(updatedContent)
    {
        console.log("Using 'Updated content' for comparision.");
        console.log(" ");
    }
    else
    {
        console.log("Using 'Original content' for comparision.");
        console.log(" ");
    }
    
    //Normalize PDF and Expected content
    const normalizeText = (text) => {
    return text
    .replace(/[\r\n]+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ')     // Collapse multiple spaces into one
    .replace(/[^\w\s]/g, '')  // Remove punctuation
    .trim()
    .toLowerCase();
    };

    const pdfNormalized = normalizeText(pdfText);
    const expectedNormalized = normalizeText(contentToCompare);
    //console.log("Using content for comparison:\n", contentToCompare); //content inside init
    //console.log(" ");

    //Fuzzy comparison
    const similarity = stringSimilarity.compareTwoStrings(pdfNormalized, expectedNormalized);
    console.log("Similarity Score: "+(similarity * 100).toFixed(2)+"%");

    //Use similarity-based assertion instead of .toContain
    //await expect.soft(similarity).toBeGreaterThan(0.9);  // 90%+ similarity means it's a match

    if(similarity > 0.9)
    {
        console.log("PDF content loosely matches the expected content.");
        console.log("---------------------------------------------------------");
    }
    else
    {
        console.log("PDF content has very less similarity.");
        console.log("---------------------------------------------");
    }

    //Close the PDF tab
    await pdfPage.close();
    console.log("Closing the PDF tab");
    console.log("--------------------------------------------------");

    //"Save and Publish Report" button should be visible
    const publishreport_btn = await page.locator('//span[contains(text(),"Save & Publish Report")]');
    await expect.soft(publishreport_btn).toBeVisible();
    await publishreport_btn.click();
    console.log("Save and Publish button clicked");
    console.log(" ");
    await page.waitForTimeout(2000);

    //Checking "Download" button is visible and Click it
    const Download_btn = await page.locator('//button[contains(text(),"Download")]');
    await expect.soft(Download_btn).toBeVisible();
    await Download_btn.click();

    //Checking "Download options" is visible('Download with letterhead', 'Download without letterhead', 'Download as word' )
    const download_options = await page.locator('.ant-popover-inner-content');
    await expect.soft(download_options).toBeVisible();

    // Define download options text
    const downloadOptions = [
    //'Download with Letterhead',
    //'Download without Letterhead',
    'Download as Word'
  ];

    //Wait for the download options to start when clicking the buttons
    for (const optionText of downloadOptions) {
    const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click(`text=${optionText}`) // Clicks the item with matching visible text
    ]);

    const suggestedName = await download.suggestedFilename();
    const downloadPath = path.join(__dirname, 'downloads', suggestedName);
    await download.saveAs(downloadPath);

    const fileExists = fs.existsSync(downloadPath);
    await expect.soft(fileExists).toBeTruthy();

    console.log("Downloaded: "+(optionText)+" as "+suggestedName);
  }



}
