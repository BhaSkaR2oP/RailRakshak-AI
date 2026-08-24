import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { TrendingDown, TrendingUp, AlertTriangle, Timer } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import { analyticsData, SEVERITY_COLORS } from '../data/mockData';

const CHART_COLORS = ['#4cd6ff', '#34c759', '#ffcc00', '#ff9500', '#ff3b30', '#c6c6cc'];

export default function Analytics() {
  return (
    <>
      <TopBar title="Analytics" subtitle="Northern Region" />
      <div className="max-w-[1600px] mx-auto flex flex-col gap-3">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* MTTR */}
          <div className="panel" style={{ borderTop: '2px solid var(--color-accent)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-mono" style={{ color: 'var(--color-text-muted)' }}>Mean Time to Resolve</span>
              <Timer size={18} style={{ color: 'var(--color-outline)' }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-display-metrics" style={{ fontSize: '42px' }}>{analyticsData.mttr_hours}</span>
              <span className="text-body-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Hours</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-label-mono" style={{ color: 'var(--color-info)', fontSize: '11px' }}>
              <TrendingDown size={14} />
              <span>-12% vs last week</span>
            </div>
          </div>

          {/* SLA */}
          <div className="panel" style={{ borderTop: '2px solid var(--color-accent)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-mono" style={{ color: 'var(--color-text-muted)' }}>SLA Compliance Rate</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-display-metrics" style={{ fontSize: '42px' }}>{analyticsData.sla_compliance}</span>
              <span className="text-body-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>%</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-label-mono" style={{ color: 'var(--color-info)', fontSize: '11px' }}>
              <TrendingUp size={14} />
              <span>+2.1% vs last week</span>
            </div>
          </div>

          {/* Critical Backlog */}
          <div className="panel relative overflow-hidden" style={{ borderTop: '2px solid var(--color-critical)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(255, 59, 48, 0.04)' }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-label-mono" style={{ color: 'var(--color-critical)' }}>Critical Backlog</span>
                <AlertTriangle size={18} style={{ color: 'var(--color-critical)' }} />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-display-metrics" style={{ fontSize: '42px', color: 'var(--color-critical)' }}>
                  {analyticsData.critical_backlog}
                </span>
                <span className="text-body-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Work Orders</span>
              </div>
              <div className="mt-3 text-label-mono" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                Requires immediate dispatch
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Defect Trends */}
          <div className="lg:col-span-8 panel" style={{ height: '380px' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-headline-md" style={{ color: 'var(--color-text-primary)', fontSize: '15px' }}>
                Defect Identification Trends
              </h3>
              <div className="flex gap-1">
                {['7D', '30D', 'YTD'].map((label, i) => (
                  <button key={label} className="px-3 py-1 rounded text-label-mono" style={{
                    fontSize: '11px',
                    backgroundColor: i === 0 ? 'var(--color-surface-high)' : 'transparent',
                    color: i === 0 ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    border: i === 0 ? '1px solid var(--color-border-strong)' : '1px solid transparent',
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={analyticsData.defects_over_time} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradD" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-info)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-info)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-low)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-low)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={{ stroke: 'var(--color-border)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-high)', border: '1px solid var(--color-border-strong)', borderRadius: 4, fontSize: 12 }} />
                <Area type="monotone" dataKey="defects" stroke="var(--color-info)" fill="url(#gradD)" strokeWidth={1.5} dot={{ r: 3, fill: 'var(--color-info)' }} name="Detected" />
                <Area type="monotone" dataKey="resolved" stroke="var(--color-low)" fill="url(#gradR)" strokeWidth={1.5} dot={{ r: 3, fill: 'var(--color-low)' }} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Defect by Type */}
          <div className="lg:col-span-4 panel" style={{ height: '380px' }}>
            <h3 className="text-headline-md mb-4" style={{ color: 'var(--color-text-primary)', fontSize: '15px' }}>
              Defects by Type
            </h3>
            <div className="flex-1 flex flex-col gap-3 justify-center">
              {analyticsData.defects_by_type.map((item, i) => (
                <div key={item.name} className="flex flex-col gap-1">
                  <div className="flex justify-between text-label-mono" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                    <span style={{ textTransform: 'none' }}>{item.name}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-high)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(item.value / 40) * 100}%`, backgroundColor: CHART_COLORS[i] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Severity Distribution */}
          <div className="lg:col-span-4 panel" style={{ height: '320px' }}>
            <h3 className="text-headline-md mb-4" style={{ color: 'var(--color-text-primary)', fontSize: '15px' }}>
              Severity Distribution
            </h3>
            <ResponsiveContainer width="100%" height="55%">
              <PieChart>
                <Pie data={analyticsData.defects_by_severity} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">
                  {analyticsData.defects_by_severity.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-high)', border: '1px solid var(--color-border-strong)', borderRadius: 4, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-2">
              {analyticsData.defects_by_severity.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>{s.name}</span>
                  </div>
                  <span className="text-label-mono" style={{ fontSize: '12px' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section Risk */}
          <div className="lg:col-span-8 panel" style={{ height: '320px' }}>
            <h3 className="text-headline-md mb-4" style={{ color: 'var(--color-text-primary)', fontSize: '15px' }}>
              Railway Section Risk Assessment
            </h3>
            <div className="flex flex-col gap-3">
              {analyticsData.section_risk.map(sr => (
                <div key={sr.section} className="rounded p-3 flex items-center justify-between" style={{ backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-1 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[sr.risk] }} />
                    <div>
                      <p className="text-body-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{sr.section}</p>
                      <p className="text-label-mono mt-0.5" style={{ color: 'var(--color-text-muted)', fontSize: '10px', textTransform: 'none' }}>
                        {sr.defects} active defects
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>RISK SCORE</span>
                      <p className="text-kpi-value" style={{ color: SEVERITY_COLORS[sr.risk], fontSize: '20px' }}>{sr.score}</p>
                    </div>
                    <span className={`badge badge-${sr.risk.toLowerCase()}`}>{sr.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
