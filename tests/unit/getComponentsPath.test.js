/**
 * Unit tests — getComponentsPath()
 *
 * The logic is extracted as a pure function (accepts pathname as argument)
 * so it can be tested without touching window.location.
 */

'use strict';

// ── Pure function (mirrors the logic in script.js) ────────────
function getComponentsPath(pathname) {
  const depth = pathname
    .split('/')
    .filter(Boolean)
    .slice(0, -1)
    .length;
  return depth === 0 ? 'components/' : '../'.repeat(depth) + 'components/';
}

// ── Tests ──────────────────────────────────────────────────────

describe('getComponentsPath()', () => {
  test('root-level page (/index.html) → "components/"', () => {
    expect(getComponentsPath('/index.html')).toBe('components/');
  });

  test('root page without leading slash (index.html) → "components/"', () => {
    expect(getComponentsPath('index.html')).toBe('components/');
  });

  test('one directory deep (/subdir/page.html) → "../components/"', () => {
    expect(getComponentsPath('/subdir/page.html')).toBe('../components/');
  });

  test('two directories deep (/a/b/page.html) → "../../components/"', () => {
    expect(getComponentsPath('/a/b/page.html')).toBe('../../components/');
  });

  test('three directories deep → "../../../components/"', () => {
    expect(getComponentsPath('/a/b/c/page.html')).toBe('../../../components/');
  });

  test('bare root "/" → "components/"', () => {
    expect(getComponentsPath('/')).toBe('components/');
  });

  test('empty string → "components/"', () => {
    expect(getComponentsPath('')).toBe('components/');
  });
});
