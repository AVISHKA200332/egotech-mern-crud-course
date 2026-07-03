/**
 * Unit tests — initScrollAnimations()
 *
 * jsdom does not ship IntersectionObserver, so we provide a
 * controllable mock that lets us fire entries manually.
 */

'use strict';

/* ── Inline implementation (mirrors script.js exactly) ── */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.card, .step-item, .roadmap-item, .career-item, .tool-card'
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(18px)';
    el.style.transition = 'opacity .45s ease, transform .45s ease';
    observer.observe(el);
  });
}

// ── IntersectionObserver mock ──────────────────────────────────
let _observerCallback;
let _observedElements;

class MockIntersectionObserver {
  constructor(callback) {
    _observerCallback = callback;
    _observedElements = [];
  }
  observe(el)   { _observedElements.push(el); }
  unobserve(el) { _observedElements = _observedElements.filter(e => e !== el); }
  disconnect()  { _observedElements = []; }
}

function fireIntersecting(elements) {
  const entries = elements.map(el => ({ target: el, isIntersecting: true }));
  _observerCallback(entries);
}

function fireNotIntersecting(elements) {
  const entries = elements.map(el => ({ target: el, isIntersecting: false }));
  _observerCallback(entries);
}

// ────────────────────────────────────────────────────────────────

describe('initScrollAnimations()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    global.IntersectionObserver = MockIntersectionObserver;
    _observerCallback   = null;
    _observedElements   = [];
  });

  // ── No targets ─────────────────────────────────────────────

  test('does nothing when no target elements exist on the page', () => {
    expect(() => initScrollAnimations()).not.toThrow();
    // Observer callback should never have been created
    expect(_observerCallback).toBeNull();
  });

  // ── Initial styles ──────────────────────────────────────────

  test('sets opacity:0 and translateY(18px) on every .card before intersection', () => {
    document.body.innerHTML = `
      <div class="card"></div>
      <div class="card"></div>`;
    initScrollAnimations();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      expect(card.style.opacity).toBe('0');
      expect(card.style.transform).toBe('translateY(18px)');
    });
  });

  test('applies transition style to each target element', () => {
    document.body.innerHTML = '<div class="step-item"></div>';
    initScrollAnimations();
    const el = document.querySelector('.step-item');
    expect(el.style.transition).toContain('opacity');
    expect(el.style.transition).toContain('transform');
  });

  // ── All selector types are observed ────────────────────────

  test('observes .card, .step-item, .roadmap-item, .career-item, .tool-card', () => {
    document.body.innerHTML = `
      <div class="card"></div>
      <div class="step-item"></div>
      <div class="roadmap-item"></div>
      <div class="career-item"></div>
      <div class="tool-card"></div>`;
    initScrollAnimations();
    expect(_observedElements.length).toBe(5);
  });

  // ── Intersection triggers reveal ────────────────────────────

  test('sets opacity:1 when element becomes intersecting', () => {
    document.body.innerHTML = '<div class="card"></div>';
    initScrollAnimations();
    const card = document.querySelector('.card');
    fireIntersecting([card]);
    expect(card.style.opacity).toBe('1');
  });

  test('sets transform:translateY(0) when element becomes intersecting', () => {
    document.body.innerHTML = '<div class="card"></div>';
    initScrollAnimations();
    const card = document.querySelector('.card');
    fireIntersecting([card]);
    expect(card.style.transform).toBe('translateY(0)');
  });

  test('does NOT update styles when isIntersecting is false', () => {
    document.body.innerHTML = '<div class="card"></div>';
    initScrollAnimations();
    const card = document.querySelector('.card');
    fireNotIntersecting([card]);
    // Styles remain at initial hidden values
    expect(card.style.opacity).toBe('0');
    expect(card.style.transform).toBe('translateY(18px)');
  });

  // ── Unobserve after reveal ───────────────────────────────────

  test('unobserves an element after it intersects (animate once)', () => {
    document.body.innerHTML = '<div class="card"></div>';
    initScrollAnimations();
    const card = document.querySelector('.card');
    expect(_observedElements).toContain(card);
    fireIntersecting([card]);
    expect(_observedElements).not.toContain(card);
  });

  // ── Multiple elements ────────────────────────────────────────

  test('each element is revealed independently', () => {
    document.body.innerHTML = `
      <div class="card" id="c1"></div>
      <div class="card" id="c2"></div>`;
    initScrollAnimations();
    const c1 = document.getElementById('c1');
    const c2 = document.getElementById('c2');

    // Only reveal c1
    fireIntersecting([c1]);
    expect(c1.style.opacity).toBe('1');
    expect(c2.style.opacity).toBe('0');
  });
});
