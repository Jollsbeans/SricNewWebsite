/* Filtering uses page titles, sections and the editable names arrays. */
(() => {
  'use strict';
  const pages = window.SRIC_YEARBOOK_PAGES || [];
  const normalize = value => String(value).normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  function findPages(query, section, schoolYear = '') {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return pages.filter(page => (!section || page.section === section)
      && (!schoolYear || (schoolYear === 'unspecified' ? !page.schoolYear : page.schoolYear === schoolYear))
      && terms.every(term => normalize([page.title, page.section, ...(page.names || []), page.searchText || ''].join(' ')).includes(term)));
  }

  // Exposed for troubleshooting the editable index without changing reader code.
  window.SRICYearbookSearch = findPages;
  const form = document.getElementById('yb-search-form');
  if (!form) return;
  const search = document.getElementById('yb-search');
  const section = document.getElementById('yb-section');
  const schoolYear = document.getElementById('yb-school-year');
  const chooser = document.getElementById('yb-page-select');
  const image = document.getElementById('yb-image');
  const original = document.getElementById('yb-original');
  const book = document.getElementById('yb-book');
  const viewer = document.getElementById('yb-viewer');
  const prev = document.getElementById('yb-prev');
  const next = document.getElementById('yb-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let matches = [...pages];
  let position = 0;
  let animation = null;
  let sheet = null;
  let debounce;

  [...new Set(pages.map(page => page.section))].forEach(label => {
    section.add(new Option(label, label));
  });

  // Configured years and years found in the index are both available.
  [...new Set([...(window.SRIC_YEARBOOK_SCHOOL_YEARS || []),
    ...pages.map(page => page.schoolYear).filter(Boolean)])].sort().forEach(year => {
    schoolYear.add(new Option(`S.Y. ${year}`, year));
  });
  if (pages.some(page => !page.schoolYear)) {
    schoolYear.add(new Option('Unspecified', 'unspecified'));
  }

  // This yearbook is confirmed as S.Y. 2025–2026.
  schoolYear.value = '2025-2026';
  if (schoolYear.selectedOptions[0]) schoolYear.selectedOptions[0].defaultSelected = true;

  function stopTurn() {
    if (animation) animation.cancel();
    if (sheet) sheet.remove();
    animation = null;
    sheet = null;
  }

  function showPage(index, animate = true, direction = 1) {
    stopTurn();
    const empty = matches.length === 0;
    viewer.hidden = empty;
    document.getElementById('yb-empty').hidden = !empty;
    prev.disabled = empty || index <= 0;
    next.disabled = empty || index >= matches.length - 1;
    chooser.disabled = empty;
    if (empty) {
      document.getElementById('yb-position').textContent = 'No matching pages';
      return;
    }
    position = Math.max(0, Math.min(index, matches.length - 1));
    const page = matches[position];
    const oldSrc = image.getAttribute('src');
    const oldAlt = image.alt;
    image.src = page.src;
    image.alt = `${page.title} — yearbook page ${page.page}`;
    original.href = page.src;
    chooser.value = String(position);
    document.getElementById('yb-position').textContent =
      `Page ${page.page} of ${pages.length} · Result ${position + 1} of ${matches.length}`;

    if (animate && oldSrc !== page.src && !reducedMotion.matches && book.animate) {
      const turning = document.createElement('img');
      turning.className = 'yb-turn-sheet';
      turning.src = direction > 0 ? oldSrc : page.src;
      turning.alt = '';
      turning.setAttribute('aria-hidden', 'true');
      turning.style.transformOrigin = direction > 0 ? 'left center' : 'right center';
      book.appendChild(turning);
      sheet = turning;
      animation = turning.animate([
        { transform: `rotateY(${direction > 0 ? 0 : 85}deg)`, filter: 'brightness(1)' },
        { transform: `rotateY(${direction > 0 ? -90 : 0}deg)`, filter: 'brightness(.85)' }
      ], { duration: 550, easing: 'ease-in-out' });
      animation.onfinish = () => { turning.remove(); if (sheet === turning) { sheet = null; animation = null; } };
    }
    const upcoming = matches[position + 1];
    if (upcoming) { const preload = new Image(); preload.src = upcoming.src; }
  }

  function applyFilters(animate = true) {
    const previousPage = matches[position]?.page || 1;
    matches = findPages(search.value, section.value, schoolYear.value);
    chooser.replaceChildren();
    matches.forEach((page, index) => {
      chooser.add(new Option(`${page.page}. ${page.title}`, String(index)));
    });
    document.getElementById('yb-results').textContent =
      `${matches.length} of ${pages.length} pages${search.value.trim() ? ' match your search' : ''}`;
    showPage(0, animate, (matches[0]?.page || 1) >= previousPage ? 1 : -1);
  }

  form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(debounce); applyFilters(); });
  search.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => applyFilters(), 250); });
  section.addEventListener('change', () => { clearTimeout(debounce); applyFilters(); });
  schoolYear.addEventListener('change', () => { clearTimeout(debounce); applyFilters(); });
  form.addEventListener('reset', () => { clearTimeout(debounce); setTimeout(() => applyFilters(), 0); });
  prev.addEventListener('click', () => { if (position > 0) showPage(position - 1, true, -1); });
  next.addEventListener('click', () => { if (position + 1 < matches.length) showPage(position + 1); });
  chooser.addEventListener('change', () => { const value = Number(chooser.value); showPage(value, true, value >= position ? 1 : -1); });
  // Page navigation works anywhere on this page, except while editing filters
  // or interacting with the header navigation and other keyboard controls.
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof Element && target.closest(
      'input, textarea, select, [contenteditable], [role="textbox"], header, [role="dialog"]'
    )) return;
    if (viewer.hidden) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev.click();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next.click();
    }
  });
  let touchStart = null;
  viewer.addEventListener('touchstart', event => { touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }, { passive: true });
  viewer.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev).click();
    touchStart = null;
  }, { passive: true });
  applyFilters(false);
})();
