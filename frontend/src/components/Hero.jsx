import { personalInfo } from '../data/portfolio';
import styles from './Hero.module.css';

export default function Hero() {
  const { heroCard } = personalInfo;

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.gridOverlay} />

      <div className={styles.left}>
        <div className={styles.tag}>
          <span className={styles.tagDot} />
          <span>{personalInfo.tagline}</span>
        </div>

        <h1 className={styles.h1}>
          <span className={styles.line}><span>Crafting</span></span>
          <span className={styles.line}><span><em>Digital</em></span></span>
          <span className={styles.line}><span>Experiences</span></span>
        </h1>

        <p className={styles.sub}>
          {personalInfo.bio}
        </p>

        <div className={styles.btns}>
          <a href="#projects" className={styles.btnMag}><span>View Work</span></a>
          <a href="#contact" className={styles.btnGhost}>Let's Talk →</a>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>{heroCard.label}</div>
          <div className={styles.cardBig}>{heroCard.bigNum}</div>
          <div className={styles.cardSub}>{heroCard.bigSub}</div>
          <div className={styles.cardDivider} />
          {heroCard.rows.map((row, i) => (
            <div key={i} className={styles.cardRow}>
              <span className={styles.cardItemLabel}>{row.label}</span>
              <span className={styles.cardItemVal}>{row.value}</span>
            </div>
          ))}
          <div className={styles.availBadge}>
            <span className={styles.availDot} />
            <span>Available for Projects</span>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll to explore</span>
      </div>
    </section>
  );
}
