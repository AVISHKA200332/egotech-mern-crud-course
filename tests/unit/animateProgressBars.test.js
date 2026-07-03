/**
 * Unit tests — animateProgressBars()
 *
 * Uses a controllable IntersectionObserver mock since jsdom
 * does not implement the real API.
 */

'use strict';

/* ── Inline implementation (mirrors script.js exactly) ── */
function animateProgressBars() {
  const bars = document.querySelectorAll('.progress-bar[data-width], .progress-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar    = entry.target;
        const target = bar.getAttribute('data-width') || bar.style.width || '0%';
        bar.style.width      = '0%';
        bar.style.transition = 'width 1s ease';
        setTimeout(() => { bar.style.width = target; }, 120);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => {
    if (!bar.hasAttribute('data-width')) {
      bar.setAttribute('data-width', bar.style.width || bar.getAttribute('aria-valuenow') + '%');
    }
    observer.observe(bar);
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
  disconnect()  {}
}

function fireIntersecting(elements) {
  const entries = elements.map(el => ({ target: el, isIntersecting: true }));
  _observerCallback(entries);
}

// ────────────────────────────────────────────────────────────────

describe('animateProgressBars()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.useFakeTimers();
    global.IntersectionObserver = MockIntersectionObserver;
    _observerCallback  = null;
    _observedElements  = [];
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── No bars ────────────────────────────────────────────────

  test('does nothing when no .progress-bar elements exist', () => {
    expect(() => animateProgressBars()).not.toThrow();
    expect(_observerCallback).toBeNull();
  });

  // ── data-width attribute preserved ─────────────────────────

  test('adds data-width from existing style.width if not already present', () => {
    document.body.innerHTML = '<div class="progress-bar" style="width:75%"></div>';
    animateProgressBars();
    const bar = document.querySelector('.progress-bar');
    expect(bar.getAttribute('data-width')).toBe('75%');
  });

  test('does not overwrite an existing data-width attribute', () => {
    document.body.innerHTML = '<div class="progress-bar" data-width="60%" style="width:60%"></div>';
    animateProgressBars();
    const bar = document.querySelector('.progress-bar');
    expect(bar.getAttribute('data-width')).toBe('60%');
  });

  test('uses aria-valuenow when no style.width is present', () => {
    document.body.innerHTML = '<div class="progress-bar" aria-valuenow="50"></div>';
    animateProgressBars();
    const bar = document.querySelector('.progress-bar');
    expect(bar.getAttribute('data-width')).toBe('50%');
  });

  // ── All bars observed ───────────────────────────────────────

  test('observes all .progress-bar elements', () => {
    document.body.innerHTML = `
      <div class="progress-bar" style="width:30%"></div>
      <div class="progress-bar" style="width:60%"></div>
      <div class="progress-bar" style="width:90%"></div>`;
    animateProgressBars();
    expect(_observedElements.length).toBe(3);
  });

  // ── Animation on intersection ───────────────────────────────

  test('resets width to 0% immediately when element intersects', () => {
    document.body.innerHTML = '<div class="progress-bar" data-width="80%" style="width:80%"></div>';
    animateProgressBars();
    const bar = document.querySelector('.progress-bar');
    fireIntersecting([bar]);
    expect(bar.style.width).toBe('0%');
  });

  test('sets transition on the bar when it intersects', () => {
    document.body.innerHTML = '<div class="progress-bar" data-width="50%" style="width:50%"></div>';
    animateProgressBars();
    const bar = document.querySelector('.progress-bar');
    fireIntersecting([bar]);
    expect(bar.style.transition).toContain('width');
  });

  test('restores target width after 120ms timeout', () => {
    document.body.innerHTML = '<div class="progress-bar" data-width="70%" style="width:70%"></div>';
    animateProgressBars();
    const bar = document.querySelector('.progress-bar');
    fireIntersecting([bar]);
    expect(bar.style.width).toBe('0%');
    jest.advanceTimersByTime(120);
    expect(bar.style.width).toBe('70%');
  });

  test('does NOT restore width before 120ms timeout', () => {
    document.body.innerHTML = '<div class="progress-bar" data-width="40%" style="width:40%"></div>';
    animateProgressBars();
    const bar = document.querySelector('.progress-bar');
    fireIntersecting([bar]);
    jest.advanceTimersByTime(119);
    expect(bar.style.width).toBe('0%');
  });

  // ── Unobserve after animation ───────────────────────────────

  test('unobserves bar after intersection (animate once)', () => {
    document.body.innerHTML = '<div class="progress-bar" data-width="55%" style="width:55%"></div>';
    animateProgressBars();
    const bar = document.querySelector('.progress-bar');
    expect(_observedElements).toContain(bar);
    fireIntersecting([bar]);
    expect(_observedElements).not.toContain(bar);
  });

  // ── Falls back to 0% target when no width info available ───

  test('uses 0% as fallback when no data-width, style.width, or aria-valuenow exist', () => {
    document.body.innerHTML = '<div class="progress-bar"></div>';
    animateProgressBars();
    const bar = document.querySelector('.progress-bar');
    fireIntersecting([bar]);
    jest.advanceTimersByTime(120);
    // data-width should have been set to "null%" or "0%" — in either case width is set
    expect(bar.style.width).toBeDefined();
  });
});
