import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Train, Shield, Eye, EyeOff, IdCard, KeyRound, UserCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuth, DEMO_USERS, PERMITTED_LOCATIONS } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithLocation } = useAuth();

  const [nid, setNid] = useState('NR-DLI-8842');
  const [password, setPassword] = useState('railrakshak2026');
  const [selectedLocationId, setSelectedLocationId] = useState('SEC-001');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Selected location metadata
  const activeLocation =
    PERMITTED_LOCATIONS.find((l) => l.id === selectedLocationId) || PERMITTED_LOCATIONS[0];

  // Auto-sync Location dropdown when user types a known NID
  useEffect(() => {
    const cleanNid = nid.trim().toLowerCase();
    const matched = DEMO_USERS.find(
      (u) =>
        u.badgeId.toLowerCase() === cleanNid ||
        u.email.toLowerCase() === cleanNid
    );
    if (matched) {
      setSelectedLocationId(matched.permittedSectionId);
    } else {
      if (cleanNid.startsWith('wr')) setSelectedLocationId('SEC-002');
      else if (cleanNid.startsWith('ner')) setSelectedLocationId('SEC-003');
      else if (cleanNid.startsWith('nwr')) setSelectedLocationId('SEC-004');
      else if (cleanNid.startsWith('ir')) setSelectedLocationId('ALL');
    }
  }, [nid]);

  const handleLocationChange = (locId: string) => {
    setSelectedLocationId(locId);
    setError('');
    // Optionally update NID placeholder/suggestion
    const match = DEMO_USERS.find((u) => u.permittedSectionId === locId);
    if (match && (!nid || nid === 'NR-DLI-8842' || nid === 'WR-BCT-5109' || nid === 'NER-LKO-3012' || nid === 'NWR-JP-7411' || nid === 'IR-HQ-0001')) {
      setNid(match.badgeId);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNid = nid.trim();
    if (!cleanNid) {
      setError('Please enter your Officer National ID (NID) / Badge ID.');
      return;
    }
    if (!password) {
      setError('Please enter your security pass key.');
      return;
    }

    loginWithLocation(cleanNid, selectedLocationId);
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundColor: 'var(--color-surface-base)' }}
    >
      {/* Background technical grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto my-6">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              <Train size={28} style={{ color: 'var(--color-surface-base)' }} strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-display-metrics" style={{ fontSize: '28px', color: 'var(--color-text-primary)' }}>
            RailRakshak AI
          </h1>
          <p className="text-label-mono mt-1" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
            PREDICT · PREVENT · PROTECT
          </p>
        </div>

        {/* Login Card */}
        <div className="panel" style={{ padding: '26px', borderTop: '2px solid var(--color-info)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-headline-md font-bold" style={{ color: 'var(--color-text-primary)', fontSize: '18px' }}>
                Officer Sign-In
              </h2>
              <p className="text-body-sm mt-0.5" style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                Confirm jurisdiction to access regional command
              </p>
            </div>
            <span className="badge badge-demo">AUTHORIZED ACCESS</span>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* National ID (NID) Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-label-mono flex items-center gap-1.5"
                  style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}
                >
                  <IdCard size={13} />
                  OFFICER NATIONAL ID (NID) / BADGE ID
                </label>
              </div>
              <input
                type="text"
                value={nid}
                onChange={(e) => {
                  setNid(e.target.value);
                  setError('');
                }}
                placeholder="e.g. NR-DLI-8842, WR-BCT-5109"
                required
                className="w-full rounded py-2.5 px-3 text-body-sm font-mono tracking-wide"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-label-mono flex items-center gap-1.5"
                  style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}
                >
                  <KeyRound size={13} />
                  SECURITY PASS KEY
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                  placeholder="Enter security pass key"
                  className="w-full rounded py-2.5 px-3 pr-10 text-body-sm"
                  style={{
                    backgroundColor: 'var(--color-surface-base)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: 'var(--color-text-dim)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Location / Jurisdiction Confirmation Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-label-mono flex items-center gap-1.5"
                  style={{ color: 'var(--color-info)', fontSize: '10px' }}
                >
                  <MapPin size={13} />
                  PERMITTED JURISDICTION / LOCATION CONFIRMATION
                </label>
              </div>
              <select
                value={selectedLocationId}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full rounded py-2.5 px-3 text-body-sm cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-info)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                }}
              >
                <option value="SEC-001">Northern Railway (NR) — Delhi Division (Delhi Section)</option>
                <option value="SEC-002">Western Railway (WR) — Mumbai Central (Mumbai Section)</option>
                <option value="SEC-003">North Eastern Railway (NER) — Lucknow Division (Lucknow Section)</option>
                <option value="SEC-004">North Western Railway (NWR) — Jaipur Division (Jaipur Section)</option>
                <option value="ALL">Railway Board — National Command HQ (All Indian Railway Zones)</option>
              </select>
            </div>

            {/* Confirmed Location HUD Badge */}
            <div
              className="rounded p-3 flex flex-col gap-1.5"
              style={{
                backgroundColor: 'var(--color-surface-container)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '9px' }}>
                  CONFIRMED ACCESS JURISDICTION
                </span>
                <span className="text-label-mono flex items-center gap-1" style={{ color: 'var(--color-low)', fontSize: '9px' }}>
                  <CheckCircle2 size={11} /> CONFORMED
                </span>
              </div>
              <p className="text-body-sm font-semibold" style={{ color: 'var(--color-info)' }}>
                {activeLocation.zone} — {activeLocation.division}
              </p>
              <div className="flex items-center justify-between text-label-mono" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>
                <span>GPS: {activeLocation.center[0]}° N, {activeLocation.center[1]}° E</span>
                <span style={{ color: activeLocation.id === 'ALL' ? 'var(--color-low)' : 'var(--color-high)' }}>
                  {activeLocation.id === 'ALL' ? '全 Nationwide View' : '🔒 Radar Geofence Active'}
                </span>
              </div>
            </div>

            {error && (
              <div
                className="rounded p-2.5 text-body-sm"
                style={{
                  backgroundColor: 'rgba(255, 59, 48, 0.1)',
                  color: 'var(--color-critical)',
                  border: '1px solid var(--color-critical)',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded font-semibold text-sm mt-1 transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-surface-base)',
              }}
            >
              <UserCheck size={16} />
              AUTHORIZE & ENTER {activeLocation.name.toUpperCase()}
            </button>
          </form>

          {/* Footer Security Notice */}
          <div className="mt-5 pt-4 flex items-center justify-center gap-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <Shield size={13} style={{ color: 'var(--color-low)' }} />
            <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
              Multi-Zone Role-Based Geospatial Security
            </span>
          </div>
        </div>

        {/* Bottom attribution */}
        <p className="text-center mt-6 text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
          MINISTRY OF RAILWAYS · RAILWAY SAFETY DIVISION · 2026
        </p>
      </div>
    </div>
  );
}
