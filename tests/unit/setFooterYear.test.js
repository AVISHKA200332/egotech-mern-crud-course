/**
 * Unit tests — setFooterYear()
 *
 * Verifies the function writes the current year into #footer-year
 * and handles the case where the element is absent.
 */

'use strict';

/* ── Inline implementation (mirrors script.js exactly) ── */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ────────────────────────────────────────────────────────────────

describe('setFooterYear()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('sets textContent to the current year when #footer-year exists', () => {
    document.body.innerHTML = '<span id="footer-year"></span>';
    setFooterYear();
    const el = document.getElementById('footer-year');
    expect(el.textContent).toBe(String(new Date().getFullYear()));
  });

  test('written year is a 4-digit number', () => {
    document.body.innerHTML = '<span id="footer-year"></span>';
    setFooterYear();
    const year = parseInt(document.getElementById('footer-year').textContent, 10);
    expect(year).toBeGreaterThanOrEqual(2024);
    expect(year).toBeLessThanOrEqual(2100);
  });

  test('does not throw when #footer-year is absent', () => {
    // No element in DOM — should silently do nothing
    expect(() => setFooterYear()).not.toThrow();
  });

  test('does not create a #footer-year element if absent', () => {
    setFooterYear();
    expect(document.getElementById('footer-year')).toBeNull();
  });
});
