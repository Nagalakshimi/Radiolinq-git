const {expect} = require('@playwright/test');
import { patientIdFilter } from '../filters/patient_id.helper';
import { patientNameFilter } from '../filters/patient_name.helper';
import { scantype } from '../filters/scantype.helper';
import { bodypart } from '../filters/bodypart.helper';
import { scancenter } from '../filters/scancenter.helper';
import { doctor } from './doctor.helper';
import { status } from './status.helper';
import { tagsCheck } from './tag.helper';
import { datefilters} from './date.helper';

exports.all_Filters = async function (page) {

    //Filter Row by using "Patient Id"
        await page.waitForTimeout(1000);
        await patientIdFilter(page);
    
    //Filter Row by using "Patient Name"
        await page.waitForTimeout(1000);
        await patientNameFilter(page);
    
    //Filter Row by using "Scan Type"
        await page.waitForTimeout(1000);
        await scantype(page);
    
    //Filter Row by using "Body Part"
        await page.waitForTimeout(1000);
        await bodypart(page);
    
    //Filter Row by using "Scan center"
        await page.waitForTimeout(1000);
        await scancenter(page);

    //Filter Row by using "Doctor"
        await page.waitForTimeout(1000);
        await doctor(page);

    //Filter Rown by using "Status"
        await page.waitForTimeout(1000);
        await status(page);

    //Filter Rows by using "Tags"
        await page.waitForTimeout(1000);
        await tagsCheck(page);

    //Filter Rows by using "From Date and To Date"
        await page.waitForTimeout(1000);
        await datefilters(page);
    
}