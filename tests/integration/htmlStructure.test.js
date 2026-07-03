/**
 * Integration tests — HTML structure & content correctness
 * @jest-environment node
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

function readPage(filename) {
  return fs.readFileSync(path.join(ROOT, filename), 'utf8');
}

// ────────────────────────────────────────────────────────────────

describe('index.html structure', () => {
  const html = readPage('index.html');

  test('has correct page title', () => {
    expect(html).toMatch(/<title>.*MERN CRUD.*<\/title>/i);
  });

  test('has navbar-placeholder', () => {
    expect(html).toContain('id="navbar-placeholder"');
  });

  test('has footer-placeholder', () => {
    expect(html).toContain('id="footer-placeholder"');
  });

  test('has hero section with Start Learning CTA', () => {
    expect(html).toContain('Start Learning');
  });

  test('has #outcomes section', () => {
    expect(html).toContain('id="outcomes"');
  });

  test('has #roadmap section', () => {
    expect(html).toContain('id="roadmap"');
  });

  test('has #modules section', () => {
    expect(html).toContain('id="modules"');
  });

  test('has links to all 10 module pages', () => {
    for (let i = 1; i <= 10; i++) {
      expect(html).toContain(`href="module${i}.html"`);
    }
  });

  test('has link to requirements.html', () => {
    expect(html).toContain('href="requirements.html"');
  });

  test('loads index.css, navbar.css, and footer.css', () => {
    expect(html).toContain('index.css');
    expect(html).toContain('navbar.css');
    expect(html).toContain('footer.css');
  });

  test('loads script.js', () => {
    expect(html).toContain('script.js');
  });
});

// ────────────────────────────────────────────────────────────────

describe('requirements.html structure', () => {
  const html = readPage('requirements.html');

  test('has Software Requirements Specification in title', () => {
    expect(html).toMatch(/<title>.*Requirement.*<\/title>/i);
  });

  test('has navbar-placeholder', () => {
    expect(html).toContain('id="navbar-placeholder"');
  });

  test('has footer-placeholder', () => {
    expect(html).toContain('id="footer-placeholder"');
  });

  test('has all 16 section IDs', () => {
    const sections = [
      'introduction', 'stakeholders', 'user-requirements', 'functional',
      'non-functional', 'hardware', 'software', 'constraints',
      'assumptions', 'business-rules', 'use-cases', 'data-requirements',
      'interface', 'security', 'acceptance', 'summary',
    ];
    sections.forEach(id => {
      expect(html).toContain(`id="${id}"`);
    });
  });

  test('has a sidebar nav with snum spans', () => {
    expect(html).toContain('class="snum"');
  });

  test('loads requirements.css', () => {
    expect(html).toContain('requirements.css');
  });
});

// ────────────────────────────────────────────────────────────────

describe('module pages — shared structure', () => {
  for (let i = 1; i <= 10; i++) {
    describe(`module${i}.html`, () => {
      const html = readPage(`module${i}.html`);

      test('has a <title> tag', () => {
        expect(html).toMatch(/<title>.+<\/title>/);
      });

      test('has module-hero section', () => {
        expect(html).toContain('module-hero');
      });

      test('loads style.css', () => {
        expect(html).toContain('style.css');
      });

      test('loads navbar.css', () => {
        expect(html).toContain('navbar.css');
      });

      test('loads footer.css', () => {
        expect(html).toContain('footer.css');
      });

      test('loads script.js', () => {
        expect(html).toContain('script.js');
      });

      test('loads Bootstrap 5 JS bundle', () => {
        expect(html).toContain('bootstrap.bundle.min.js');
      });

      test('has correct navbar brand logo: Ego<span>TECH</span>', () => {
        expect(html).toContain('Ego<span>TECH</span>');
      });

      test('has a navbar-brand link pointing to index.html', () => {
        expect(html).toContain('class="navbar-brand"');
        expect(html).toContain('href="index.html"');
      });

      test('has a footer element', () => {
        expect(html).toContain('<footer');
      });

      test('has a #scrollTop button', () => {
        expect(html).toContain('id="scrollTop"');
      });
    });
  }
});

// ────────────────────────────────────────────────────────────────

describe('navbar.html component', () => {
  const html = readPage('components/navbar.html');

  test('contains <nav> element', () => {
    expect(html).toContain('<nav');
  });

  test('brand is Ego<span>TECH</span>', () => {
    expect(html).toContain('Ego<span>TECH</span>');
  });

  test('has links to all 10 modules in dropdown', () => {
    for (let i = 1; i <= 10; i++) {
      expect(html).toContain(`module${i}.html`);
    }
  });

  test('has link to requirements.html', () => {
    expect(html).toContain('requirements.html');
  });

  test('Start Learning button links to module1.html', () => {
    expect(html).toContain('Start Learning');
    expect(html).toContain('module1.html');
  });
});

// ────────────────────────────────────────────────────────────────

describe('footer.html component', () => {
  const html = readPage('components/footer.html');

  test('contains <footer> element', () => {
    expect(html).toContain('<footer');
  });

  test('has #footer-year span', () => {
    expect(html).toContain('id="footer-year"');
  });

  test('has #scrollTop button', () => {
    expect(html).toContain('id="scrollTop"');
  });

  test('has footer-social links', () => {
    expect(html).toContain('footer-social');
  });

  test('has links to all 10 modules', () => {
    for (let i = 1; i <= 10; i++) {
      expect(html).toContain(`module${i}.html`);
    }
  });
});
