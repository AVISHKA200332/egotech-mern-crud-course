/**
 * E2E tests — Homepage (index.html)
 *
 * Covers: navbar, hero CTAs, stats, section anchors,
 * module cards, scroll-to-top, and footer injection.
 */

// @ts-check
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  // ── Page basics ─────────────────────────────────────────────

  test('page title contains "MERN CRUD"', async ({ page }) => {
    await expect(page).toHaveTitle(/MERN CRUD/i);
  });

  test('navbar brand "EgoTECH" is visible', async ({ page }) => {
    const brand = page.locator('.navbar-brand');
    await expect(brand).toBeVisible();
    await expect(brand).toContainText('EgoTECH');
  });

  // ── Hero section ─────────────────────────────────────────────

  test('"Start Learning" CTA is visible in hero', async ({ page }) => {
    const cta = page.locator('a.btn', { hasText: 'Start Learning' }).first();
    await expect(cta).toBeVisible();
  });

  test('"Start Learning" CTA navigates to module1.html', async ({ page }) => {
    await page.locator('a.btn', { hasText: 'Start Learning' }).first().click();
    await expect(page).toHaveURL(/module1\.html/);
  });

  test('"View Modules" link is present and points to #modules', async ({ page }) => {
    const link = page.locator('a[href="#modules"]').first();
    await expect(link).toBeVisible();
  });

  // ── Stats strip ──────────────────────────────────────────────

  test('stats strip shows "10" modules', async ({ page }) => {
    const stats = page.locator('.fw-800.text-primary').first();
    await expect(stats).toContainText('10');
  });

  // ── Section IDs ──────────────────────────────────────────────

  test('#outcomes section is on the page', async ({ page }) => {
    const section = page.locator('#outcomes');
    await expect(section).toBeAttached();
  });

  test('#roadmap section is on the page', async ({ page }) => {
    await expect(page.locator('#roadmap')).toBeAttached();
  });

  test('#modules section is on the page', async ({ page }) => {
    await expect(page.locator('#modules')).toBeAttached();
  });

  // ── Module cards ─────────────────────────────────────────────

  test('module cards section contains 11 cards (00–10)', async ({ page }) => {
    const cards = page.locator('#modules .module-card');
    // 11 = requirements(00) + modules 1–10
    await expect(cards).toHaveCount(11);
  });

  test('"Start Module 1" card button links to module1.html', async ({ page }) => {
    const btn = page.locator('a[href="module1.html"]').first();
    await expect(btn).toBeVisible();
  });

  test('"View Requirements" card button links to requirements.html', async ({ page }) => {
    const btn = page.locator('a[href="requirements.html"]').first();
    await expect(btn).toBeVisible();
  });

  // ── Navbar dropdown ──────────────────────────────────────────

  test('Modules dropdown opens on click', async ({ page }) => {
    await page.locator('.navbar .dropdown-toggle').first().click();
    const menu = page.locator('.dropdown-menu').first();
    await expect(menu).toBeVisible();
  });

  test('Modules dropdown contains module1.html link', async ({ page }) => {
    await page.locator('.navbar .dropdown-toggle').first().click();
    const item = page.locator('.dropdown-menu a[href="module1.html"]').first();
    await expect(item).toBeVisible();
  });

  // ── Footer (injected by script.js) ───────────────────────────

  test('footer is injected and visible', async ({ page }) => {
    const footer = page.locator('footer.footer');
    await expect(footer).toBeVisible();
  });

  test('footer contains current year', async ({ page }) => {
    const year = String(new Date().getFullYear());
    const footerYear = page.locator('#footer-year');
    await expect(footerYear).toContainText(year);
  });

  // ── Scroll-to-top button ─────────────────────────────────────

  test('scroll-to-top button appears after scrolling down', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 500));
    const btn = page.locator('#scrollTop');
    await expect(btn).toHaveClass(/show/);
  });

  test('scroll-to-top button is hidden at the top of page', async ({ page }) => {
    const btn = page.locator('#scrollTop');
    // Should not have .show at page load (top position)
    await expect(btn).not.toHaveClass(/show/);
  });

  // ── Why MERN section ─────────────────────────────────────────

  test('Why Learn MERN section has 4 benefit cards', async ({ page }) => {
    const cards = page.locator('.why-card');
    await expect(cards).toHaveCount(4);
  });

  // ── Career section ───────────────────────────────────────────

  test('Career Opportunities section is present', async ({ page }) => {
    await expect(page.locator('text=Career Opportunities')).toBeVisible();
  });

  // ── CTA banner ───────────────────────────────────────────────

  test('final CTA banner has "Ready to Start Building?" heading', async ({ page }) => {
    await expect(page.locator('text=Ready to Start Building')).toBeVisible();
  });
});
