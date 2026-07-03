/**
 * Unit tests — loadComponent()
 *
 * Verifies HTML injection on success, graceful warning on failure,
 * and a no-op when the placeholder element does not exist.
 */

'use strict';

/* ── Inline implementation (mirrors script.js exactly) ── */
function getComponentsPath(pathname) {
  const depth = pathname
    .split('/')
    .filter(Boolean)
    .slice(0, -1)
    .length;
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
    .then(html => {
      el.innerHTML = html;
    })
    .catch(err => {
      console.warn('[EgoTECH] Component load failed:', err.message);
    });
}

// ────────────────────────────────────────────────────────────────

describe('loadComponent()', () => {
  let fetchMock;
  let warnSpy;

  beforeEach(() => {
    document.body.innerHTML = '';
    fetchMock  = jest.fn();
    warnSpy    = jest.spyOn(console, 'warn').mockImplementation(() => {});
    global.fetch = fetchMock;
  });

  afterEach(() => {
    warnSpy.mockRestore();
    jest.clearAllMocks();
  });

  // ── Successful load ─────────────────────────────────────────

  test('injects fetched HTML into the placeholder on success', async () => {
    document.body.innerHTML = '<div id="navbar-placeholder"></div>';
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => '<nav>Navbar Content</nav>',
    });

    await loadComponent('navbar-placeholder', 'navbar.html', '/index.html');

    expect(document.getElementById('navbar-placeholder').innerHTML)
      .toBe('<nav>Navbar Content</nav>');
  });

  test('injects footer HTML into footer-placeholder', async () => {
    document.body.innerHTML = '<div id="footer-placeholder"></div>';
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => '<footer>Footer</footer>',
    });

    await loadComponent('footer-placeholder', 'footer.html', '/index.html');

    expect(document.getElementById('footer-placeholder').innerHTML)
      .toBe('<footer>Footer</footer>');
  });

  // ── Failed fetch (HTTP error) ────────────────────────────────

  test('logs a warning when fetch returns a non-ok response', async () => {
    document.body.innerHTML = '<div id="navbar-placeholder"></div>';
    fetchMock.mockResolvedValue({ ok: false, status: 404 });

    await loadComponent('navbar-placeholder', 'navbar.html', '/index.html');

    expect(warnSpy).toHaveBeenCalledWith(
      '[EgoTECH] Component load failed:',
      expect.stringContaining('404')
    );
  });

  test('does NOT throw when fetch returns an error response', async () => {
    document.body.innerHTML = '<div id="navbar-placeholder"></div>';
    fetchMock.mockResolvedValue({ ok: false, status: 500 });

    await expect(
      loadComponent('navbar-placeholder', 'navbar.html', '/index.html')
    ).resolves.toBeUndefined();
  });

  // ── Network failure ─────────────────────────────────────────

  test('logs a warning on network error', async () => {
    document.body.innerHTML = '<div id="navbar-placeholder"></div>';
    fetchMock.mockRejectedValue(new Error('Network Error'));

    await loadComponent('navbar-placeholder', 'navbar.html', '/index.html');

    expect(warnSpy).toHaveBeenCalledWith(
      '[EgoTECH] Component load failed:',
      'Network Error'
    );
  });

  // ── Missing placeholder ─────────────────────────────────────

  test('resolves immediately without calling fetch when placeholder is absent', async () => {
    // No element in DOM
    await expect(
      loadComponent('navbar-placeholder', 'navbar.html', '/index.html')
    ).resolves.toBeUndefined();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  // ── Correct URL construction ─────────────────────────────────

  test('fetches from "components/navbar.html" for a root-level page', async () => {
    document.body.innerHTML = '<div id="navbar-placeholder"></div>';
    fetchMock.mockResolvedValue({ ok: true, text: async () => '' });

    await loadComponent('navbar-placeholder', 'navbar.html', '/index.html');

    expect(fetchMock).toHaveBeenCalledWith('components/navbar.html');
  });
});
