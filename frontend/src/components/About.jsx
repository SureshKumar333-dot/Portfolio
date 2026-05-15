import { useEffect, useRef } from 'react';
import { personalInfo } from '../data/portfolio';
import aboutImg from '../assets/suresh-about.png';
import styles from './About.module.css';

function Counter({ target }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.unobserve(el);
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / 1600, 1);
          el.textContent = Math.floor(p * target) + '+';
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>0+</span>;
}

// Adaptive hue-shift: image is warm orange/teal → we shift to cool blue/magenta (opposite)
function useAdaptiveGlow(imgRef, canvasRef) {
  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const sample = () => {
      try {
        const ctx = canvas.getContext('2d');
        canvas.width = 40;
        canvas.height = 40;
        ctx.drawImage(img, 0, 0, 40, 40);
        const data = ctx.getImageData(0, 0, 40, 40).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        // Opposite direction: invert each channel
        const or = 255 - r;
        const og = 255 - g;
        const ob = 255 - b;
        // Apply to CSS variables on the about section
        const section = document.getElementById('about');
        if (section) {
          section.style.setProperty('--glow-r', or);
          section.style.setProperty('--glow-g', og);
          section.style.setProperty('--glow-b', ob);
        }
      } catch {
        // cross-origin canvas taint — silently skip, fallback CSS color used
      }
    };

    if (img.complete) sample();
    else img.addEventListener('load', sample);
    return () => img.removeEventListener('load', sample);
  }, []);
}

export default function About() {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  useAdaptiveGlow(imgRef, canvasRef);

  return (
    <section id="about" className={`sec ${styles.about}`}>
      {/* hidden canvas for colour sampling */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="inner">
        <div className="sec-tag">
          <div className="sec-tag-line" />
          <span>Who I Am</span>
          <span className="sec-num">/ 01</span>
        </div>
        <div className={styles.layout}>

          {/* ── LEFT: Image ── */}
          <div className={`${styles.visual} reveal-l`}>
            <div className={styles.imageWrap}>
              {/* Adaptive glow rings — colour set via CSS var from JS */}
              <div className={styles.glowRing1} />
              <div className={styles.glowRing2} />
              <div className={styles.glowRing3} />

              {/* Corner frame */}
              <div className={`${styles.corner} ${styles.tl}`} />
              <div className={`${styles.corner} ${styles.tr}`} />
              <div className={`${styles.corner} ${styles.bl}`} />
              <div className={`${styles.corner} ${styles.br}`} />

              {/* Scan-line overlay */}
              <div className={styles.scanlines} />

              {/* The actual photo */}
              <img
                ref={imgRef}
                src={aboutImg}
                alt="Suresh Kumar — UI/UX Designer & Developer"
                className={styles.photo}
                crossOrigin="anonymous"
              />

              {/* Bottom gradient fade */}
              <div className={styles.imgFade} />

              {/* Floating name tag */}
              <div className={styles.nameTag}>
                <span className={styles.nameTagDot} />
                <span>Suresh Kumar · UI/UX & Dev</span>
              </div>
            </div>

            {/* Experience badge */}
            <div className={styles.expBadge}>
              <div className={styles.expNum}>{personalInfo.yearsExp}+</div>
              <div className={styles.expLabel}>Years of Craft</div>
            </div>
          </div>

          {/* ── RIGHT: Text ── */}
          <div className={`${styles.text} reveal-r`}>
            <h2 className="big-title">About <em>Me</em></h2>
            <p>{personalInfo.bio}</p>
            <p>{personalInfo.bio2}</p>

            <div className={styles.statsRow}>
              {personalInfo.stats.map((s, i) => (
                <div key={i} className={`stat-box ${styles.statBox}`}>
                  <div className={styles.statN}><Counter target={s.num} /></div>
                  <div className={styles.statL}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className={styles.toolsRow}>
              {personalInfo.tools.map(t => (
                <span key={t} className={`tool-chip ${styles.toolChip}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
