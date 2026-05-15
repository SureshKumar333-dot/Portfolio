import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';

const navItems = [
  { to: '/',         label: 'Dashboard', icon: '◈' },
  { to: '/messages', label: 'Messages',  icon: '✉' },
  { to: '/projects', label: 'Projects',  icon: '◎' },
];

export default function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          <span>Admin</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className={styles.logout} onClick={logout}>
          ⏻ &nbsp;Logout
        </button>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
