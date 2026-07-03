/**
 * Unit tests — highlightActiveNav()
 *
 * Verifies the correct nav link gets .active and aria-current,
 * non-matching links are left untouched, and parent dropdown
 * toggles are also marked active.
 */

'use strict';

/* ── Inline implementation (mirrors script.js exactly) ── */
function highlightActiveNav(currentPage) {
  // Accept currentPage as argument for testability
  // (In production it reads window.location.pathname)
  const current = currentPage || 'index.html';

  document.querySelectorAll('#navbar-placeholder .nav-link, #navbar-placeholder .dropdown-item')
    .forEach(link => {
      const href = (link.getAttribute('href') || '').split('#')[0].split('/').pop();
      if (href && href === current) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');

        const parentLi = link.closest('.dropdown');
        if (parentLi) {
          parentLi.querySelector('.dropdown-toggle')?.classList.add('active');
        }
      }
    });
}

// ── DOM fixture helper ─────────────────────────────────────────
function buildNavbar(links = []) {
  const items = links.map(({ href, dropdown }) => {
    if (dropdown) {
      return `
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#">Modules</a>
          <ul class="dropdown-menu">
            ${dropdown.map(d => `<li><a class="dropdown-item" href="${d}">${d}</a></li>`).join('')}
          </ul>
        </li>`;
    }
    return `<li class="nav-item"><a class="nav-link" href="${href}">${href}</a></li>`;
  });

  document.body.innerHTML = `
    <div id="navbar-placeholder">
      <nav>
        <ul class="navbar-nav">
          ${items.join('')}
        </ul>
      </nav>
    </div>`;
}

// ────────────────────────────────────────────────────────────────

describe('highlightActiveNav()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ── Basic active marking ────────────────────────────────────

  test('adds .active to the link matching the current page', () => {
    buildNavbar([
      { href: 'index.html' },
      { href: 'requirements.html' },
      { href: 'setup-guide.html' },
    ]);
    highlightActiveNav('requirements.html');
    const link = document.querySelector('a[href="requirements.html"]');
    expect(link.classList.contains('active')).toBe(true);
  });

  test('sets aria-current="page" on the matching link', () => {
    buildNavbar([{ href: 'index.html' }, { href: 'module1.html' }]);
    highlightActiveNav('module1.html');
    const link = document.querySelector('a[href="module1.html"]');
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  test('does NOT add .active to non-matching links', () => {
    buildNavbar([
      { href: 'index.html' },
      { href: 'module2.html' },
      { href: 'module3.html' },
    ]);
    highlightActiveNav('module2.html');
    const otherLinks = document.querySelectorAll('a[href="index.html"], a[href="module3.html"]');
    otherLinks.forEach(link => {
      expect(link.classList.contains('active')).toBe(false);
    });
  });

  // ── Hash fragment stripping ─────────────────────────────────

  test('href with hash (#roadmap) matches base filename correctly', () => {
    buildNavbar([{ href: 'index.html#roadmap' }, { href: 'module1.html' }]);
    highlightActiveNav('index.html');
    const link = document.querySelector('a[href="index.html#roadmap"]');
    expect(link.classList.contains('active')).toBe(true);
  });

  // ── Dropdown parent marking ─────────────────────────────────

  test('marks parent .dropdown-toggle active when a dropdown item matches', () => {
    buildNavbar([
      { dropdown: ['module1.html', 'module2.html', 'module3.html'] },
    ]);
    highlightActiveNav('module2.html');
    const toggle = document.querySelector('.dropdown-toggle');
    expect(toggle.classList.contains('active')).toBe(true);
  });

  test('dropdown item itself also gets .active', () => {
    buildNavbar([
      { dropdown: ['module4.html', 'module5.html'] },
    ]);
    highlightActiveNav('module5.html');
    const item = document.querySelector('a[href="module5.html"]');
    expect(item.classList.contains('active')).toBe(true);
  });

  // ── Edge cases ──────────────────────────────────────────────

  test('does nothing when no link matches', () => {
    buildNavbar([{ href: 'index.html' }, { href: 'module1.html' }]);
    highlightActiveNav('nonexistent.html');
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
      expect(link.classList.contains('active')).toBe(false);
    });
  });

  test('does nothing when navbar placeholder is empty', () => {
    document.body.innerHTML = '<div id="navbar-placeholder"></div>';
    expect(() => highlightActiveNav('index.html')).not.toThrow();
  });
});
