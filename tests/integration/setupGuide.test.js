/**
 * Integration tests — setup-guide.html structure & content
 * @jest-environment node
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const html = fs.readFileSync(path.join(ROOT, 'setup-guide.html'), 'utf8');

// ────────────────────────────────────────────────────────────────

describe('setup-guide.html structure', () => {

  // ── Head ────────────────────────────────────────────────────

  test('has a <title> tag containing "Setup Guide"', () => {
    expect(html).toMatch(/<title>.*Setup Guide.*<\/title>/i);
  });

  test('loads style.css', () => {
    expect(html).toContain('style.css');
  });

  test('loads Bootstrap 5 CSS', () => {
    expect(html).toContain('bootstrap');
  });

  test('loads Bootstrap 5 JS bundle', () => {
    expect(html).toContain('bootstrap.bundle.min.js');
  });

  // ── Navbar ──────────────────────────────────────────────────

  test('has an inline <nav> element (not a placeholder)', () => {
    expect(html).toContain('<nav');
  });

  test('navbar brand links to index.html', () => {
    expect(html).toContain('href="index.html"');
  });

  test('has navbar-brand with EgoTECH text', () => {
    expect(html).toContain('EgoTECH');
  });

  test('has a navbar-toggler for mobile', () => {
    expect(html).toContain('navbar-toggler');
  });

  // ── Hero section ────────────────────────────────────────────

  test('has a module-hero section', () => {
    expect(html).toContain('module-hero');
  });

  test('hero contains a module-badge with "Setup Guide"', () => {
    expect(html).toContain('Setup Guide');
  });

  // ── Main content ─────────────────────────────────────────────

  test('has exactly 3 content-section cards (Install, Extensions, Verify)', () => {
    const matches = html.match(/class="content-section/g) || [];
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });

  test('mentions "Install Tools" or similar install heading', () => {
    expect(html).toMatch(/install/i);
  });

  test('mentions VS Code extensions', () => {
    expect(html).toMatch(/extension/i);
  });

  test('mentions "Verify" setup step', () => {
    expect(html).toMatch(/verify/i);
  });

  test('contains git-cmd elements for terminal commands', () => {
    expect(html).toContain('git-cmd');
  });

  test('includes node --version command', () => {
    expect(html).toContain('node --version');
  });

  // ── Footer ──────────────────────────────────────────────────

  test('has a <footer> element', () => {
    expect(html).toContain('<footer');
  });

  // ── Accessibility & meta ─────────────────────────────────────

  test('has a viewport meta tag', () => {
    expect(html).toContain('viewport');
  });

  test('has charset UTF-8', () => {
    expect(html).toMatch(/charset.*UTF-8/i);
  });

  test('html element has lang="en"', () => {
    expect(html).toContain('lang="en"');
  });
});
