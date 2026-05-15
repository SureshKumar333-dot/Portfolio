import { useEffect, useState } from 'react';
import api from '../api';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/admin/messages?limit=1'),
      api.get('/admin/messages?limit=1&unread=true'),
      api.get('/admin/projects'),
    ]).then(([all, unread, projects]) => {
      setStats({
        totalMessages: all.data.total,
        unreadMessages: unread.data.total,
        totalProjects: projects.data.length,
        visibleProjects: projects.data.filter(p => p.visible).length,
      });
    }).catch(() => {});
  }, []);

  const cards = stats ? [
    { label: 'Total Messages', value: stats.totalMessages, sub: `${stats.unreadMessages} unread`, icon: '✉', alert: stats.unreadMessages > 0 },
    { label: 'Total Projects', value: stats.totalProjects, sub: `${stats.visibleProjects} visible`, icon: '◎', alert: false },
    { label: 'Unread',         value: stats.unreadMessages, sub: 'Need attention', icon: '◉', alert: stats.unreadMessages > 0 },
  ] : [];

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.sub}>Welcome back. Here's what's happening.</p>
      </div>

      {!stats ? (
        <div className={styles.loading}>Loading stats…</div>
      ) : (
        <div className={styles.cards}>
          {cards.map(c => (
            <div key={c.label} className={`${styles.card} ${c.alert ? styles.alert : ''}`}>
              <div className={styles.cardIcon}>{c.icon}</div>
              <div className={styles.cardVal}>{c.value}</div>
              <div className={styles.cardLabel}>{c.label}</div>
              <div className={styles.cardSub}>{c.sub}</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.quickLinks}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actions}>
          <a href="/messages" className={styles.action}>
            <span className={styles.actionIcon}>✉</span>
            <div>
              <div className={styles.actionLabel}>View Messages</div>
              <div className={styles.actionSub}>Review and reply to inquiries</div>
            </div>
            <span className={styles.actionArrow}>→</span>
          </a>
          <a href="/projects" className={styles.action}>
            <span className={styles.actionIcon}>◎</span>
            <div>
              <div className={styles.actionLabel}>Manage Projects</div>
              <div className={styles.actionSub}>Add, edit, or reorder portfolio work</div>
            </div>
            <span className={styles.actionArrow}>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
