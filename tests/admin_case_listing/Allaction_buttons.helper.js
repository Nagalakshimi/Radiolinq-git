const {test} = require('@playwright/test');
const {selfAssign} = require('./case_reporting.helper');
const { edit } = require('./edit.helper');
const { morecase_details } = require('./morecase_details.helper');
const { generatereport } = require('./generate_report.helper');
const { downloadCase, downloadReport } = require('./downloads.helper');
const { sharelink } = require('./share_link.helper');

exports.actionButtons = async function (page, browser) {
    console.log('** ================================ Executing Action Buttons ================================ **');

    //===================== Self-Assign ==============================
    await page.waitForTimeout(1000);
    await selfAssign(page);

    //===================== Editing the case in Row 1 =========================
    //Calling "edit" function
    await edit(page);

    //================ View Row 1 "More case details" and compare the Values in Edit ===============
    //Calling "morecase_details" function
    await morecase_details(page);


    // ========================= Generate the Report in Row 1 =======================================
    //Calling "generate_report" function
    await generatereport(page);

    // ==================== Downloads the First case ========================
    //Calling the "Download Case" function
    await downloadCase(page);

    // ====================== Download the First Reports ===========================
    //Calling the "Download Report" function
    await downloadReport(page);

    // =========================== Share Link ======================================
    //Calling the "Share Link" function
    await page.waitForTimeout(2000);
    await sharelink(page, browser);

}