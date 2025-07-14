const{expect} = require ('playwright/test');

exports.tagsMark = async function (page) {

    //Check the Patient details table is visible
        const patient_detail_table = page.locator('.ant-table-container');
        await expect(patient_detail_table).toBeVisible();

    
    //Finding the no.of.rows inside the table                           
        const row_count = page.locator('//div[@class="ant-table-body"]//tr[@class="ant-table-row ant-table-row-level-0 cursor-pointer"]');
        const total_row_count = await row_count.count();
        console.log("No.of cases present in the row = "+total_row_count);
        console.log(" ");
    

    if (total_row_count === 0) 
    {
    console.warn("No rows found inside the table of case listing — table is empty.");
    console.log("------------------------------------------------------------------");
    console.log(" ");
    }
    else {
    // List of tags to assign in round-robin
    const tags = ['urgent', 'critical', 'interesting'];

    let tagIndex = 0;

    for (let i = 0; i < total_row_count; i++) {
    const currentRow = row_count.nth(i);
    const tagCell = currentRow.locator('td').nth(0);
    const tagBox = tagCell.locator('.admin-cases__tags');

    const tagItems = tagBox.locator('.admin-cases__tag-item');
    // const isTagged = await tagItem.count() > 0;
        const tagCount   = await tagItems.count();
        const isTagged = tagCount > 0;
        console.log(`Row ${i + 1}: Is tagged? ${isTagged}`);

    if (isTagged) {

/*
    // Get the tag color
    let tagColor = await tagItem.evaluate(el =>
    window.getComputedStyle(el).getPropertyValue('background-color')
    );
    tagColor = tagColor.replace(/\s+/g, '').toLowerCase();
*/

    // Map known colors to tag names
    const tagColorMap = {
        'rgb(255,0,0)': 'urgent',
        'rgb(255,69,0)': 'critical',
        'rgb(30,144,255)': 'interesting',
        'rgb(50,205,50)': 'case opened',
    };

      let tagNames = [];

      for (let j = 0; j < tagCount; j++) {
        const tagItem = tagItems.nth(j);
        let tagColor = await tagItem.evaluate(el =>
          window.getComputedStyle(el).getPropertyValue('background-color')
        );

        tagColor = tagColor.replace(/\s+/g, '').toLowerCase(); // clean whitespace
        const tagName = tagColorMap[tagColor] || 'unknown';
        tagNames.push(tagName);
      }

      console.log(`Row ${i + 1}: Tags already present — [${tagNames.join(', ')}] — Skipping`);
      console.log('');
      continue;
    }


/*
    const tagName = tagColorMap[tagColor] || 'unknown';

    console.log("Row" +(i + 1)+": Tag already present — ["+tagName+"] — Skipping");
    console.log('');
    continue;
    }
*/
    // Round-robin tag assignment
    const tagToAssign = tags[tagIndex % tags.length];
    tagIndex++;

    console.log("Try to assign Row "+(i + 1)+" with tag: "+tagToAssign);

    await currentRow.click({ button: 'right' });
    console.log("Opened tag option for Row "+(i + 1));

    const tagOption = page.locator(`//div[@class="context-menu"]//button[@class="menu-item"]//span[contains(text(),"${tagToAssign}")]`);
    await expect(tagOption).toBeVisible();
    await tagOption.click();
    console.log("Successfully assigned Row "+(i + 1)+" with tag: "+tagToAssign);
    console.log("------------------------------------------------------------");

    await page.waitForTimeout(1000);
}
    }
}



















































































