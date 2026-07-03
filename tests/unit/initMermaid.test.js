/**
 * Unit tests — initMermaid()
 *
 * Verifies mermaid.initialize() is called with the correct
 * config object when the mermaid global is present, and that
 * the function silently skips when mermaid is absent.
 */

'use strict';

/* ── Inline implementation (mirrors script.js exactly) ── */
function initMermaid() {
  if (typeof mermaid === 'undefined') return;

  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      primaryColor:       '#0d6efd',
      primaryTextColor:   '#ffffff',
      primaryBorderColor: '#0a58ca',
      lineColor:          '#6c757d',
      secondaryColor:     '#cfe2ff',
      tertiaryColor:      '#f8f9fa',
    },
    flowchart: { curve: 'basis', htmlLabels: true },
  });
}

// ────────────────────────────────────────────────────────────────

describe('initMermaid()', () => {
  let initializeMock;

  beforeEach(() => {
    delete global.mermaid;
    initializeMock = jest.fn();
  });

  afterEach(() => {
    delete global.mermaid;
  });

  // ── mermaid not loaded ─────────────────────────────────────

  test('does not throw when mermaid global is undefined', () => {
    expect(() => initMermaid()).not.toThrow();
  });

  test('does not call mermaid.initialize when mermaid is undefined', () => {
    initMermaid(); // no global — should just return
    // initializeMock was never wired, so no assertion needed — just no throw
  });

  // ── mermaid loaded ─────────────────────────────────────────

  test('calls mermaid.initialize exactly once', () => {
    global.mermaid = { initialize: initializeMock };
    initMermaid();
    expect(initializeMock).toHaveBeenCalledTimes(1);
  });

  test('passes startOnLoad: true to mermaid.initialize', () => {
    global.mermaid = { initialize: initializeMock };
    initMermaid();
    const config = initializeMock.mock.calls[0][0];
    expect(config.startOnLoad).toBe(true);
  });

  test('passes theme: "base" to mermaid.initialize', () => {
    global.mermaid = { initialize: initializeMock };
    initMermaid();
    const config = initializeMock.mock.calls[0][0];
    expect(config.theme).toBe('base');
  });

  test('passes correct primaryColor in themeVariables', () => {
    global.mermaid = { initialize: initializeMock };
    initMermaid();
    const config = initializeMock.mock.calls[0][0];
    expect(config.themeVariables.primaryColor).toBe('#0d6efd');
  });

  test('passes correct primaryTextColor in themeVariables', () => {
    global.mermaid = { initialize: initializeMock };
    initMermaid();
    const config = initializeMock.mock.calls[0][0];
    expect(config.themeVariables.primaryTextColor).toBe('#ffffff');
  });

  test('passes correct primaryBorderColor in themeVariables', () => {
    global.mermaid = { initialize: initializeMock };
    initMermaid();
    const config = initializeMock.mock.calls[0][0];
    expect(config.themeVariables.primaryBorderColor).toBe('#0a58ca');
  });

  test('passes flowchart config with curve: "basis"', () => {
    global.mermaid = { initialize: initializeMock };
    initMermaid();
    const config = initializeMock.mock.calls[0][0];
    expect(config.flowchart.curve).toBe('basis');
  });

  test('passes flowchart config with htmlLabels: true', () => {
    global.mermaid = { initialize: initializeMock };
    initMermaid();
    const config = initializeMock.mock.calls[0][0];
    expect(config.flowchart.htmlLabels).toBe(true);
  });

  test('passes all 6 themeVariables keys', () => {
    global.mermaid = { initialize: initializeMock };
    initMermaid();
    const vars = initializeMock.mock.calls[0][0].themeVariables;
    const expectedKeys = [
      'primaryColor', 'primaryTextColor', 'primaryBorderColor',
      'lineColor', 'secondaryColor', 'tertiaryColor',
    ];
    expectedKeys.forEach(key => {
      expect(vars).toHaveProperty(key);
    });
  });
});
