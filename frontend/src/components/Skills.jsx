import { useState, useEffect, useRef } from 'react';
import { skills } from '../data/portfolio';
import styles from './Skills.module.css';

function SkillBar({ level }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.width = level + '%';
        observer.unobserve(el);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [level]);
  return (
    <div className={styles.barWrap}>
      <div className={styles.bar} ref={ref} style={{ width: 0 }} />
    </div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState(skills[0].key);

  const activeSkills = skills.find(s => s.key === activeTab)?.items || [];

  return (
    <section id="skills" className={`sec ${styles.skills}`}>
      <div className="inner">
        <div className="sec-tag">
          <div className="sec-tag-line" />
          <span>What I Do</span>
          <span className="sec-num">/ 02</span>
        </div>
        <h2 className="big-title reveal">My <em>Expertise</em></h2>

        <div className={styles.tabs}>
          {skills.map(s => (
            <button
              key={s.key}
              className={`${styles.tab} ${activeTab === s.key ? styles.on : ''}`}
              onClick={() => setActiveTab(s.key)}
            >
              {s.tab}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {activeSkills.map((item, i) => (
            <div key={item.num} className={`sk-card ${styles.card} ${styles.show}`} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className={styles.cardNum}>{item.num}</div>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.desc}>{item.desc}</div>
              <div className={styles.barLabel}>
                <span>{item.levelLabel}</span>
                <strong>{item.level}%</strong>
              </div>
              <SkillBar level={item.level} />
              <div className={styles.tags}>
                {item.tags.map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
