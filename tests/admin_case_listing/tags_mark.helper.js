const { expect } = require('playwright/test');

exports.tagsMark = async function (page) {
  // Define tag name based on tag color
  const tagColorMap = {
    'rgb(255,0,0)': 'urgent',
    'rgb(255,69,0)': 'critical',
    'rgb(30,144,255)': 'interesting',
    'rgb(50,205,50)': 'case opened',
  };

  const tags = ['urgent', 'critical', 'interesting'];
  let tagIndex = 0;
  let pageIndex = 1;

  console.log(" ** ======================== Tagging started ======================== **");

  while (true) {
    console.log(`📄 Checking Page ${pageIndex}...`);

    const rowLocator = page.locator('//div[@class="ant-table-body"]//tr[contains(@class,"ant-table-row-level-0")]');
    const totalRows = await rowLocator.count();

    if (totalRows === 0) {
      console.warn("⚠️  No rows found on this page.");
      break;
    }

    for (let i = 0; i < totalRows; i++) {
      const currentRow = rowLocator.nth(i);
      const tagCell = currentRow.locator('td').nth(0);
      const tagBox = tagCell.locator('.admin-cases__tags');
      const tagItems = tagBox.locator('.admin-cases__tag-item');
      const tagCount = await tagItems.count();
      const isTagged = tagCount > 0;

      if (isTagged) {
        let tagNames = [];

        for (let j = 0; j < tagCount; j++) {
          const tagItem = tagItems.nth(j);
          let tagColor = await tagItem.evaluate(el =>
            window.getComputedStyle(el).getPropertyValue('background-color')
          );
          tagColor = tagColor.replace(/\s+/g, '').toLowerCase();

          const tagName = tagColorMap[tagColor] || 'unknown';
          tagNames.push(tagName);
        }

        console.log(`✅ Row ${i + 1} on Page ${pageIndex}: Already tagged with [${tagNames.join(', ')}]`);
      } else {
        const tagToAssign = tags[tagIndex % tags.length];
        tagIndex++;

        console.log(`🔖 Row ${i + 1} on Page ${pageIndex}: Assigning tag — ${tagToAssign}`);

        await currentRow.click({ button: 'right' });

        const tagOption = page.locator(`//div[@class="context-menu"]//button[@class="menu-item"]//span[contains(text(),"${tagToAssign}")]`);
        await expect(tagOption).toBeVisible();
        await tagOption.click();

        console.log(`✅ Tag "${tagToAssign}" assigned to Row ${i + 1}`);
      }

      console.log('--------------------------------------');
      await page.waitForTimeout(500); // Wait between rows
    }

    // Check if "Next Page" button is enabled
    const nextBtn = page.locator('.ant-pagination-next:not(.ant-pagination-disabled)');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(1000); // Wait for page change
      pageIndex++;
    } else {
      console.log("✅ All pages completed.");
      break;
    }
  }


    // ✅ Click Previous button to go back one page
    const prevButton = page.locator('.ant-pagination-prev:not(.ant-pagination-disabled)');
    if (await prevButton.isVisible()) {
    await prevButton.click();
    await page.waitForTimeout(1000);
    console.log('⬅️ Clicked Previous button to return to earlier page.');
    } 
    else {
    console.warn('⚠️ Previous button is disabled or not visible. Cannot go back.');
    }

  console.log("========== Tagging completed ==========");
};



















































































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

            
