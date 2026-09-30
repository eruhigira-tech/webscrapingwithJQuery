const fs = require('fs');
const { JSDOM } = require('jsdom');
const factory = require('jquery/factory');

const jQueryFactory = factory.jQueryFactory || factory;

const BASE_URL = 'https://alueducation.instructure.com';

const STATUS_WORDS = /(not submitted|submitted|missing|late|graded|excused|resubmitted)/i;
const DUE_TEXT = /due[^\n]*?(?:\d{1,2}(?::\d{2})?\s?(?:am|pm)|\d{4})/i;

function clean(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function scrapeData() {
  const html = fs.readFileSync('dom.html', 'utf-8');
  const { window } = new JSDOM(html);
  const $ = jQueryFactory(window);

  let rows = $('.ig-row');

  if (rows.length === 0) {
    const found = new Set();
    $('a[href*="/assignments/"]').each((i, a) => {
      const box = $(a).closest('li, tr, [class*="PlannerItem"]');
      if (box.length) found.add(box[0]);
    });
    rows = $(Array.from(found));
  }

  if (rows.length === 0) {
    if ($('#dashboard-planner').children().length === 0) {
      console.log('The planner on this page is empty. Canvas fills it in with JavaScript,');
      console.log('so the saved HTML has no assignments. Copy the HTML again after the');
      console.log('assignments are visible on screen (Elements tab > Copy outerHTML).');
    } else {
      console.log('No assignments found. Check the class names in dom.html.');
    }
    return;
  }

  rows.each((i, el) => {
    const row = $(el);

    let titleEl = row.find('.ig-title').first();
    if (!titleEl.length) titleEl = row.find('a[href*="/assignments/"]').first();
    const title = clean(titleEl.text()) || 'N/A';
    const anchor = titleEl.is('a') ? titleEl : titleEl.find('a').first();
    const href = anchor.attr('href');
    const link = href ? new URL(href, BASE_URL).href : null;

    let status = clean(row.find('.status, .submission-status, .status-pill').first().text());
    if (!status) {
      const match = clean(row.text()).match(STATUS_WORDS);
      status = match ? match[0] : 'N/A';
    }

  
    let due = clean(row.find('.due_date_display, .assignment-date-due, .due-date').first().text());
    if (!due) {
      const match = clean(row.text()).match(DUE_TEXT);
      due = match ? clean(match[0]) : 'No due date';
    }

    console.log(`Assignment Title: ${title}`);
    console.log(`Status: ${status}`);
    console.log(`Due Date: ${due}`);
    if (link) console.log(`Link: ${link}`);
    console.log('-'.repeat(40));
  });
}

scrapeData();const fs = require('fs');
const { JSDOM } = require('jsdom');
const jQueryFactory = require('jquery/factory');
const BASE_URL =
  'https://alueducatioconst fs = require('fs');
const { JSDOM } = require('jsdom');
const jQueryFactory = require('jquery/factory');


const BASE_URL = 'https://alueducation.instructure.com';

const STATUS_WORDS = /(not submitted|submitted|missing|late|graded|excused|resubmitted)/i;
const DUE_TEXT = /due[^\n]*?(?:\d{1,2}(?::\d{2})?\s?(?:am|pm)|\d{4})/i;

function clean(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function scrapeData() {
  const html = fs.readFileSync('dom.html', 'utf-8');
  const { window } = new JSDOM(html);
  const $ = jQueryFactory(window);


  let rows = $('.ig-row');

  if (rows.length === 0) {
    const found = new Set();
    $('a[href*="/assignments/"]').each((i, a) => {
      const box = $(a).closest('li, tr, [class*="PlannerItem"]');
      if (box.length) found.add(box[0]);
    });
    rows = $(Array.from(found));
  }

  if (rows.length === 0) {
    if ($('#dashboard-planner').children().length === 0) {
      console.log('The planner on this page is empty. Canvas fills it in with JavaScript,');
      console.log('so the saved HTML has no assignments. Copy the HTML again after the');
      console.log('assignments are visible on screen (Elements tab > Copy outerHTML).');
    } else {
      console.log('No assignments found. Check the class names in dom.html.');
    }
    return;
  }

  rows.each((i, el) => {
    const row = $(el);

  
    let titleEl = row.find('.ig-title').first();
    if (!titleEl.length) titleEl = row.find('a[href*="/assignments/"]').first();
    const title = clean(titleEl.text()) || 'N/A';
    const anchor = titleEl.is('a') ? titleEl : titleEl.find('a').first();
    const href = anchor.attr('href');
    const link = href ? new URL(href, BASE_URL).href : null;

  
    let status = clean(row.find('.status, .submission-status, .status-pill').first().text());
    if (!status) {
      const match = clean(row.text()).match(STATUS_WORDS);
      status = match ? match[0] : 'N/A';
    }

  
    let due = clean(row.find('.due_date_display, .assignment-date-due, .due-date').first().text());
    if (!due) {
      const match = clean(row.text()).match(DUE_TEXT);
      due = match ? clean(match[0]) : 'No due date';
    }

    console.log(`Assignment Title: ${title}`);
    console.log(`Status: ${status}`);
    console.log(`Due Date: ${due}`);
    if (link) console.log(`Link: ${link}`);
    console.log('-'.repeat(40));
  });
}

scrapeData();n.instructure.com/';

const STATUS_WORDS = /(not submitted|submitted|missing|late|graded|excused|resubmitted)/i;
const DUE_TEXT = /due[^\n]*?(?:\d{1,2}(?::\d{2})?\s?(?:am|pm)|\d{4})/i;

function clean(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function scrapeData() {
  const html = fs.readFileSync('dom.html', 'utf-8');
  const { window } = new JSDOM(html);
  const $ = jQueryFactory(window);

  const rows = $('.ig-row');

  if (rows.length === 0) {
    console.log('No assignment rows found. Open dom.html and check the class names.');
    return;
  }

  rows.each((i, el) => {
    const row = $(el);

  
    const titleEl = row.find('.ig-title').first();
    const title = clean(titleEl.text()) || 'N/A';
    const anchor = titleEl.is('a') ? titleEl : titleEl.find('a').first();
    const href = anchor.attr('href');
    const link = href ? new URL(href, BASE_URL).href : null;

   
    let status = clean(row.find('.status, .submission-status, .status-pill').first().text());
    if (!status) {
      const match = clean(row.text()).match(STATUS_WORDS);
      status = match ? match[0] : 'N/A';
    }


    let due = clean(row.find('.due_date_display, .assignment-date-due, .due-date').first().text());
    if (!due) {
      const match = clean(row.text()).match(DUE_TEXT);
      due = match ? clean(match[0]) : 'No due date';
    }

    console.log(`Assignment Title: ${title}`);
    console.log(`Status: ${status}`);
    console.log(`Due Date: ${due}`);
    if (link) console.log(`Link: ${link}`);
    console.log('-'.repeat(40));
  });
}

scrapeData();