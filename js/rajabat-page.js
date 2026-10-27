/* Filter original faculty groups by degree and search terms. */
(() => {
  'use strict';
  const level = document.getElementById('aru-level');
  const search = document.getElementById('aru-search');
  if (!level || !search) return;
  const cards = [...document.querySelectorAll('#masters .program, #doctoral .program')];
  function filter() {
    const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      card.hidden = Boolean(level.value && card.closest('section').id !== level.value)
        || !terms.every(term => card.textContent.toLowerCase().includes(term));
      if (!card.hidden) count += card.querySelectorAll('li').length;
    });
    ['masters', 'doctoral'].forEach(id => {
      const section = document.getElementById(id);
      section.hidden = ![...section.querySelectorAll('.program')].some(card => !card.hidden);
    });
    document.getElementById('aru-results').textContent = count ? `${count} listed programs in matching faculty groups` : 'No matching programs. Try another search.';
  }
  level.addEventListener('change', filter);
  search.addEventListener('input', filter);
})();
