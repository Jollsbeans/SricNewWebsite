/* Click-controlled dropdowns; existing site.js controls the drawer toggle. */
(() => {
  'use strict';

  const nav = document.querySelector('.school-menu-list');
  if (!nav) return;

  const topMenus = [...nav.children].filter(item => item.matches('details'));
  const toggle = document.querySelector('.menu-toggle');
  const backdrop = document.querySelector('.school-menu-backdrop');
  const close = document.querySelector('.mobile-menu-close');
  const mobile = window.matchMedia('(max-width: 991px)');

  function collapse(menu) {
    menu.open = false;
    menu.querySelectorAll('details').forEach(child => { child.open = false; });
  }

  function drawerState() {
    const open = mobile.matches && nav.classList.contains('open');
    document.body.classList.toggle('school-drawer-open', open);
    if (backdrop) backdrop.hidden = !open;
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    nav.inert = mobile.matches && !open;
  }

  function closeDrawer() {
    nav.classList.remove('open');
    topMenus.forEach(collapse);
    drawerState();
    if (toggle) toggle.focus();
  }

  // Every dropdown starts closed, including all nested program groups.
  topMenus.forEach(collapse);
  topMenus.forEach(menu => {
    menu.addEventListener('toggle', () => {
      if (menu.open) {
        topMenus.forEach(other => {
          if (other !== menu) collapse(other);
        });
      } else {
        menu.querySelectorAll('details').forEach(child => { child.open = false; });
      }
    });
  });

  if (toggle) toggle.addEventListener('click', () => {
    drawerState();
    if (nav.classList.contains('open') && close) close.focus();
  });
  if (close) close.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('click', event => {
    if (!mobile.matches && !nav.contains(event.target)) topMenus.forEach(collapse);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const current = event.target.closest('.school-dropdown[open]');
      if (current) {
        collapse(current);
        current.querySelector('summary').focus();
      } else if (mobile.matches && nav.classList.contains('open')) {
        closeDrawer();
      } else {
        const openMenu = topMenus.find(menu => menu.open);
        topMenus.forEach(collapse);
        if (openMenu) openMenu.querySelector('summary').focus();
      }
    }

    if (event.key === 'Tab' && mobile.matches && nav.classList.contains('open')) {
      const focusable = [...nav.querySelectorAll('a, button, summary')]
        .filter(item => item.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  mobile.addEventListener('change', () => {
    nav.classList.remove('open');
    topMenus.forEach(collapse);
    drawerState();
  });
  drawerState();
})();
