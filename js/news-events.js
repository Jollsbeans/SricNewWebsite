/* Independent slider: existing testimonial and video carousels are unchanged. */
(() => {
    'use strict';
    const slider = document.querySelector('.news-slider');
    if (!slider) return;
    slider.querySelectorAll('.news-pause').forEach(button => button.remove());
    const track = slider.querySelector('.news-track');
    const cards = [...track.querySelectorAll('.news-card')];
    const status = slider.querySelector('.news-status');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = motion.matches;
    let hovered = false;
    let touching = false;
    let timer;

    const stepWidth = () => cards[0].getBoundingClientRect().width + 25;
    function move(direction, announce = false) {
        const end = Math.max(0, track.scrollWidth - track.clientWidth);
        let next = track.scrollLeft + direction * stepWidth();
        if (direction > 0 && track.scrollLeft >= end - 3) next = 0;
        if (direction < 0 && track.scrollLeft <= 3) next = end;
        track.scrollTo({ left: Math.min(end, Math.max(0, next)), behavior: motion.matches ? 'instant' : 'smooth' });
        if (announce) status.textContent = `Showing news item ${Math.min(cards.length, Math.round(Math.min(end, Math.max(0, next)) / stepWidth()) + 1)} of ${cards.length}.`;
    }
    function schedule() {
        clearInterval(timer);
        const expanded = !!slider.querySelector('details[open]');
        if (!paused && !hovered && !touching && !expanded && !document.hidden && !slider.contains(document.activeElement)) {
            timer = setInterval(() => move(1), 6500);
        }
    }
    slider.querySelector('.news-prev').addEventListener('click', () => move(-1, true));
    slider.querySelector('.news-next').addEventListener('click', () => move(1, true));
    slider.addEventListener('mouseenter', () => { hovered = true; schedule(); });
    slider.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    slider.addEventListener('focusin', schedule);
    slider.addEventListener('focusout', () => setTimeout(schedule, 0));
    slider.addEventListener('pointerdown', () => { touching = true; schedule(); });
    window.addEventListener('pointerup', () => { if (touching) { touching = false; schedule(); } });
    window.addEventListener('pointercancel', () => { touching = false; schedule(); });
    slider.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', schedule));
    slider.addEventListener('keydown', event => {
        if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            move(event.key === 'ArrowRight' ? 1 : -1, true);
        }
    });
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', () => { paused = motion.matches; schedule(); });
    schedule();
})();
