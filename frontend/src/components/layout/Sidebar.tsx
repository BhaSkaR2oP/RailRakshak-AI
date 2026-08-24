import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanSearch,
  AlertTriangle,
  Map,
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  HelpCircle,
  Train,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/inspect', icon: ScanSearch, label: 'AI Inspection' },
  { to: '/defects', icon: AlertTriangle, label: 'Defects' },
  { to: '/map', icon: Map, label: 'Map' },
  { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '#help', icon: HelpCircle, label: 'Support' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="fixed left-0 top-0 z-50 flex h-screen w-[var(--sidebar-width)] flex-col border-r"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border-strong)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          <Train size={20} style={{ color: 'var(--color-surface)' }} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-headline-md font-bold tracking-tight" style={{ color: 'var(--color-text-primary)', fontSize: '16px' }}>
            RailRakshak AI
          </h1>
          <p className="text-label-mono" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>
            PRECISION SAFETY
          </p>
        </div>
      </div>

      {/* Operator Jurisdiction Card */}
      {user && (
        <div
          className="mx-3 mb-3 rounded p-2.5 flex flex-col gap-1"
          style={{
            backgroundColor: 'var(--color-surface-container)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '9px' }}>
            ACTIVE JURISDICTION
          </span>
          <span className="text-body-sm font-semibold truncate" style={{ color: 'var(--color-info)', fontSize: '12px' }}>
            {user.permittedArea.name}
          </span>
          <span className="text-label-mono truncate" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>
            {user.role === 'SUPER_ADMIN' ? 'Full All-Zone Access' : 'Geofence Active (Restricted)'}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={clsx(
                'group relative flex items-center gap-3 rounded px-3 py-2 transition-colors duration-150',
              )}
              style={{
                backgroundColor: isActive ? 'var(--color-surface-high)' : 'transparent',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
              )}
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-body-sm" style={{ fontWeight: isActive ? 600 : 400 }}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        className="flex flex-col gap-0.5 px-3 pb-4 pt-3 border-t"
        style={{ borderColor: 'var(--color-border-strong)' }}
      >
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex items-center gap-3 rounded px-3 py-2 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Icon size={18} strokeWidth={1.5} />
            <span className="text-body-sm">{label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded px-3 py-2 transition-colors w-full text-left"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span className="text-body-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
