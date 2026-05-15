import { useState, useEffect } from 'react';
import { navLinks, personalInfo } from '../data/portfolio';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${solid ? styles.solid : ''}`} id="nav">
      <a href="#hero" className={styles.logo}>
        <span className={styles.logoDot} />
        <span className={styles.logoText}>{personalInfo.initials}.</span>
      </a>

      <ul className={styles.links}>
        {navLinks.map(link => (
          <li key={link.href}>
            <a href={link.href} data-num={link.num}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a href="#contact" className={styles.hireBtn}>
        <span>Hire Me</span>
        <span className={styles.arr}>→</span>
      </a>
    </nav>
  );
}
