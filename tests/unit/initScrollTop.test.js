/**
 * Unit tests — initScrollTop()
 *
 * Verifies the scroll-to-top button visibility toggle and
 * click-to-scroll behaviour.
 */

'use strict';

/* ── Inline implementation (mirrors script.js exactly) ── */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Helpers ────────────────────────────────────────────────────
function buildScrollBtn() {
  document.body.innerHTML = '<button id="scrollTop" aria-label="Scroll to top"></button>';
}

function fireScrollEvent(scrollY) {
  Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: scrollY });
  window.dispatchEvent(new Event('scroll'));
}

// ────────────────────────────────────────────────────────────────

describe('initScrollTop()', () => {
  let scrollToMock;

  beforeEach(() => {
    document.body.innerHTML = '';
    // Remove all previously attached listeners by replacing body
    scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;
  });

  test('returns early without error when #scrollTop button is absent', () => {
    expect(() => initScrollTop()).not.toThrow();
  });

  test('button does not have .show class initially', () => {
    buildScrollBtn();
    initScrollTop();
    const btn = document.getElementById('scrollTop');
    expect(btn.classList.contains('show')).toBe(false);
  });

  test('adds .show class when scrollY > 400', () => {
    buildScrollBtn();
    initScrollTop();
    fireScrollEvent(401);
    const btn = document.getElementById('scrollTop');
    expect(btn.classList.contains('show')).toBe(true);
  });

  test('removes .show class when scrollY <= 400', () => {
    buildScrollBtn();
    initScrollTop();
    // First scroll past threshold, then scroll back
    fireScrollEvent(500);
    fireScrollEvent(200);
    const btn = document.getElementById('scrollTop');
    expect(btn.classList.contains('show')).toBe(false);
  });

  test('exactly 400px does NOT show the button', () => {
    buildScrollBtn();
    initScrollTop();
    fireScrollEvent(400);
    const btn = document.getElementById('scrollTop');
    expect(btn.classList.contains('show')).toBe(false);
  });

  test('clicking the button calls window.scrollTo with { top: 0, behavior: "smooth" }', () => {
    buildScrollBtn();
    initScrollTop();
    document.getElementById('scrollTop').click();
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