/*
    for (let i = 0; i < total_row_count; i++) {
        const currentRow = row_count.nth(i);
        const tagCell = currentRow.locator('td').nth(0);

    // Get the tag box
    const tagBox = tagCell.locator('.admin-cases__tags');

    // Check if visible
    const isTagBoxVisible = await tagBox.isVisible();
    console.log(`Row ${i + 1}: Tag box visible? ${isTagBoxVisible}`);

    let bgColor = '';
    try {
      bgColor = await tagBox.evaluate(el =>
        window.getComputedStyle(el).getPropertyValue('background-color')
      );
      bgColor = bgColor.replace(/\s+/g, '').toLowerCase();
    } catch {
      bgColor = '';
    }

    const isTagged = knownTagColors.some(color => bgColor.includes(color));
    if (isTagBoxVisible && isTagged) {
      console.log(`Row ${i + 1}: Tag already present (${bgColor}) — Skipping`);
      continue;
    }

    // Select tag for current row in round-robin
    const tagToAssign = tags[tagIndex % tags.length];
    tagIndex++;

    console.log(`Try to assign Row ${i + 1} with tag: ${tagToAssign}`);

    // Right-click to open context menu
    await currentRow.click({ button: 'right' });
    console.log(`Opened context menu for Row ${i + 1}`);

    // Click the tag from context menu
    const tagOption = page.locator(`//div[@class="context-menu"]//button[@class="menu-item"]//span[contains(text(),"${tagToAssign}")]`);
    await expect(tagOption).toBeVisible();
    await tagOption.click();
    console.log(`Successfully assigned Row ${i + 1} with tag: ${tagToAssign}`);
    console.log("------------------------------------------------------------");

    await page.waitForTimeout(1000); // optional wait for tag to reflect
  }
}
*/












































































/*
    //Handle empty case 
            if (total_row_count === 0) 
            {
            console.warn("No rows found inside the table of case listing — table is empty.");
            console.log("------------------------------------------------------------------");
            console.log(" ");
            } 
            else    
            {
    // List of tags to assign in round-robin
        const tags = ['urgent', 'critical', 'interesting'];
        const knownTagColors = [
        'rgb(255, 0, 0)',     // Urgent
        'rgb(255, 69, 0)',    // Critical
        'rgb(30, 144, 255)',  // Interesting
        ];

        let tagIndex = 0;

        for (let i = 0; i < total_row_count; i++) 
            {
                const currentRow = row_count.nth(i);
                const tagCell = currentRow.locator('td').nth(0); 

    // Get the tag box in this row
            const tagBox = tagCell.locator('//div[@class="admin-cases__tags"]');
            const isTagBoxVisible = await tagBox.isVisible();
            console.log(`Row ${i + 1}: Tag box visible? ${isTagBoxVisible}`);

            let bgColor = '';
            try {
            bgColor = await tagBox.evaluate(el =>
            el.style.backgroundColor);
            } 
            catch {
    // If tag not rendered or missing, treat as untagged
            bgColor = '';
            }

            const isTagged = knownTagColors.some(color => bgColor.startsWith(color));
            if (isTagged) {
            console.log(`Row ${i + 1}: Tag already present (${bgColor}) — Skipping`);
            continue;
            }
            */
       /* if (knownTagColors.includes(bgColor)) 
        {
        console.log(`Row ${i + 1}: Tag already present (${bgColor}) — Skipping`);
        continue;
        }
*/
    
/*
    // Select tag for current row in round-robin
    const tagToAssign = tags[tagIndex % tags.length];
    tagIndex++;

    console.log(`Try to assign Row ${i + 1} with tag: ${tagToAssign}`);

    // Right-click on the row to open context menu
    await currentRow.click({ button: 'right' });
    console.log(`Opened context menu for Row ${i + 1}`);

    // Click the tag from context menu
    const tagOption = page.locator(`//div[@class="context-menu"]//button[@class="menu-item"]//span[contains(text(),"${tagToAssign}")]`);
    await expect(tagOption).toBeVisible();
    await tagOption.click();
    console.log(`Successfully assigned Row ${i + 1} with tag: ${tagToAssign}`);
    console.log("------------------------------------------------------------");

    await page.waitForTimeout(1000); // optional wait for tag to reflect
         }
        }
*/

            
