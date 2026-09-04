import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import { demoDefects, SEVERITY_COLORS, timeAgo } from '../data/mockData';
import type { Severity, DefectStatus } from '../types';

export default function Defects() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | ''>('');
  const [statusFilter, setStatusFilter] = useState<DefectStatus | ''>('');

  const filtered = demoDefects.filter(d => {
    if (search && !d.defect_type.toLowerCase().includes(search.toLowerCase()) && !d.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (severityFilter && d.severity !== severityFilter) return false;
    if (statusFilter && d.status !== statusFilter) return false;
    return true;
  });

  return (
    <>
      <TopBar title="Defect Explorer" />
      <div className="max-w-[1400px] mx-auto flex flex-col gap-4">
        {/* Filters */}
        <div className="panel flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-dim)' }} />
            <input
              type="text"
              placeholder="Search defects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded py-2 pl-9 pr-3 text-body-sm"
              style={{
                backgroundColor: 'var(--color-surface-base)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                outline: 'none',
              }}
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as Severity | '')}
            className="rounded py-2 px-3 text-body-sm"
            style={{ backgroundColor: 'var(--color-surface-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DefectStatus | '')}
            className="rounded py-2 px-3 text-body-sm"
            style={{ backgroundColor: 'var(--color-surface-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '11px' }}>
            {filtered.length} results
          </span>
        </div>

        {/* Table */}
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['ID', 'DEFECT TYPE', 'CONFIDENCE', 'RISK', 'SEVERITY', 'SECTION', 'STATUS', 'TIME', ''].map(h => (
                    <th key={h} className="text-label-mono text-left px-4 py-3" style={{ color: 'var(--color-text-dim)', fontSize: '10px', backgroundColor: 'var(--color-surface-container)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr
                    key={d.id}
                    onClick={() => navigate(`/defects/${d.id}`)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: i % 2 === 0 ? 'var(--color-surface-low)' : 'var(--color-surface-container)',
                    }}
                  >
                    <td className="px-4 py-3 text-table-data" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                      {d.id}
                    </td>
                    <td className="px-4 py-3 text-body-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {d.defect_type}
                    </td>
                    <td className="px-4 py-3 text-table-data" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                      {d.confidence}%
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-high)' }}>
                          <div className="h-full rounded-full" style={{ width: `${d.risk_score}%`, backgroundColor: SEVERITY_COLORS[d.severity] }} />
                        </div>
                        <span className="text-table-data" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>{d.risk_score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge badge-${d.severity.toLowerCase()}`}>{d.severity}</span>
                    </td>
                    <td className="px-4 py-3 text-table-data" style={{ color: 'var(--color-text-muted)' }}>
                      {d.section}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-label-mono" style={{
                        color: d.status === 'RESOLVED' ? 'var(--color-low)' : d.status === 'OPEN' ? 'var(--color-high)' : 'var(--color-info)',
                        fontSize: '10px',
                      }}>
                        {d.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-table-data" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)', fontSize: '11px' }}>
                      {timeAgo(d.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight size={14} style={{ color: 'var(--color-text-dim)' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
