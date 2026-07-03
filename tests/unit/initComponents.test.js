/**
 * Unit tests — initComponents()
 *
 * Verifies that initComponents() calls loadComponent for both
 * navbar and footer, and that all post-load initialisers are
 * invoked after the components resolve.
 */

'use strict';

// ── Minimal stubs for the functions called after loading ───────
const highlightActiveNav  = jest.fn();
const initTooltips        = jest.fn();
const initScrollTop       = jest.fn();
const setFooterYear       = jest.fn();

// ── Inline implementation (mirrors script.js exactly) ─────────
function getComponentsPath(pathname) {
  const depth = pathname.split('/').filter(Boolean).slice(0, -1).length;
  return depth === 0 ? 'components/' : '../'.repeat(depth) + 'components/';
}

function loadComponent(placeholderId, filename, pathname) {
  const el = document.getElementById(placeholderId);
  if (!el) return Promise.resolve();
  const url = getComponentsPath(pathname) + filename;
  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
      return res.text();
    })
    .then(html => { el.innerHTML = html; })
    .catch(err => { console.warn('[EgoTECH] Component load failed:', err.message); });
}

function initComponents(pathname) {
  Promise.all([
    loadComponent('navbar-placeholder', 'navbar.html', pathname),
    loadComponent('footer-placeholder', 'footer.html', pathname),
  ]).then(() => {
    highlightActiveNav();
    initTooltips();
    initScrollTop();
    setFooterYear();
  });
}

// ────────────────────────────────────────────────────────────────

describe('initComponents()', () => {
  let fetchMock;
  let warnSpy;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="navbar-placeholder"></div>
      <div id="footer-placeholder"></div>`;
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => '<nav>Navbar</nav>',
    });
    global.fetch = fetchMock;
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('calls fetch twice — once for navbar and once for footer', async () => {
    await new Promise(resolve => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '' });
      initComponents('/index.html');
      setTimeout(resolve, 50);
    });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test('fetches navbar.html component', async () => {
    await new Promise(resolve => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '' });
      initComponents('/index.html');
      setTimeout(resolve, 50);
    });
    const calls = global.fetch.mock.calls.map(c => c[0]);
    expect(calls.some(url => url.includes('navbar.html'))).toBe(true);
  });

  test('fetches footer.html component', async () => {
    await new Promise(resolve => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '' });
      initComponents('/index.html');
      setTimeout(resolve, 50);
    });
    const calls = global.fetch.mock.calls.map(c => c[0]);
    expect(calls.some(url => url.includes('footer.html'))).toBe(true);
  });

  test('calls highlightActiveNav after both components load', async () => {
    await new Promise(resolve => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '' });
      initComponents('/index.html');
      setTimeout(resolve, 50);
    });
    expect(highlightActiveNav).toHaveBeenCalledTimes(1);
  });

  test('calls setFooterYear after both components load', async () => {
    await new Promise(resolve => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '' });
      initComponents('/index.html');
      setTimeout(resolve, 50);
    });
    expect(setFooterYear).toHaveBeenCalledTimes(1);
  });

  test('calls initScrollTop after both components load', async () => {
    await new Promise(resolve => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '' });
      initComponents('/index.html');
      setTimeout(resolve, 50);
    });
    expect(initScrollTop).toHaveBeenCalledTimes(1);
  });

  test('calls initTooltips after both components load', async () => {
    await new Promise(resolve => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '' });
      initComponents('/index.html');
      setTimeout(resolve, 50);
    });
    expect(initTooltips).toHaveBeenCalledTimes(1);
  });
});
