import { reviews } from '../data/portfolio';
import styles from './Reviews.module.css';

export default function Reviews() {
  return (
    <section id="reviews" className={`sec ${styles.reviews}`}>
      <div className="inner">
        <div className="sec-tag">
          <div className="sec-tag-line" />
          <span>Testimonials</span>
          <span className="sec-num">/ 05</span>
        </div>
        <h2 className="big-title reveal">Client <em>Voices</em></h2>

        <div className={styles.grid}>
          {reviews.map((r, i) => (
            <div key={i} className={`rev-card ${styles.card} reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className={styles.quote}>"</div>
              <div className={styles.stars}>{'★'.repeat(5)}</div>
              <p className={styles.text}>&ldquo;{r.text}&rdquo;</p>
              <div className={styles.person}>
                <div className={styles.avatar}>{r.initial}</div>
                <div>
                  <div className={styles.name}>{r.name}</div>
                  <div className={styles.role}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
