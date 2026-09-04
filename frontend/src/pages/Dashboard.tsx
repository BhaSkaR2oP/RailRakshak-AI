import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, AreaChart, Area,
} from 'recharts';
import {
  ClipboardCheck, AlertTriangle, ShieldAlert, TrendingUp,
  CheckCircle, ChevronRight,
} from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import { demoDefects, kpiData, analyticsData, SEVERITY_COLORS, timeAgo } from '../data/mockData';
import type { Severity } from '../types';
import MapView from '../components/dashboard/MapView';
import { useAuth } from '../context/AuthContext';

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`badge badge-${severity.toLowerCase()}`}>{severity}</span>
  );
}

function KPICard({ label, value, icon: Icon, trend, accent }: {
  label: string; value: string | number; icon: React.ElementType;
  trend?: string; accent?: string;
}) {
  return (
    <div
      className="panel flex flex-col justify-between"
      style={{ borderTopWidth: '2px', borderTopColor: accent || 'var(--color-accent)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-label-mono" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
        <Icon size={18} style={{ color: accent || 'var(--color-outline)' }} />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-kpi-value" style={{ color: accent || 'var(--color-text-primary)' }}>
          {value}
        </span>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-label-mono" style={{ color: 'var(--color-info)', fontSize: '11px' }}>
          <TrendingUp size={14} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  const isSuperAdmin = !user?.permittedSectionId || user.permittedSectionId === 'ALL';
  const permittedDefects = isSuperAdmin
    ? demoDefects
    : demoDefects.filter(d => d.section === user?.permittedArea.name);

  const recentDefects = permittedDefects.slice(0, 5);

  const activeCount = permittedDefects.filter(d => d.status !== 'RESOLVED').length;
  const criticalCount = permittedDefects.filter(d => d.severity === 'CRITICAL' && d.status !== 'RESOLVED').length;
  const highCount = permittedDefects.filter(d => d.severity === 'HIGH' && d.status !== 'RESOLVED').length;

  return (
    <>
      <TopBar title="Command Center" subtitle={user?.permittedArea.division || 'Central Command'} />
      <div className={`max-w-[1600px] mx-auto flex flex-col gap-3 ${loaded ? 'stagger-children' : ''}`}>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <KPICard
            label="Inspections (Zone)"
            value={isSuperAdmin ? kpiData.total_inspections : 32}
            icon={ClipboardCheck}
            trend="+8% this week"
            accent="var(--color-accent)"
          />
          <KPICard
            label="Active Defects"
            value={isSuperAdmin ? kpiData.active_defects : activeCount}
            icon={AlertTriangle}
            accent="var(--color-high)"
          />
          <KPICard
            label="Critical Defects"
            value={isSuperAdmin ? kpiData.critical_defects : criticalCount}
            icon={ShieldAlert}
            accent="var(--color-critical)"
          />
          <KPICard
            label="High Risk"
            value={isSuperAdmin ? kpiData.high_risk : highCount}
            icon={AlertTriangle}
            accent="var(--color-high)"
          />
          <KPICard
            label="Resolution Rate"
            value={`${kpiData.resolved_percentage}%`}
            icon={CheckCircle}
            trend="+3% vs last week"
            accent="var(--color-low)"
          />
        </div>

        {/* Map + Recent Detections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Map */}
          <div className="lg:col-span-8 panel" style={{ padding: 0, overflow: 'hidden', height: '420px' }}>
            <MapView />
          </div>

          {/* Recent AI Detections in Permitted Jurisdiction */}
          <div className="lg:col-span-4 panel flex flex-col" style={{ height: '420px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-headline-md" style={{ color: 'var(--color-text-primary)', fontSize: '15px' }}>
                Zone AI Detections
              </h3>
              <span className="badge badge-demo">{user?.permittedArea.name || 'DEMO'}</span>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
              {recentDefects.map((d) => (
                <button
                  key={d.id}
                  onClick={() => navigate(`/defects/${d.id}`)}
                  className="flex items-center gap-3 rounded p-3 transition-colors text-left w-full"
                  style={{ backgroundColor: 'var(--color-surface-container)' }}
                >
                  <div
                    className="h-10 w-1 rounded-full shrink-0"
                    style={{ backgroundColor: SEVERITY_COLORS[d.severity] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-body-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                        {d.defect_type}
                      </span>
                      <SeverityBadge severity={d.severity} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-label-mono" style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'none' }}>
                        {d.confidence}% confidence
                      </span>
                      <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px', textTransform: 'none' }}>
                        {timeAgo(d.timestamp)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--color-text-dim)' }} />
                </button>
              ))}
              {recentDefects.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-8" style={{ color: 'var(--color-text-dim)' }}>
                  <p className="text-body-sm">No defects detected in your permitted division.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Defect Trend */}
          <div className="lg:col-span-8 panel" style={{ height: '320px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-headline-md" style={{ color: 'var(--color-text-primary)', fontSize: '15px' }}>
                Defect Identification Trends ({user?.permittedArea.name})
              </h3>
              <div className="flex gap-1">
                {['7D', '30D', 'YTD'].map((label, i) => (
                  <button
                    key={label}
                    className="px-3 py-1 rounded text-label-mono transition-colors"
                    style={{
                      fontSize: '11px',
                      backgroundColor: i === 0 ? 'var(--color-surface-high)' : 'transparent',
                      color: i === 0 ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                      border: i === 0 ? '1px solid var(--color-border-strong)' : '1px solid transparent',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={analyticsData.defects_over_time} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradDefects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-info)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-info)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-low)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-low)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={{ stroke: 'var(--color-border)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-surface-high)', border: '1px solid var(--color-border-strong)', borderRadius: 4, fontSize: 12 }}
                  labelStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Area type="monotone" dataKey="defects" stroke="var(--color-info)" fill="url(#gradDefects)" strokeWidth={1.5} dot={{ r: 3, fill: 'var(--color-info)' }} />
                <Area type="monotone" dataKey="resolved" stroke="var(--color-low)" fill="url(#gradResolved)" strokeWidth={1.5} dot={{ r: 3, fill: 'var(--color-low)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="lg:col-span-4 panel" style={{ height: '320px' }}>
            <h3 className="text-headline-md mb-4" style={{ color: 'var(--color-text-primary)', fontSize: '15px' }}>
              Risk Distribution ({user?.permittedArea.division})
            </h3>
            <ResponsiveContainer width="100%" height="60%">
              <PieChart>
                <Pie
                  data={analyticsData.defects_by_severity}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                  stroke="none"
                >
                  {analyticsData.defects_by_severity.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-high)', border: '1px solid var(--color-border-strong)', borderRadius: 4, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-2">
              {analyticsData.defects_by_severity.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>{s.name}</span>
                  </div>
                  <span className="text-label-mono" style={{ color: 'var(--color-text-primary)', fontSize: '12px' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
