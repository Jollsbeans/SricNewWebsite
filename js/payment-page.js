/* Tuition filtering and account-number copying. No payment is processed here. */
(() => {
  'use strict';
  const department = document.getElementById('fee-department');
  const search = document.getElementById('fee-search');
  const cards = [...document.querySelectorAll('[data-fee-card]')];
  const groups = [...document.querySelectorAll('[data-fee-group]')];

  function filterFees() {
    const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      const matches = (department.value === 'all' || card.dataset.department === department.value)
        && terms.every(term => card.dataset.label.includes(term));
      card.hidden = !matches;
      if (matches) count += 1;
    });
    groups.forEach(group => {
      group.hidden = ![...group.querySelectorAll('[data-fee-card]')].some(card => !card.hidden);
      if (!group.hidden) group.open = true;
    });
    document.getElementById('fee-status').textContent = `${count} fee schedule${count === 1 ? '' : 's'}`;
    document.getElementById('fee-empty').hidden = count !== 0;
  }
  department.addEventListener('change', filterFees);
  search.addEventListener('input', filterFees);

  document.getElementById('copy-bank-account').addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText('9240-0040-78');
      status.textContent = 'Account number copied.';
    } catch {
      status.textContent = 'Please select and copy the account number: 9240-0040-78';
    }
  });
})();
