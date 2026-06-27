/* ============================================================
   EgoTECH World — MERN CRUD Tutorial Website
   script.js  ·  Global JavaScript
   Author: EgoTECH World
   ============================================================

   HOW COMPONENTS WORK
   ───────────────────
   Place these two placeholder divs in any HTML page and this
   script will automatically fetch & inject the shared navbar
   and footer for you.

     <div id="navbar-placeholder"></div>   ← top of <body>
     <div id="footer-placeholder"></div>   ← bottom of <body>

   No other changes needed — just link this script file.
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────
   1.  COMPONENT LOADER
   Fetches navbar.html and footer.html then injects them into
   their placeholder divs.  After injection it runs all the
   post-load initialisers (active link, tooltips, etc.).
   ────────────────────────────────────────────────────────── */

/**
 * Resolve the correct path to the /components/ folder.
 * Works whether the page is at root level or inside a subfolder.
 */
function getComponentsPath() {
  // Count how many directories deep the current page is
  const depth = window.location.pathname
    .split('/')
    .filter(Boolean)          // remove empty segments
    .slice(0, -1)             // remove the filename itself
    .length;

  return depth === 0 ? 'components/' : '../'.repeat(depth) + 'components/';
}

/**
 * Fetch an HTML snippet and inject it into a DOM element.
 * Returns a Promise that resolves when done (or rejects on error).
 */
function loadComponent(placeholderId, filename) {
  const el = document.getElementById(placeholderId);
  if (!el) return Promise.resolve();   // placeholder not on this page — skip

  const url = getComponentsPath() + filename;

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

/**
 * Load both components, then run all post-load initialisers.
 */
function initComponents() {
  Promise.all([
    loadComponent('navbar-placeholder', 'navbar.html'),
    loadComponent('footer-placeholder', 'footer.html'),
  ]).then(() => {
    highlightActiveNav();
    initTooltips();
    initScrollTop();
    setFooterYear();
  });
}

// Kick off on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initComponents();
  initScrollAnimations();
  initCopyCode();
  animateProgressBars();
  trackModuleProgress();
  initMermaid();
});


/* ──────────────────────────────────────────────────────────
   2.  ACTIVE NAV LINK
   Compares the current page filename against every nav link
   and adds the Bootstrap .active class to the match.
   ────────────────────────────────────────────────────────── */
function highlightActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('#navbar-placeholder .nav-link, #navbar-placeholder .dropdown-item')
    .forEach(link => {
      const href = (link.getAttribute('href') || '').split('#')[0].split('/').pop();
      if (href && href === current) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');

        // Also mark the parent dropdown toggle as active
        const parentLi = link.closest('.dropdown');
        if (parentLi) {
          parentLi.querySelector('.dropdown-toggle')?.classList.add('active');
        }
      }
    });
}


/* ──────────────────────────────────────────────────────────
   3.  SCROLL-TO-TOP BUTTON
   ────────────────────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ──────────────────────────────────────────────────────────
   4.  FOOTER — CURRENT YEAR
   ────────────────────────────────────────────────────────── */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ──────────────────────────────────────────────────────────
   5.  SCROLL ANIMATIONS (cards, steps, roadmap items)
   ────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.card, .step-item, .roadmap-item, .career-item, .tool-card'
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(18px)';
    el.style.transition = 'opacity .45s ease, transform .45s ease';
    observer.observe(el);
  });
}


/* ──────────────────────────────────────────────────────────
   6.  COPY CODE BUTTON
   Appended to every .code-header element automatically.
   ────────────────────────────────────────────────────────── */
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

      // Clipboard API requires a secure context (HTTPS or localhost)
      if (navigator.clipboard && window.isSecureContext) {
        write();
      } else {
        fallback();
      }
    });

    header.appendChild(btn);
  });
}


/* ──────────────────────────────────────────────────────────
   7.  PROGRESS BAR ANIMATION
   ────────────────────────────────────────────────────────── */
function animateProgressBars() {
  const bars = document.querySelectorAll('.progress-bar[data-width], .progress-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar    = entry.target;
        const target = bar.getAttribute('data-width') || bar.style.width || '0%';
        bar.style.width      = '0%';
        bar.style.transition = 'width 1s ease';
        setTimeout(() => { bar.style.width = target; }, 120);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => {
    // Store original value if not already stored
    if (!bar.hasAttribute('data-width')) {
      bar.setAttribute('data-width', bar.style.width || bar.getAttribute('aria-valuenow') + '%');
    }
    observer.observe(bar);
  });
}


/* ──────────────────────────────────────────────────────────
   8.  BOOTSTRAP TOOLTIPS
   ────────────────────────────────────────────────────────── */
function initTooltips() {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    if (typeof bootstrap !== 'undefined') {
      new bootstrap.Tooltip(el);
    }
  });
}


/* ──────────────────────────────────────────────────────────
   9.  MERMAID DIAGRAMS
   ────────────────────────────────────────────────────────── */
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


/* ──────────────────────────────────────────────────────────
   10. MODULE PROGRESS TRACKER (localStorage)
   Records which module pages the visitor has opened.
   ────────────────────────────────────────────────────────── */
function trackModuleProgress() {
  const page  = window.location.pathname.split('/').pop();
  const match = page.match(/^module(\d+)\.html$/);
  if (!match) return;

  const num     = parseInt(match[1], 10);
  const visited = JSON.parse(localStorage.getItem('egotech_visited') || '[]');

  if (!visited.includes(num)) {
    visited.push(num);
    localStorage.setItem('egotech_visited', JSON.stringify(visited));
  }
}
