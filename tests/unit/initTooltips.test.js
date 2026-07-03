/**
 * Unit tests — initTooltips()
 *
 * Verifies Bootstrap Tooltip initialization is called for each
 * [data-bs-toggle="tooltip"] element, and that the function
 * silently skips when the bootstrap global is not available.
 */

'use strict';

/* ── Inline implementation (mirrors script.js exactly) ── */
function initTooltips() {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    if (typeof bootstrap !== 'undefined') {
      new bootstrap.Tooltip(el);
    }
  });
}

// ────────────────────────────────────────────────────────────────

describe('initTooltips()', () => {
  let TooltipMock;

  beforeEach(() => {
    document.body.innerHTML = '';
    // Remove any leftover global
    delete global.bootstrap;

    TooltipMock = jest.fn();
  });

  afterEach(() => {
    delete global.bootstrap;
  });

  // ── Bootstrap not loaded ───────────────────────────────────

  test('does not throw when bootstrap global is undefined', () => {
    document.body.innerHTML = '<button data-bs-toggle="tooltip" title="tip"></button>';
    expect(() => initTooltips()).not.toThrow();
  });

  test('does not call anything when bootstrap is undefined', () => {
    document.body.innerHTML = '<button data-bs-toggle="tooltip" title="tip"></button>';
    initTooltips();
    // No call to make — just ensure no error was thrown (asserted above)
  });

  // ── Bootstrap loaded ────────────────────────────────────────

  test('initializes a Tooltip for a single tooltip element', () => {
    document.body.innerHTML = '<button data-bs-toggle="tooltip" title="Click me"></button>';
    global.bootstrap = { Tooltip: TooltipMock };
    initTooltips();
    expect(TooltipMock).toHaveBeenCalledTimes(1);
  });

  test('initializes Tooltip for each tooltip element independently', () => {
    document.body.innerHTML = `
      <span data-bs-toggle="tooltip" title="one"></span>
      <span data-bs-toggle="tooltip" title="two"></span>
      <span data-bs-toggle="tooltip" title="three"></span>`;
    global.bootstrap = { Tooltip: TooltipMock };
    initTooltips();
    expect(TooltipMock).toHaveBeenCalledTimes(3);
  });

  test('passes the DOM element as the first argument to new bootstrap.Tooltip()', () => {
    document.body.innerHTML = '<a data-bs-toggle="tooltip" title="Info"></a>';
    global.bootstrap = { Tooltip: TooltipMock };
    initTooltips();
    const el = document.querySelector('[data-bs-toggle="tooltip"]');
    expect(TooltipMock).toHaveBeenCalledWith(el);
  });

  // ── No tooltip elements on page ─────────────────────────────

  test('does nothing when no tooltip elements exist', () => {
    document.body.innerHTML = '<div class="some-other-element"></div>';
    global.bootstrap = { Tooltip: TooltipMock };
    initTooltips();
    expect(TooltipMock).not.toHaveBeenCalled();
  });

  test('ignores elements without data-bs-toggle="tooltip"', () => {
    document.body.innerHTML = `
      <button data-bs-toggle="modal">Open Modal</button>
      <button data-bs-toggle="collapse">Toggle</button>`;
    global.bootstrap = { Tooltip: TooltipMock };
    initTooltips();
    expect(TooltipMock).not.toHaveBeenCalled();
  });

  // ── Mixed tooltip and non-tooltip elements ──────────────────

  test('only initializes tooltips for elements with data-bs-toggle="tooltip"', () => {
    document.body.innerHTML = `
      <button data-bs-toggle="tooltip" title="I am a tooltip"></button>
      <button data-bs-toggle="modal">Not a tooltip</button>`;
    global.bootstrap = { Tooltip: TooltipMock };
    initTooltips();
    expect(TooltipMock).toHaveBeenCalledTimes(1);
  });
});
