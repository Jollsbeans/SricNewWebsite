/* Zoom the original chart without modifying its contents. */
(() => {
  'use strict';
  const viewport = document.getElementById('org-viewport');
  const image = document.getElementById('org-chart-image');
  if (!viewport || !image) return;
  const decrease = document.getElementById('org-zoom-out');
  const increase = document.getElementById('org-zoom-in');
  let zoom = 100;
  function setZoom(value, reset = false) {
    const oldWidth = image.clientWidth || 1;
    const centerX = (viewport.scrollLeft + viewport.clientWidth / 2) / oldWidth;
    const centerY = (viewport.scrollTop + viewport.clientHeight / 2) / (image.clientHeight || 1);
    zoom = Math.max(100, Math.min(400, value));
    image.style.width = `${zoom}%`;
    document.getElementById('org-zoom-status').textContent = `${zoom}%`;
    decrease.disabled = zoom === 100;
    increase.disabled = zoom === 400;
    if (reset) { viewport.scrollLeft = 0; viewport.scrollTop = 0; }
    else {
      viewport.scrollLeft = centerX * image.clientWidth - viewport.clientWidth / 2;
      viewport.scrollTop = centerY * image.clientHeight - viewport.clientHeight / 2;
    }
  }
  decrease.addEventListener('click', () => setZoom(zoom - 25));
  increase.addEventListener('click', () => setZoom(zoom + 25));
  document.getElementById('org-fit').addEventListener('click', () => setZoom(100, true));
  setZoom(100, true);
})();
