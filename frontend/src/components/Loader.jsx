import { useState, useEffect } from 'react';
import styles from './Loader.module.css';

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 4 + 1;
      if (prog >= 100) {
        prog = 100;
        clearInterval(iv);
        setTimeout(() => {
          setDone(true);
          setTimeout(onDone, 600);
        }, 300);
      }
      setProgress(Math.floor(prog));
    }, 40);
    return () => clearInterval(iv);
  }, [onDone]);

  return (
    <div className={`${styles.loader} ${done ? styles.done : ''}`}>
      <div className={styles.num}>{progress}</div>
      <div className={styles.barWrap}>
        <div className={styles.bar} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.label}>Loading Portfolio</div>
    </div>
  );
}
