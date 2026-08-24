import { Bell, Clock, LogOut, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="fixed top-0 right-0 z-40 flex h-[var(--topbar-height)] items-center justify-between border-b px-6"
      style={{
        left: 'var(--sidebar-width)',
        backgroundColor: 'var(--color-surface-container)',
        borderColor: 'var(--color-border-strong)',
      }}
    >
      {/* Left: Title + Status */}
      <div className="flex items-center gap-6">
        <h2 className="text-headline-md font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h2>
        {subtitle && (
          <>
            <div className="h-4 w-px" style={{ backgroundColor: 'var(--color-border-strong)' }} />
            <span className="text-label-mono flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
              {subtitle}
            </span>
          </>
        )}
        {/* Permitted Zone Badge */}
        {user && (
          <div
            className="hidden lg:flex items-center gap-2 rounded px-2.5 py-1"
            style={{
              backgroundColor: 'rgba(76, 214, 255, 0.08)',
              border: '1px solid rgba(76, 214, 255, 0.3)',
            }}
          >
            <MapPin size={13} style={{ color: 'var(--color-info)' }} />
            <span className="text-label-mono" style={{ color: 'var(--color-info)', fontSize: '11px' }}>
              JURISDICTION: {user.permittedArea.name.toUpperCase()}
            </span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full animate-pulse-dot"
            style={{ backgroundColor: 'var(--color-low)' }}
          />
          <span className="text-label-mono" style={{ color: 'var(--color-low)', fontSize: '11px' }}>
            OPERATIONAL
          </span>
        </div>
      </div>

      {/* Right: User Profile & Actions */}
      <div className="flex items-center gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          title="Schedule"
        >
          <Clock size={18} />
        </button>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          title="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: 'var(--color-critical)' }}
          />
        </button>

        {user && (
          <div
            className="flex items-center gap-2.5 pl-3 border-l"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold"
              style={{
                backgroundColor: 'var(--color-info)',
                color: '#000000',
                fontFamily: 'var(--font-mono)',
              }}
              title={user.roleTitle}
            >
              {user.avatarInitials}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-body-sm font-semibold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                {user.name}
              </span>
              <span className="text-label-mono leading-tight" style={{ color: 'var(--color-text-muted)', fontSize: '9px' }}>
                {user.badgeId}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="ml-1 p-1.5 rounded hover:bg-[var(--color-surface-high)] text-[var(--color-text-muted)] hover:text-[var(--color-critical)] transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
