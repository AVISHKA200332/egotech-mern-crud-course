/**
 * Integration tests — Express static server (server.js)
 * @jest-environment node
 */

'use strict';

const request = require('supertest');
const express = require('express');
const path    = require('path');

// Build the same app as server.js (without calling listen)
const app = express();
app.use(express.static(path.join(__dirname, '..', '..')));

// ────────────────────────────────────────────────────────────────

describe('Static file server', () => {
  // ── HTML pages ───────────────────────────────────────────────

  const htmlPages = [
    '/',
    '/index.html',
    '/requirements.html',
    '/setup-guide.html',
    '/module1.html',
    '/module2.html',
    '/module3.html',
    '/module4.html',
    '/module5.html',
    '/module6.html',
    '/module7.html',
    '/module8.html',
    '/module9.html',
    '/module10.html',
  ];

  test.each(htmlPages)('GET %s → 200 with text/html', async (url) => {
    const res = await request(app).get(url);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });

  // ── Component fragments ──────────────────────────────────────

  test('GET /components/navbar.html → 200', async () => {
    const res = await request(app).get('/components/navbar.html');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<nav');
  });

  test('GET /components/footer.html → 200', async () => {
    const res = await request(app).get('/components/footer.html');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<footer');
  });

  // ── CSS assets ───────────────────────────────────────────────

  const cssFiles = [
    '/assets/css/index.css',
    '/assets/css/style.css',
    '/assets/css/navbar.css',
    '/assets/css/footer.css',
    '/assets/css/requirements.css',
  ];

  test.each(cssFiles)('GET %s → 200 with text/css', async (url) => {
    const res = await request(app).get(url);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/css/);
  });

  // ── JavaScript asset ─────────────────────────────────────────

  test('GET /assets/js/script.js → 200 with JavaScript content-type', async () => {
    const res = await request(app).get('/assets/js/script.js');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/javascript/);
  });

  // ── 404 for non-existent files ────────────────────────────────

  test('GET /nonexistent.html → 404', async () => {
    const res = await request(app).get('/nonexistent.html');
    expect(res.status).toBe(404);
  });

  test('GET /assets/css/missing.css → 404', async () => {
    const res = await request(app).get('/assets/css/missing.css');
    expect(res.status).toBe(404);
  });

  // ── HTML content checks ──────────────────────────────────────

  test('index.html contains correct <title> tag', async () => {
    const res = await request(app).get('/index.html');
    expect(res.text).toContain('MERN CRUD');
  });

  test('index.html contains navbar-placeholder div', async () => {
    const res = await request(app).get('/index.html');
    expect(res.text).toContain('id="navbar-placeholder"');
  });

  test('index.html contains footer-placeholder div', async () => {
    const res = await request(app).get('/index.html');
    expect(res.text).toContain('id="footer-placeholder"');
  });

  test('requirements.html contains navbar-placeholder div', async () => {
    const res = await request(app).get('/requirements.html');
    expect(res.text).toContain('id="navbar-placeholder"');
  });

  test('module1.html contains module hero section', async () => {
    const res = await request(app).get('/module1.html');
    expect(res.text).toContain('module-hero');
  });

  test('navbar.html component contains EgoTECH brand', async () => {
    const res = await request(app).get('/components/navbar.html');
    expect(res.text).toContain('EgoTECH');
  });

  test('footer.html component contains footer-year span', async () => {
    const res = await request(app).get('/components/footer.html');
    expect(res.text).toContain('id="footer-year"');
  });

  // ── Each module page has the correct link to script.js ───────

  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
    'module%s.html links to assets/js/script.js',
    async (num) => {
      const res = await request(app).get(`/module${num}.html`);
      expect(res.text).toContain('assets/js/script.js');
    }
  );

  // ── Each module page loads footer.css ────────────────────────

  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
    'module%s.html links to footer.css',
    async (num) => {
      const res = await request(app).get(`/module${num}.html`);
      expect(res.text).toContain('footer.css');
    }
  );

  // ── Each module page loads navbar.css ────────────────────────

  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
    'module%s.html links to navbar.css',
    async (num) => {
      const res = await request(app).get(`/module${num}.html`);
      expect(res.text).toContain('navbar.css');
    }
  );
});
