/**
 * site.js
 * -----------------------------------------------------------------------
 * You shouldn't need to touch this file. It does three small things:
 *
 * 1. Loads partials/nav.html and partials/footer.html into any element
 *    with a `data-include="..."` attribute, so you only maintain the nav
 *    and footer in ONE place instead of copy-pasting them into every page.
 * 2. Highlights whichever nav link matches the current page.
 * 3. Wires up the mobile hamburger menu, and fills in the footer's year.
 *
 * NOTE: because this uses fetch() to load the partials, it only works when
 * the page is served over http(s) — e.g. GitHub Pages, or a local dev
 * server (see SETUP.md). Opening index.html directly by double-clicking it
 * (file:// in the address bar) will NOT load the nav/footer.
 * -----------------------------------------------------------------------
 */

function loadIncludes() {
  const nodes = document.querySelectorAll('[data-include]');
  const jobs = [...nodes].map((node) => {
    const path = node.getAttribute('data-include');
    return fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load ${path} (${res.status})`);
        return res.text();
      })
      .then((html) => {
        node.innerHTML = html;
      })
      .catch((err) => {
        console.error(err);
        node.innerHTML = `<!-- failed to load ${path} -->`;
      });
  });
  return Promise.all(jobs);
}

function setActiveNavLink() {
  const links = document.querySelectorAll('.nav-links a[data-nav]');
  const path = window.location.pathname;

  links.forEach((link) => {
    const target = link.getAttribute('data-nav');
    const isHome = target === '/';
    const matches = isHome ? path === '/' || path === '/index.html' : path.startsWith(target);
    if (matches) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function setupMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function setFooterYear() {
  const el = document.getElementById('buildYear');
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  loadIncludes().then(() => {
    setActiveNavLink();
    setupMobileNav();
    setFooterYear();
  });
});