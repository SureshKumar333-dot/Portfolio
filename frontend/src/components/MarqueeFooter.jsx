import { marqueeItems, personalInfo } from '../data/portfolio';
import styles from './MarqueeFooter.module.css';

export function Marquee() {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        {doubled.map((item, i) => (
          <div key={i} className={styles.item}>
            <span>{item}</span>
            <span className={styles.sep}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SOCIALS = [
  { key: 'linkedin',  label: 'Li', title: 'LinkedIn'  },
  { key: 'behance',   label: 'Bē', title: 'Behance'   },
  { key: 'dribbble',  label: 'Dr', title: 'Dribbble'  },
  { key: 'github',    label: 'GH', title: 'GitHub'    },
  { key: 'instagram', label: 'Ig', title: 'Instagram' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>{personalInfo.initials}.</div>
      <div className={styles.copy}>© 2026 Suresh Kumar · All Rights Reserved</div>
      <div className={styles.socials}>
        {SOCIALS.map(s => personalInfo.socials[s.key] && (
          <a
            key={s.key}
            href={personalInfo.socials[s.key]}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.soc}
            title={s.title}
          >
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
