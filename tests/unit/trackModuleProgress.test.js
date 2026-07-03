/**
 * Unit tests — trackModuleProgress()
 *
 * Verifies localStorage is updated correctly when visiting module pages,
 * handles non-module pages, and prevents duplicates.
 */

'use strict';

/* ── Inline implementation (mirrors script.js exactly) ── */
function trackModuleProgress(pathname) {
  const page  = pathname.split('/').pop();
  const match = page.match(/^module(\d+)\.html$/);
  if (!match) return;

  const num     = parseInt(match[1], 10);
  const visited = JSON.parse(localStorage.getItem('egotech_visited') || '[]');

  if (!visited.includes(num)) {
    visited.push(num);
    localStorage.setItem('egotech_visited', JSON.stringify(visited));
  }
}

// ────────────────────────────────────────────────────────────────

describe('trackModuleProgress()', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ── Basic recording ─────────────────────────────────────────

  test('records module 1 visit', () => {
    trackModuleProgress('/module1.html');
    const visited = JSON.parse(localStorage.getItem('egotech_visited'));
    expect(visited).toContain(1);
  });

  test('records module 10 visit', () => {
    trackModuleProgress('/module10.html');
    const visited = JSON.parse(localStorage.getItem('egotech_visited'));
    expect(visited).toContain(10);
  });

  test('stores the number (not string) in the array', () => {
    trackModuleProgress('/module5.html');
    const visited = JSON.parse(localStorage.getItem('egotech_visited'));
    expect(typeof visited[0]).toBe('number');
  });

  // ── Non-module pages ────────────────────────────────────────

  test('does NOT write to localStorage for index.html', () => {
    trackModuleProgress('/index.html');
    expect(localStorage.getItem('egotech_visited')).toBeNull();
  });

  test('does NOT write for requirements.html', () => {
    trackModuleProgress('/requirements.html');
    expect(localStorage.getItem('egotech_visited')).toBeNull();
  });

  test('does NOT write for setup-guide.html', () => {
    trackModuleProgress('/setup-guide.html');
    expect(localStorage.getItem('egotech_visited')).toBeNull();
  });

  // ── Duplicate prevention ────────────────────────────────────

  test('visiting the same module twice does not duplicate the entry', () => {
    trackModuleProgress('/module3.html');
    trackModuleProgress('/module3.html');
    const visited = JSON.parse(localStorage.getItem('egotech_visited'));
    expect(visited.filter(n => n === 3).length).toBe(1);
  });

  // ── Accumulation ────────────────────────────────────────────

  test('visiting multiple modules accumulates all entries', () => {
    trackModuleProgress('/module1.html');
    trackModuleProgress('/module4.html');
    trackModuleProgress('/module7.html');
    const visited = JSON.parse(localStorage.getItem('egotech_visited'));
    expect(visited).toContain(1);
    expect(visited).toContain(4);
    expect(visited).toContain(7);
    expect(visited.length).toBe(3);
  });

  test('preserves existing visited list when adding a new module', () => {
    localStorage.setItem('egotech_visited', JSON.stringify([2, 5]));
    trackModuleProgress('/module8.html');
    const visited = JSON.parse(localStorage.getItem('egotech_visited'));
    expect(visited).toContain(2);
    expect(visited).toContain(5);
    expect(visited).toContain(8);
    expect(visited.length).toBe(3);
  });

  // ── All 10 modules ───────────────────────────────────────────

  test('all 10 modules can be tracked', () => {
    for (let i = 1; i <= 10; i++) {
      trackModuleProgress(`/module${i}.html`);
    }
    const visited = JSON.parse(localStorage.getItem('egotech_visited'));
    expect(visited.length).toBe(10);
    for (let i = 1; i <= 10; i++) {
      expect(visited).toContain(i);
    }
  });
});
