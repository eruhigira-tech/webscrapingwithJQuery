const { chromium } = require('playwright');
const fs = require('fs');

async function scrapeALUCanvas() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Navigating to ALU Canvas...');
  await page.goto('https://instructure.com');

  console.log('\n======================================================');
  console.log('ACTION REQUIRED: Please log in using your student Google account.');
  console.log('Complete any 2FA prompts on your mobile device if required.');
  console.log('======================================================\n');

  await page.waitForURL('**/courses**', { timeout: 0 });
  console.log('Login verified! Arrived at the Canvas Dashboard.');

  console.log('Navigating to the "Frontend Web development" course...');

  try {
    await page.getByRole('link', { name: /frontend web development/i }).first().click();
  } catch (error) {
    console.log('Course link not found. Check the screen text and update the selector if needed.');
    console.log(error.message);
    await browser.close();
    return;
  }

  await page.getByRole('link', { name: /assignments/i }).click();
  await page.waitForSelector('.assignment-list, .ig-row, .ig-title', { timeout: 30000 });

  const assignmentRows = page.locator('.assignment-list .ig-row, .ig-row, .student_assignment');
  const count = await assignmentRows.count();
  const scrapedAssignments = [];

  console.log(`Detected ${count} assignment rows. Extracting DOM elements...`);

  for (let i = 0; i < count; i++) {
    const row = assignmentRows.nth(i);

    try {
      const title = await row.locator('.ig-title, .title, .assignment-name').first().innerText().catch(() => '');
      const dueDate = await row.locator('.assignment-date-due, .due-date, .date').first().innerText().catch(() => 'No due date');
      const status = await row.locator('.submission-status-container, .submission-status, .status').first().innerText().catch(() => 'Not Submitted / Available');

      if (!title || !title.trim()) {
        continue;
      }

      scrapedAssignments.push({
        title: title.trim().replace(/\s+/g, ' '),
        dueDate: dueDate.trim().replace(/\s+/g, ' '),
        status: status.trim().replace(/\s+/g, ' ')
      });
    } catch (error) {
      console.log(`Skipped one row because the selector did not match: ${error.message}`);
    }
  }

  console.log('\n--- SCRAPED ASSIGNMENT DATA ---');
  console.table(scrapedAssignments);

  const outputFilename = 'canvas_assignments.json';
  fs.writeFileSync(outputFilename, JSON.stringify(scrapedAssignments, null, 2), 'utf-8');
  console.log(`\nSuccess! Clean JSON dataset saved locally to: ./${outputFilename}`);

 
  await page.waitForTimeout(5000);
  await browser.close();
}

scrapeALUCanvas().catch((error) => {
  console.error('Scraper failed:', error);
  process.exit(1);
});