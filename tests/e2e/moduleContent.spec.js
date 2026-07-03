/**
 * E2E tests — Module-specific content & section anchors (modules 2–10)
 *
 * module1 is already fully covered by modulePage.spec.js.
 * This file tests each remaining module's unique first-party sections,
 * hero badge, and next/prev navigation chain.
 */

// @ts-check
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';

// ── Per-module config: unique section anchor + expected badge text ──
const MODULE_CONFIG = [
  {
    num: 2,
    badge: 'Module 2',
    sections: ['#objectives', '#software-req', '#nodejs', '#vscode', '#atlas', '#folder', '#git-setup', '#verify'],
    prevHref: /module1/,
    nextHref: /module3/,
  },
  {
    num: 3,
    badge: 'Module 3',
    sections: ['#objectives', '#nodejs-explained', '#express-explained', '#npm-setup', '#server-js', '#middleware', '#routing'],
    prevHref: /module2/,
    nextHref: /module4/,
  },
  {
    num: 4,
    badge: 'Module 4',
    sections: ['#objectives', '#what-mongo', '#sql-vs-nosql', '#erd', '#mongoose', '#model', '#db-connect', '#queries'],
    prevHref: /module3/,
    nextHref: /module5/,
  },
  {
    num: 5,
    badge: 'Module 5',
    sections: ['#objectives', '#rest-basics', '#endpoints', '#responses', '#postman', '#wrap-up'],
    prevHref: /module4/,
    nextHref: /module6/,
  },
  {
    num: 6,
    badge: 'Module 6',
    sections: ['#objectives', '#react-intro', '#project-setup', '#components', '#state', '#forms', '#styling', '#wrap-up'],
    prevHref: /module5/,
    nextHref: /module7/,
  },
  {
    num: 7,
    badge: 'Module 7',
    sections: ['#objectives', '#data-flow', '#axios', '#cors', '#fetching', '#env', '#debugging', '#wrap-up'],
    prevHref: /module6/,
    nextHref: /module8/,
  },
  {
    num: 8,
    badge: 'Module 8',
    sections: ['#objectives', '#crud-map', '#create', '#read', '#update', '#delete', '#ui-feedback', '#wrap-up'],
    prevHref: /module7/,
    nextHref: /module9/,
  },
  {
    num: 9,
    badge: 'Module 9',
    sections: ['#objectives', '#deployment-map', '#backend', '#frontend', '#database', '#troubleshooting', '#wrap-up'],
    prevHref: /module8/,
    nextHref: /module10/,
  },
  {
    num: 10,
    badge: 'Module 10',
    sections: ['#objectives', '#final-project', '#best-practices', '#summary', '#responsibilities', '#checklist', '#next-steps'],
    prevHref: /module9/,
    nextHref: /index\.html|modules/,
  },
];

// ────────────────────────────────────────────────────────────────

for (const mod of MODULE_CONFIG) {
  test.describe(`Module ${mod.num} page`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE}/module${mod.num}.html`);
    });

    // ── Page basics ───────────────────────────────────────────

    test(`page title contains "Module ${mod.num}"`, async ({ page }) => {
      await expect(page).toHaveTitle(new RegExp(`Module ${mod.num}`, 'i'));
    });

    test('navbar brand "EgoTECH" is visible', async ({ page }) => {
      await expect(page.locator('.navbar-brand').first()).toContainText('EgoTECH');
    });

    test('module hero section is visible', async ({ page }) => {
      await expect(page.locator('.module-hero')).toBeVisible();
    });

    test(`module badge shows "${mod.badge}"`, async ({ page }) => {
      await expect(page.locator('.module-badge').first()).toContainText(mod.badge);
    });

    // ── Section anchors ───────────────────────────────────────

    for (const sectionId of mod.sections) {
      test(`${sectionId} section exists in the DOM`, async ({ page }) => {
        await expect(page.locator(sectionId)).toBeAttached();
      });
    }

    // ── Sidebar ───────────────────────────────────────────────

    test('sidebar is present', async ({ page }) => {
      await expect(page.locator('.module-sidebar')).toBeVisible();
    });

    test('sidebar has at least 3 navigation links', async ({ page }) => {
      const count = await page.locator('.sidebar-nav-card .nav-link').count();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    // ── Module nav bar ────────────────────────────────────────

    test('module nav bar is present', async ({ page }) => {
      await expect(page.locator('.module-nav-bar')).toBeVisible();
    });

    test('Previous button links to correct previous module', async ({ page }) => {
      const href = await page.locator('.btn-mod-prev').getAttribute('href');
      expect(href).toMatch(mod.prevHref);
    });

    test('Next button links to correct next module', async ({ page }) => {
      const href = await page.locator('.btn-mod-next').getAttribute('href');
      expect(href).toMatch(mod.nextHref);
    });

    // ── Footer ────────────────────────────────────────────────

    test('footer is present', async ({ page }) => {
      await expect(page.locator('footer')).toBeVisible();
    });

    // ── Scroll-to-top ─────────────────────────────────────────

    test('#scrollTop button exists', async ({ page }) => {
      await expect(page.locator('#scrollTop')).toBeAttached();
    });

    // ── LocalStorage tracking ─────────────────────────────────

    test(`visiting records module ${mod.num} in localStorage`, async ({ page }) => {
      const visited = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('egotech_visited') || '[]')
      );
      expect(visited).toContain(mod.num);
    });
  });
}

// ────────────────────────────────────────────────────────────────

test.describe('Full module chain navigation', () => {
  test('can navigate module 1 → 2 → 3 via Next buttons', async ({ page }) => {
    await page.goto(`${BASE}/module1.html`);
    await page.locator('.btn-mod-next').click();
    await expect(page).toHaveURL(/module2\.html/);
    await page.locator('.btn-mod-next').click();
    await expect(page).toHaveURL(/module3\.html/);
  });

  test('can navigate module 10 → 9 → 8 via Prev buttons', async ({ page }) => {
    await page.goto(`${BASE}/module10.html`);
    await page.locator('.btn-mod-prev').click();
    await expect(page).toHaveURL(/module9\.html/);
    await page.locator('.btn-mod-prev').click();
    await expect(page).toHaveURL(/module8\.html/);
  });
});

// ────────────────────────────────────────────────────────────────

test.describe('Progress bar on module pages', () => {
  const progressPages = [
    { num: 2, expected: '40%' },
    { num: 3, expected: '60%' },
    { num: 4, expected: '80%' },
    { num: 5, expected: '50%' },
  ];

  for (const { num, expected } of progressPages) {
    test(`module${num}.html progress track fill is ${expected}`, async ({ page }) => {
      await page.goto(`${BASE}/module${num}.html`);
      const fill = page.locator('.progress-track .fill');
      await expect(fill).toBeVisible();
      const style = await fill.getAttribute('style');
      expect(style).toContain(expected);
    });
  }
});
