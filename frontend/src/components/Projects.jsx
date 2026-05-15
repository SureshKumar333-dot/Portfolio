import { useState, useEffect } from 'react';
import api from '../lib/api';
import { projects as staticProjects } from '../data/portfolio';
import styles from './Projects.module.css';

const SOURCE_LABELS = { behance: 'Behance', github: 'GitHub' };
const SOURCE_LINKS  = {
  behance: 'https://www.behance.net/sureshsarathi',
  github:  'https://github.com/SureshKumar333-dot',
};

export default function Projects() {
  const [projects, setProjects] = useState(staticProjects);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/api/projects')
      .then(res => { if (res.data?.length) setProjects(res.data); })
      .catch(() => {});
  }, []);

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.source === filter);

  return (
    <section id="projects" className={`sec ${styles.projects}`}>
      <div className="inner">
        <div className="sec-tag">
          <div className="sec-tag-line" />
          <span>Selected Work</span>
          <span className="sec-num">/ 03</span>
        </div>
        <div className={styles.titleRow}>
          <h2 className="big-title reveal">Featured <em>Projects</em></h2>
          <div className={styles.filterRow}>
            {['all','behance','github'].map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All Work' : SOURCE_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filtered.map(p => (
            <div key={p.id || p.num} className={`proj-card ${styles.card} ${p.large ? styles.large : ''} reveal`}>
              <div className={styles.thumb}>
                {p.thumb
                  ? <img src={p.thumb} alt={p.name} className={styles.thumbImg} />
                  : <>
                      <span className={styles.thumbNum}>{p.num}</span>
                      <span className={styles.thumbLabel}>{p.label}</span>
                    </>
                }
                {p.source && (
                  <a
                    href={SOURCE_LINKS[p.source]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.sourceBadge} ${styles[p.source]}`}
                  >
                    {SOURCE_LABELS[p.source]}
                  </a>
                )}
                <div className={styles.overlay}>
                  <a
                    href={p.caseLink || p.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.overlayBtn}
                  >
                    {p.source === 'github' ? 'View on GitHub →' : 'View on Behance →'}
                  </a>
                </div>
              </div>
              <div className={styles.info}>
                <div className={styles.type}>{p.type}</div>
                <div className={styles.name}>{p.name}</div>
                <div className={styles.desc}>{p.desc}</div>
                <div className={styles.tech}>
                  {p.tech.map(t => <span key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
