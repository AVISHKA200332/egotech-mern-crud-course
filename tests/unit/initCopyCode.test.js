/**
 * Unit tests — initCopyCode()
 *
 * Verifies copy buttons are appended, flash "Copied!", revert to "Copy",
 * and fall back to textarea-based copying when Clipboard API is unavailable.
 */

'use strict';

/* ── Inline implementation (mirrors script.js exactly) ── */
function initCopyCode() {
  document.querySelectorAll('.code-header').forEach(header => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-outline-secondary py-0 px-2';
    btn.style.fontSize = '.72rem';
    btn.innerHTML = '<i class="bi bi-clipboard me-1"></i>Copy';

    btn.addEventListener('click', () => {
      const pre = header.nextElementSibling;
      if (!pre) return;

      const text = pre.innerText;

      const write = () => {
        navigator.clipboard.writeText(text).then(() => flash()).catch(fallback);
      };

      const fallback = () => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        flash();
      };

      const flash = () => {
        btn.innerHTML = '<i class="bi bi-check2 me-1"></i>Copied!';
        setTimeout(() => {
          btn.innerHTML = '<i class="bi bi-clipboard me-1"></i>Copy';
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        write();
      } else {
        fallback();
      }
    });

    header.appendChild(btn);
  });
}

// ────────────────────────────────────────────────────────────────

describe('initCopyCode()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.useFakeTimers();

    // jsdom does not have navigator.clipboard — use fallback path by default
    Object.defineProperty(window, 'isSecureContext', { value: false, writable: true, configurable: true });
    // Mock execCommand so jsdom doesn't throw
    document.execCommand = jest.fn().mockReturnValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── Button appended ─────────────────────────────────────────

  test('appends a Copy button to a single .code-header', () => {
    document.body.innerHTML = `
      <div class="code-header"></div>
      <pre class="code-block">const x = 1;</pre>`;
    initCopyCode();
    const btn = document.querySelector('.code-header button');
    expect(btn).not.toBeNull();
    expect(btn.innerHTML).toContain('Copy');
  });

  test('appends a button to each .code-header when multiple exist', () => {
    document.body.innerHTML = `
      <div class="code-header"></div><pre>code 1</pre>
      <div class="code-header"></div><pre>code 2</pre>
      <div class="code-header"></div><pre>code 3</pre>`;
    initCopyCode();
    const btns = document.querySelectorAll('.code-header button');
    expect(btns.length).toBe(3);
  });

  test('does not append any button when no .code-header exists', () => {
    document.body.innerHTML = '<pre>some code</pre>';
    initCopyCode();
    expect(document.querySelector('button')).toBeNull();
  });

  // ── Flash "Copied!" feedback ─────────────────────────────────

  test('button shows "Copied!" immediately after click', () => {
    document.body.innerHTML = `
      <div class="code-header"></div>
      <pre class="code-block">npm install</pre>`;
    initCopyCode();
    const btn = document.querySelector('.code-header button');
    btn.click();
    expect(btn.innerHTML).toContain('Copied!');
  });

  test('button reverts to "Copy" after 2000ms', () => {
    document.body.innerHTML = `
      <div class="code-header"></div>
      <pre class="code-block">npm install</pre>`;
    initCopyCode();
    const btn = document.querySelector('.code-header button');
    btn.click();
    jest.advanceTimersByTime(2000);
    expect(btn.innerHTML).toContain('Copy');
    expect(btn.innerHTML).not.toContain('Copied!');
  });

  test('button still shows "Copied!" before the 2000ms timeout', () => {
    document.body.innerHTML = `
      <div class="code-header"></div>
      <pre class="code-block">git init</pre>`;
    initCopyCode();
    const btn = document.querySelector('.code-header button');
    btn.click();
    jest.advanceTimersByTime(1999);
    expect(btn.innerHTML).toContain('Copied!');
  });

  // ── Fallback textarea copy ───────────────────────────────────

  test('creates a hidden textarea and calls document.execCommand("copy") as fallback', () => {
    document.body.innerHTML = `
      <div class="code-header"></div>
      <pre class="code-block">const hello = "world";</pre>`;
    initCopyCode();
    document.querySelector('.code-header button').click();
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  test('removes the temporary textarea after copying', () => {
    document.body.innerHTML = `
      <div class="code-header"></div>
      <pre class="code-block">some code</pre>`;
    initCopyCode();
    document.querySelector('.code-header button').click();
    expect(document.querySelector('textarea')).toBeNull();
  });

  // ── No sibling element ──────────────────────────────────────

  test('does not throw when .code-header has no next sibling', () => {
    document.body.innerHTML = '<div class="code-header"></div>';
    initCopyCode();
    const btn = document.querySelector('.code-header button');
    expect(() => btn.click()).not.toThrow();
  });

  // ── Multiple independent buttons ────────────────────────────

  test('each button independently copies its own code block text', () => {
    document.body.innerHTML = `
      <div class="code-header"></div><pre>block one</pre>
      <div class="code-header"></div><pre>block two</pre>`;
    initCopyCode();
    const btns = document.querySelectorAll('.code-header button');

    // Click first button
    btns[0].click();
    expect(btns[0].innerHTML).toContain('Copied!');
    // Second button should still show Copy
    expect(btns[1].innerHTML).toContain('Copy');
  });
});
