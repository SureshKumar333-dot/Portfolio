import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
      }),
      { threshold: 0.1 }
    );

    const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
    els.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  });
}
