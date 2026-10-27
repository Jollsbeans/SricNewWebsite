/* All totals use the uploaded 2026-2027 schedule, with source differences exposed. */
(() => {
  'use strict';
  const data = window.SRIC_FEES;
  if (!data) return;
  const php = value => new Intl.NumberFormat('en-PH', {
    style: 'currency', currency: 'PHP', minimumFractionDigits: 2
  }).format(value);

  function assessment(id) {
    const fee = data.schedules.find(row => row.id === id);
    if (!fee) return null;
    const miscItems = data.miscLabels.map((label, i) => ({ label, value: data.miscProfiles[fee.miscProfile][i] }));
    const businessItems = [
      { label: 'Books', value: fee.books },
      { label: 'Student handbook', value: fee.handbook },
      { label: 'ID with lanyard (dash in source)', value: fee.idLanyard }
    ];
    return {
      fee, miscItems, businessItems,
      total: fee.tuition + fee.miscellaneous + fee.businessCenter,
      businessItemTotal: businessItems.reduce((sum, item) => sum + item.value, 0)
    };
  }
  window.SRICFeeAssessment = assessment;
  const select = document.getElementById('fee-schedule');
  if (!select) return;
  function fillList(id, items) {
    const list = document.getElementById(id);
    list.replaceChildren();
    items.forEach(item => {
      const row = document.createElement('li');
      const label = document.createElement('span');
      const amount = document.createElement('strong');
      label.textContent = item.label;
      amount.textContent = php(item.value);
      row.append(label, amount);
      list.append(row);
    });
  }
  function render() {
    const result = assessment(select.value);
    if (!result) return;
    const { fee } = result;
    document.getElementById('selected-fee-label').textContent = fee.label;
    document.getElementById('fee-tuition').textContent = fee.id === 'shs-voucher' ? '— (source schedule)' : php(fee.tuition);
    document.getElementById('fee-misc').textContent = php(fee.miscellaneous);
    document.getElementById('fee-business').textContent = php(fee.businessCenter);
    document.getElementById('fee-total').textContent = php(result.total);
    document.getElementById('selected-misc-total').textContent = php(fee.miscellaneous);
    document.getElementById('selected-business-total').textContent = php(result.businessItemTotal);
    fillList('selected-misc-list', result.miscItems);
    fillList('selected-business-list', result.businessItems);
    const note = document.getElementById('business-discrepancy');
    const difference = fee.businessCenter - result.businessItemTotal;
    note.hidden = difference === 0;
    note.textContent = difference ? `The summary uses ${php(fee.businessCenter)}; the itemized business-center table adds to ${php(result.businessItemTotal)}. Difference: ${php(difference)}. This amount is not itemized in the source; confirm with Accounting.` : '';
    document.getElementById('fee-selection-note').textContent = fee.id === 'shs-voucher'
      ? 'Separate Grade 11/12 voucher schedule. The detailed miscellaneous column is labeled Academic-Voucher. No extra voucher discount is deducted.' : '';
  }
  select.addEventListener('change', render);
  document.querySelectorAll('[data-view-fees]').forEach(button => {
    button.addEventListener('click', () => {
      select.value = button.dataset.viewFees;
      render();
      document.getElementById('fee-calculator').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      select.focus({ preventScroll: true });
    });
  });
  document.getElementById('fee-department')?.addEventListener('change', event => {
    document.querySelectorAll('[data-fee-row]').forEach(row => {
      row.hidden = Boolean(event.target.value && row.dataset.department !== event.target.value);
    });
  });
  document.getElementById('copy-fee-bank').addEventListener('click', async () => {
    const status = document.getElementById('fee-copy-status');
    try {
      await navigator.clipboard.writeText('9240-0040-78');
      status.textContent = 'Account number copied.';
    } catch {
      status.textContent = 'Select and copy the account number: 9240-0040-78';
    }
  });
  render();
})();
