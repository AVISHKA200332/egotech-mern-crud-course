/**
 * E2E tests — Module pages (module1.html used as representative)
 *
 * Covers: hero, sidebar, section anchors, copy buttons,
 * module nav bar, and localStorage progress tracking.
 */

// @ts-check
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';

test.describe('Module 1 page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/module1.html`);
  });

  // ── Page basics ─────────────────────────────────────────────

  test('page title contains "Module 1"', async ({ page }) => {
    await expect(page).toHaveTitle(/Module 1/i);
  });

  test('navbar brand "EgoTECH" is visible', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toContainText('EgoTECH');
  });

  test('module hero section is visible', async ({ page }) => {
    await expect(page.locator('.module-hero')).toBeVisible();
  });

  test('module badge shows "Module 1"', async ({ page }) => {
    await expect(page.locator('.module-badge')).toContainText('Module 1');
  });

  // ── Sidebar ──────────────────────────────────────────────────

  test('sidebar is present with section links', async ({ page }) => {
    const sidebar = page.locator('.module-sidebar');
    await expect(sidebar).toBeVisible();
  });

  test('sidebar has at least 6 section navigation links', async ({ page }) => {
    const links = page.locator('.sidebar-nav-card .nav-link');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  // ── Section anchors ──────────────────────────────────────────

  test('#objectives section exists', async ({ page }) => {
    await expect(page.locator('#objectives')).toBeAttached();
  });

  test('#what-mern section exists', async ({ page }) => {
    await expect(page.locator('#what-mern')).toBeAttached();
  });

  test('#architecture section exists', async ({ page }) => {
    await expect(page.locator('#architecture')).toBeAttached();
  });

  test('sidebar link to #objectives scrolls to that section', async ({ page }) => {
    await page.locator('a[href="#objectives"]').first().click();
    const section = page.locator('#objectives');
    await expect(section).toBeInViewport();
  });

  // ── Copy code buttons ────────────────────────────────────────

  test('at least one code block with copy button is present', async ({ page }) => {
    const headers = page.locator('.code-header');
    const count = await headers.count();
    // module1 has at least 1 code block
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('copy button shows "Copied!" after click and reverts', async ({ page }) => {
    const btn = page.locator('.code-header button').first();
    await btn.click();
    await expect(btn).toContainText('Copied!');
    // Wait for revert (2s + buffer)
    await page.waitForTimeout(2200);
    await expect(btn).toContainText('Copy');
  });

  // ── Module nav bar ───────────────────────────────────────────

  test('module nav bar is present at page bottom', async ({ page }) => {
    await expect(page.locator('.module-nav-bar')).toBeVisible();
  });

  test('Next Module button links to module2.html', async ({ page }) => {
    const nextBtn = page.locator('.btn-mod-next');
    const href = await nextBtn.getAttribute('href');
    expect(href).toContain('module2.html');
  });

  test('Home/Back button links to index.html', async ({ page }) => {
    const prevBtn = page.locator('.btn-mod-prev');
    const href = await prevBtn.getAttribute('href');
    expect(href).toContain('index.html');
  });

  // ── Footer ───────────────────────────────────────────────────

  test('footer is present', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });

  // ── Progress tracking ────────────────────────────────────────

  test('visiting module1.html stores 1 in localStorage egotech_visited', async ({ page }) => {
    const visited = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('egotech_visited') || '[]')
    );
    expect(visited).toContain(1);
  });
});

// ────────────────────────────────────────────────────────────────

test.describe('Module nav – previous/next chain', () => {
  test('module2.html next button links to module3.html', async ({ page }) => {
    await page.goto(`${BASE}/module2.html`);
    const href = await page.locator('.btn-mod-next').getAttribute('href');
    expect(href).toContain('module3.html');
  });

  test('module2.html prev button links to module1.html', async ({ page }) => {
    await page.goto(`${BASE}/module2.html`);
    const href = await page.locator('.btn-mod-prev').getAttribute('href');
    expect(href).toContain('module1.html');
  });
});

// ────────────────────────────────────────────────────────────────

test.describe('localStorage progress tracking — multiple modules', () => {
  test('visiting module1 then module3 stores both', async ({ page }) => {
    await page.goto(`${BASE}/module1.html`);
    await page.goto(`${BASE}/module3.html`);

    const visited = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('egotech_visited') || '[]')
    );
    expect(visited).toContain(1);
    expect(visited).toContain(3);
  });

  test('revisiting module1 does not duplicate entry', async ({ page }) => {
    await page.goto(`${BASE}/module1.html`);
    await page.goto(`${BASE}/module1.html`);

    const visited = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('egotech_visited') || '[]')
    );
    expect(visited.filter((/** @type {number} */ n) => n === 1).length).toBe(1);
  });
});
