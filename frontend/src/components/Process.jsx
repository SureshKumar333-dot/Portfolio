import { process } from '../data/portfolio';
import styles from './Process.module.css';

export default function Process() {
  return (
    <section id="process" className={`sec ${styles.process}`}>
      <div className="inner">
        <div className="sec-tag">
          <div className="sec-tag-line" />
          <span>How I Work</span>
          <span className="sec-num">/ 04</span>
        </div>
        <h2 className="big-title reveal">My <em>Process</em></h2>
        <div className={styles.steps}>
          {process.map((step, i) => (
            <div key={step.num} className={`${styles.step} reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className={styles.num}>{step.num}</div>
              <div className={styles.title}>{step.title}</div>
              <div className={styles.desc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
