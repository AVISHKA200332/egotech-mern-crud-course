/**
 * E2E tests — Cross-page navigation & active nav highlighting
 *
 * Verifies that clicking links navigates correctly, active nav
 * classes are applied per page, and the footer/navbar components
 * are consistently present.
 */

// @ts-check
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';

// ── Pages that use the injected navbar component ──────────────
const COMPONENT_PAGES = [
  { url: `${BASE}/index.html`,        filename: 'index.html' },
  { url: `${BASE}/requirements.html`, filename: 'requirements.html' },
];

// ── Pages that use inline hardcoded navbars ───────────────────
const MODULE_PAGES = Array.from({ length: 10 }, (_, i) => ({
  url:      `${BASE}/module${i + 1}.html`,
  filename: `module${i + 1}.html`,
  num:      i + 1,
}));

// ────────────────────────────────────────────────────────────────

test.describe('Brand logo navigation', () => {
  test('clicking EgoTECH brand on index.html stays on index', async ({ page }) => {
    await page.goto(`${BASE}/index.html`);
    await page.locator('.navbar-brand').first().click();
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

  test('clicking EgoTECH brand on module1.html navigates to index.html', async ({ page }) => {
    await page.goto(`${BASE}/module1.html`);
    await page.locator('.navbar-brand').first().click();
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

  test('brand logo text on all module pages is "EgoTECH"', async ({ page }) => {
    for (const { url } of MODULE_PAGES) {
      await page.goto(url);
      const brand = page.locator('.navbar-brand').first();
      await expect(brand).toContainText('EgoTECH');
    }
  });
});

// ────────────────────────────────────────────────────────────────

test.describe('Navbar component pages — active link', () => {
  test('Home nav link is active on index.html', async ({ page }) => {
    await page.goto(`${BASE}/index.html`);
    const homeLink = page.locator('#navbar-placeholder a.nav-link[href="index.html"]');
    await expect(homeLink).toHaveClass(/active/);
  });
});

// ────────────────────────────────────────────────────────────────

test.describe('Footer consistency', () => {
  test.each(COMPONENT_PAGES)(
    'footer is injected on $filename',
    async ({ url }, { page }) => {
      await page.goto(url);
      await expect(page.locator('footer.footer')).toBeVisible();
    }
  );

  test.each(MODULE_PAGES)(
    'footer is present on module$num.html',
    async ({ url }, { page }) => {
      await page.goto(url);
      await expect(page.locator('footer')).toBeVisible();
    }
  );

  test('footer year is correct on index.html', async ({ page }) => {
    await page.goto(`${BASE}/index.html`);
    const year = String(new Date().getFullYear());
    await expect(page.locator('#footer-year')).toContainText(year);
  });

  test('footer social icons are present (5 icons)', async ({ page }) => {
    await page.goto(`${BASE}/index.html`);
    const icons = page.locator('.footer-social a');
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });
});

// ────────────────────────────────────────────────────────────────

test.describe('Module card CTAs on homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/index.html`);
  });

  test('"Start Module 1" button navigates to module1.html', async ({ page }) => {
    await page.locator('a[href="module1.html"].btn').first().click();
    await expect(page).toHaveURL(/module1\.html/);
  });

  test('"View Requirements" button navigates to requirements.html', async ({ page }) => {
    await page.locator('a[href="requirements.html"]').first().click();
    await expect(page).toHaveURL(/requirements\.html/);
  });
});

// ────────────────────────────────────────────────────────────────

test.describe('Requirements page navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/requirements.html`);
  });

  test('page loads with SRS title in hero', async ({ page }) => {
    await expect(page.locator('.module-hero h1')).toContainText('Software Requirements');
  });

  test('sidebar has 16 navigation links', async ({ page }) => {
    const links = page.locator('#srs-nav .nav-link');
    await expect(links).toHaveCount(16);
  });

  test('clicking "Go to Module 1" button navigates to module1.html', async ({ page }) => {
    await page.locator('a[href="module1.html"]').first().click();
    await expect(page).toHaveURL(/module1\.html/);
  });

  test('clicking "Back to Home" button navigates to index.html', async ({ page }) => {
    await page.locator('a.btn-mod-prev').click();
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

  test('#introduction section is present', async ({ page }) => {
    await expect(page.locator('#introduction')).toBeAttached();
  });

  test('#acceptance section is present', async ({ page }) => {
    await expect(page.locator('#acceptance')).toBeAttached();
  });
});

// ────────────────────────────────────────────────────────────────

test.describe('Setup guide page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/setup-guide.html`);
  });

  test('page loads with "Setup Guide" content', async ({ page }) => {
    await expect(page.locator('.module-badge')).toContainText('Setup Guide');
  });

  test('has 3 content sections (Install, Extensions, Verify)', async ({ page }) => {
    const sections = page.locator('.content-section');
    const count = await sections.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('navbar brand links back to index.html', async ({ page }) => {
    await page.locator('.navbar-brand').click();
    await expect(page).toHaveURL(/index\.html|\/$/);
  });
});

// ────────────────────────────────────────────────────────────────

test.describe('Responsive layout — mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('navbar toggler is visible on mobile', async ({ page }) => {
    await page.goto(`${BASE}/index.html`);
    await expect(page.locator('.navbar-toggler')).toBeVisible();
  });

  test('toggler opens the nav menu on click', async ({ page }) => {
    await page.goto(`${BASE}/index.html`);
    await page.locator('.navbar-toggler').first().click();
    // The collapsible nav should become visible
    const navCollapse = page.locator('#mainNav, .navbar-collapse').first();
    await expect(navCollapse).toBeVisible();
  });

  test('requirements.html is accessible on mobile', async ({ page }) => {
    await page.goto(`${BASE}/requirements.html`);
    await expect(page.locator('.module-hero')).toBeVisible();
  });
});
