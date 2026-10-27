/* Filter the collected school documents without changing their source links. */
(() => {
  'use strict';
  const select = document.getElementById('permit-category');
  if (!select) return;
  const cards = [...document.querySelectorAll('[data-permit-group]')];
  select.addEventListener('change', () => {
    let count = 0;
    cards.forEach(card => {
      card.hidden = Boolean(select.value && card.dataset.permitGroup !== select.value);
      if (!card.hidden) count += 1;
    });
    document.getElementById('permit-count').textContent = `${count} document${count === 1 ? '' : 's'}`;
  });
})();
