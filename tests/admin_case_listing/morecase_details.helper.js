const { expect } = require('@playwright/test');
const { Console } = require('console');


exports.morecase_details = async function (page) 
{
    console.log('// ==================== View the More Case Details in First case ========================\n');
    //Clicking on the First row "More case detail" option
    //const first_row = await page.locator('//div[@class="ant-table-body"]//tr[2]');
    const morecasedetails_btn = await page.locator('(//button//span[@aria-label = "ellipsis"])[1]');
    await expect.soft(morecasedetails_btn).toBeVisible();
    await morecasedetails_btn.click();

    //Asserting after clicking more case details button "Patient details" text is visible
    const Morecasedetail_text = await page.locator('//div[@class="case-overview"]//h2[contains(text(),"Patient details")]');
    await expect.soft(Morecasedetail_text).toBeVisible();

    // Get values from more case detail popup (read-only)
    const getPopupValue = async (labelText) =>
    (await page.locator(`//div[contains(@class,"case-overview__label") and text()="${labelText}"]/following-sibling::div`).textContent())?.trim();

    const patientNamePopup = await getPopupValue('Patient Name');
    const patientIdPopup = await getPopupValue('Patient ID');
    const patientAgePopup = await getPopupValue('Patient Age');
    const genderPopup = await getPopupValue('Gender');
    const scanTypePopup = await getPopupValue('Scan Type');
    const bodyPartPopup = await getPopupValue('Body parts');
    const scanTypeFullPopup = `${scanTypePopup} ${bodyPartPopup}`.trim();
    const contrastPopupvalue = await getPopupValue('Contrast');
    const contrastPopup = contrastPopupvalue.trim().toLowerCase() === 'true' ? 'Yes' : 'No';
    const StudyDescriptionpopup = await getPopupValue('Study Description');
    const ReferringDoctorpopup = await getPopupValue('Referring Doctor');
    const PatientHistorypopup = await getPopupValue('Patient History');
    const imagePopupSrc = await page.locator('//img[contains(@class,"case-overview__img")]').getAttribute('src');

    // Close more case detail popup
    await page.locator('//button[@aria-label="Close"]').click();
    console.log("More case detail popup has closed");
    console.log("-------------------------------------");

    // Open "Edit" button in case listing page
    //await first_row.locator('//button[2]').click();
    await page.locator('(//button//span[@aria-label = "edit"])[1]').click();
    console.log("Opening Edit option");
    await page.waitForTimeout(2000);

    //Fetching value from input fields
    const getInputValue = async (labelText) => {
    const wrapper = page.locator(
    `.case-form .input-field-wrapper:has(p.input-field__title:has-text("${labelText}"))`
    );

    const input = wrapper.locator('input');
    const inputCount = await input.count();

    if (inputCount === 1) {
    return (await input.inputValue()).trim();
    }

    // If multiple inputs, try filtering for [type="text"] or [type="number"]
    if (inputCount > 1) {
    const filteredInput = wrapper.locator('input[type="text"], input[type="number"]');
    if (await filteredInput.count() === 1) {
      return (await filteredInput.inputValue()).trim();
    }
  }

    const textarea = wrapper.locator('textarea');
    if (await textarea.count() === 1) {
    return (await textarea.inputValue()).trim();
  }

    throw new Error(`No uniquely matched input/textarea for label: "${labelText}"`);
};
    //Get values from dropdown fields
    const getDropdownValue = async (labelText) => {
    return await page
    .locator(`.dropdown-field:has(div.dropdown-field__title:has-text("${labelText}"))`)
    .locator('.ant-select-selector .ant-select-selection-item')
    .textContent();
    };
    await page.waitForTimeout(2000);

    const extractImagePath = (url) => url.match(/.*\.(jpe?g|png)/i)?.[0] ?? '';

    const patientnameEdit = await getInputValue('Patient name');
    //await page.pause();
    const patientIdEdit = await getInputValue('Patient ID');
    const scanTypeEdit = await getDropdownValue('Scan Type');
    const bodyPartEdit = await getDropdownValue('Body parts');
    const scanTypeFullEdit = `${scanTypeEdit} ${bodyPartEdit}`.trim();
    const patientAgeEdit = await getInputValue('Age');
    const genderEdit = await getDropdownValue('Gender');
    const StudyDescriptionEdit = await getInputValue('Study Description');
    const contrastEdit = await getDropdownValue('Contrast');
    const referringDoctorEdit = await getInputValue('Referring Doctor');
    const patientHistoryEdit = await getInputValue('Patient History');
    const imageEditSrc = await page.locator('//img[contains(@class,"attachment-upload__img")]').getAttribute('src');

    
    //For Debugging - comparing whether the values are same
    console.log('--- Field Comparisons ---');
    console.log('Patient ID:', { edit: patientIdEdit, popup: patientIdPopup });
    console.log('Patient Name:', { edit: patientnameEdit, popup: patientNamePopup });
    console.log('Scan Type:', { edit: scanTypeFullEdit, popup: scanTypeFullPopup });
    console.log('Age:', { edit: patientAgeEdit, popup: patientAgePopup });
    console.log('Gender:', { edit: genderEdit, popup: genderPopup });
    console.log('Study Description:', { edit: StudyDescriptionEdit, popup: StudyDescriptionpopup });
    console.log('Contrast:', { edit: contrastEdit, popup: contrastPopup });
    console.log('Referring Doctor:', { edit: referringDoctorEdit, popup: ReferringDoctorpopup });
    console.log('Patient History:', { edit: patientHistoryEdit, popup: PatientHistorypopup });
    console.log('Image Src:', { edit: imageEditSrc, popup: imagePopupSrc });

    // Compare "more case details popup" vs "edit inputs".
    expect.soft(patientIdEdit.trim().toLowerCase()).toBe(patientIdPopup.trim().toLowerCase());
    expect.soft(patientnameEdit.trim().toLowerCase()).toBe(patientNamePopup.trim().toLowerCase());
    expect.soft(scanTypeFullEdit.trim().toLowerCase()).toBe(scanTypeFullPopup.trim().toLowerCase());
    expect.soft(patientAgeEdit.trim().toLowerCase()).toBe(patientAgePopup.trim().toLowerCase());
    expect.soft(genderEdit.trim().toLowerCase()).toBe(genderPopup.trim().toLowerCase());
    expect.soft(StudyDescriptionEdit.trim().toLowerCase()).toBe(StudyDescriptionpopup.trim().toLowerCase());
    expect.soft(contrastEdit.trim().toLowerCase()).toBe(contrastPopup.trim().toLowerCase());
    expect.soft(referringDoctorEdit.trim().toLowerCase()).toBe(ReferringDoctorpopup.trim().toLowerCase());
    expect.soft(patientHistoryEdit.trim().toLowerCase()).toBe(PatientHistorypopup.trim().toLowerCase());
    //expect.soft(imageEditSrc.trim().toLowerCase()).toBe(imagePopupSrc).trim().toLowerCase();
    expect.soft(extractImagePath(imageEditSrc)).toBe(extractImagePath(imagePopupSrc));

    console.log("Values in 'More case details' are same as 'Edit inputs'.");

    await page.locator('//button[@aria-label="Close"]').click();
    console.log("Edit case popup has closed");
    console.log("-------------------------------------");
    await page.waitForTimeout(1000);
}