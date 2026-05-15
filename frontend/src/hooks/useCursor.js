import { useEffect } from 'react';

export function useCursor() {
  useEffect(() => {
    const cur = document.getElementById('cur');
    const trail = document.getElementById('cur-trail');
    if (!cur || !trail) return;

    let cx = 0, cy = 0, tx = 0, ty = 0;
    let raf;

    const onMove = (e) => {
      cx = e.clientX;
      cy = e.clientY;
      cur.style.left = cx + 'px';
      cur.style.top = cy + 'px';
    };

    const loop = () => {
      tx += (cx - tx) * 0.18;
      ty += (cy - ty) * 0.18;
      trail.style.left = tx + 'px';
      trail.style.top = ty + 'px';
      raf = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);

    const hoverEls = document.querySelectorAll('a, button, .proj-card, .rev-card, .sk-card, .stat-box, .tool-chip');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('big'));
      el.addEventListener('mouseleave', () => cur.classList.remove('big'));
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
}
