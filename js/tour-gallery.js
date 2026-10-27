/* Pause automatic movement for visitors requesting reduced motion. */
(() => {
  const el = document.getElementById('thailandExposure');
  if (!el || !window.bootstrap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const stop = () => bootstrap.Carousel.getOrCreateInstance(el).pause();
    if (document.readyState === 'complete') stop();
    else window.addEventListener('load', stop, { once: true });
  }
})();
