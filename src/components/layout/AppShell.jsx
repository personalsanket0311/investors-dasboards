'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Icon from '../ui/Icon';
import useUiSettings from '@/hooks/useUiSettings';

const NAV = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/deals', label: 'Deal explorer', icon: 'deals' },
  { href: '/recommendations', label: 'Recommended', icon: 'spark' },
  { href: '/interests', label: 'My interests', icon: 'heart' },
  { href: '/corporate', label: 'Corporate view', icon: 'building' },
];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const savedCount = useSelector((s) => s.interests.ids.length);
  const { theme, toggleTheme, simulateErrors, toggleErrors } = useUiSettings();
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true">3D</span>
          <span><strong>3D Bharat</strong><small>Deal desk</small></span>
        </Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`nav__link ${isActive(n.href) ? 'is-active' : ''}`} aria-current={isActive(n.href) ? 'page' : undefined}>
              <Icon name={n.icon} /> <span>{n.label}</span>
              {n.href === '/interests' && savedCount > 0 && <em className="nav__count">{savedCount}</em>}
            </Link>
          ))}
        </nav>
        <div className="sidebar__foot">
          <label className="switch" title="Make ~35% of requests fail so you can see the error states">
            <input type="checkbox" checked={simulateErrors} onChange={toggleErrors} />
            <span className="switch__track" /> <span>Simulate API errors</span>
          </label>
          <button className="btn btn--ghost" onClick={toggleTheme} aria-label="Toggle dark mode">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} /> {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
