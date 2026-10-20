import { test, expect } from '@playwright/test';

const browserErrors = new WeakMap();
test.beforeEach(async ({ page }) => {
  const errors = [];
  browserErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
});
test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page), 'The browser should have no runtime errors').toEqual([]);
});

test('student search, filters, pagination, and CSV export work', async ({ page }) => {
  await page.goto('/admin/students');
  await expect(page.getByRole('heading', { name: 'Students', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(page.getByText('Page 2 of 2', { exact: false })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search by name or student ID...' }).fill('Sofia');
  await expect(page.getByRole('table').getByText('Sofia Rahman')).toBeVisible();
  await expect(page.getByRole('table').getByText('Aarav Hassan')).toHaveCount(0);
  await page.getByLabel('Filter status').selectOption('Probation');
  await expect(page.getByRole('heading', { name: 'No students found' })).toBeVisible();
  await page.getByLabel('Filter status').selectOption('All statuses');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('students.csv');
});

test('new students persist across navigation, reject duplicates, and reset on refresh', async ({ page }) => {
  await page.goto('/admin/students/new');
  await page.getByLabel('Student ID *', { exact: true }).fill('25-00999-1');
  await page.getByLabel('Full name *', { exact: true }).fill('Taylor Demo');
  await page.getByLabel('Email address *').fill('taylor@example.edu');
  await page.getByLabel('Department *', { exact: true }).selectOption('Computer Science');
  await page.getByLabel('Assigned advisor *').selectOption('a1');
  await page.getByRole('button', { name: 'Add student', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Taylor Demo' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to students' }).click();
  await page.getByRole('link', { name: 'Add student', exact: true }).click();
  await page.getByLabel('Student ID *', { exact: true }).fill('25-00999-1');
  await page.getByLabel('Full name *', { exact: true }).fill('Duplicate Student');
  await page.getByLabel('Email address *').fill('duplicate@example.edu');
  await page.getByLabel('Department *', { exact: true }).selectOption('Computer Science');
  await page.getByLabel('Assigned advisor *').selectOption('a1');
  await page.getByRole('button', { name: 'Add student', exact: true }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('already exists');
  await page.reload();
  await page.getByRole('link', { name: 'Back to students' }).click();
  await page.getByRole('textbox', { name: 'Search by name or student ID...' }).fill('Taylor Demo');
  await expect(page.getByRole('heading', { name: 'No students found' })).toBeVisible();
});

test('result edits invalidate the current evaluation and repeated evaluation preserves earlier history', async ({ page }) => {
  await page.goto('/admin/results');
  await page.getByLabel('Semester GPA *').fill('2.40');
  await page.getByLabel('Cumulative GPA *').fill('2.51');
  await page.getByLabel('Semester credits *').fill('15');
  await page.getByRole('button', { name: 'Save result', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Demo result saved');
  await page.getByRole('link', { name: 'Probation records', exact: false }).click();
  await expect(page.locator('.case-item').filter({ hasText: 'Aarav Hassan' })).toHaveCount(0);
  await page.getByLabel('Predefined demo outcome *').selectOption('Recovered');
  await page.getByRole('button', { name: 'Run demo evaluation' }).click();
  await expect(page.locator('.case-item').filter({ hasText: 'Aarav Hassan' })).toContainText('Recovered');
  await page.getByLabel('Predefined demo outcome *').selectOption('Good standing');
  await page.getByRole('button', { name: 'Run demo evaluation' }).click();
  const current = page.locator('.case-item').filter({ hasText: 'Aarav Hassan' });
  await expect(current).toHaveCount(1);
  await expect(current).toContainText('Good standing');
  await page.getByRole('link', { name: 'Students', exact: true }).click();
  await page.getByRole('link', { name: /Aarav Hassan 23-10482-1/ }).click();
  const history = page.locator('.case-item').filter({ hasText: 'Aarav Hassan' });
  await expect(history).toHaveCount(2);
  await expect(history.filter({ hasText: 'Summer 2026' })).toContainText('Probation');
  await expect(page.getByRole('row').filter({ hasText: 'Fall 2026' }).first()).toContainText('2.51');
});

test('advisor notes are shared with the selected student and identities stay scoped', async ({ page }) => {
  await page.goto('/advisor/feedback');
  await page.getByLabel('Meeting note *').fill('Browser check: reviewed the study schedule.');
  await page.getByLabel('Action plan *').fill('Attend tutoring on Tuesday.');
  await page.getByRole('button', { name: 'Add advising note', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Advising note added');
  await page.getByLabel('Demo role', { exact: true }).selectOption('student');
  await page.getByRole('link', { name: 'Advisor feedback', exact: true }).click();
  await expect(page.locator('.note-card').filter({ hasText: 'Browser check:' })).toContainText('Attend tutoring on Tuesday.');
  await page.getByLabel('Demo student', { exact: true }).selectOption('23-10516-2');
  await expect(page.getByRole('heading', { name: 'No advising notes yet' })).toBeVisible();
  await page.getByLabel('Demo role', { exact: true }).selectOption('advisor');
  await page.getByLabel('Demo advisor', { exact: true }).selectOption('a2');
  await page.getByRole('link', { name: 'My students', exact: true }).click();
  await expect(page.getByRole('table').getByText('Aarav Hassan')).toHaveCount(0);
  await expect(page.getByRole('table').getByText('Sofia Rahman')).toBeVisible();
});

test('mobile navigation and dashboard layout stay usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Student progress/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: 'test-results/landing-mobile.png', fullPage: true, caret: 'initial' });
  await page.getByRole('link', { name: 'View dashboard', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search students...' }).fill('Aarav');
  await expect(page.locator('.student-overview tbody tr')).toHaveCount(1);
  await page.getByRole('textbox', { name: 'Search students...' }).fill('');
  await expect(page.locator('.student-overview tbody tr')).toHaveCount(5);
  await page.screenshot({ path: 'test-results/dashboard-mobile.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await page.getByRole('link', { name: 'Students', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Students', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).not.toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/dashboard-desktop.png', fullPage: true });
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Student progress/ })).toBeVisible();
  await expect(page.locator('.landing-feature')).toHaveCount(6);
  await page.screenshot({ path: 'test-results/landing-desktop.png', fullPage: true, caret: 'initial' });
  await page.locator('.landing-feature').filter({ hasText: 'Academic results' }).click();
  await expect(page.getByRole('heading', { name: 'Academic results', exact: true })).toBeVisible();
});

test('semester management validates dates and new advisors appear in assignment forms', async ({ page }) => {
  await page.goto('/admin/semesters');
  await page.getByRole('button', { name: 'Add semester', exact: true }).click();
  await page.getByLabel('Semester name *').fill('Spring 2027');
  await page.getByLabel('Start date *').fill('2027-05-01');
  await page.getByLabel('End date *').fill('2027-04-20');
  await page.getByRole('button', { name: 'Add semester', exact: true }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('end date must be after');
  await page.getByLabel('Start date *').fill('2027-01-01');
  await page.getByRole('button', { name: 'Add semester', exact: true }).click();
  await page.getByRole('row').filter({ hasText: 'Spring 2027' }).getByRole('button', { name: 'Select semester', exact: true }).click();
  await page.getByRole('link', { name: 'Academic results', exact: true }).click();
  await expect(page.getByLabel('Selected semester', { exact: true })).toHaveValue(await page.getByLabel('Semester *', { exact: true }).inputValue());
  await expect(page.getByRole('heading', { name: 'No results yet' })).toBeVisible();
  await page.getByRole('link', { name: 'Advisors', exact: true }).click();
  await page.getByRole('button', { name: 'Add advisor', exact: true }).click();
  await page.getByLabel('Full name *').fill('Dr. Taylor Smith');
  await page.getByLabel('Email *', { exact: true }).fill('taylor.smith@example.edu');
  await page.getByRole('button', { name: 'Add advisor', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dr. Taylor Smith' })).toBeVisible();
  await page.getByRole('link', { name: 'Students', exact: true }).click();
  await page.getByRole('link', { name: 'Add student', exact: true }).click();
  await expect(page.getByLabel('Assigned advisor *').getByRole('option', { name: 'Dr. Taylor Smith' })).toHaveCount(1);
});
