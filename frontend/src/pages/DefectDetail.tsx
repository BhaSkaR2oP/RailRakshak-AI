import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import { demoDefects, SEVERITY_COLORS, formatDate, formatTime } from '../data/mockData';

const TIMELINE = [
  { label: 'Detected', detail: 'AI system identified anomaly', done: true },
  { label: 'AI Verified', detail: 'Confidence threshold exceeded', done: true },
  { label: 'Engineer Reviewed', detail: 'Awaiting manual verification', done: false },
  { label: 'Maintenance Assigned', detail: 'Pending assignment', done: false },
  { label: 'Resolved', detail: 'Not yet resolved', done: false },
];

export default function DefectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const defect = demoDefects.find(d => d.id === id) || demoDefects[0];

  const statusIdx =
    defect.status === 'RESOLVED' ? 4 :
    defect.status === 'IN_PROGRESS' ? 3 :
    defect.status === 'ACKNOWLEDGED' ? 2 : 1;

  const timeline = TIMELINE.map((t, i) => ({
    ...t,
    done: i <= statusIdx,
    active: i === statusIdx,
  }));

  return (
    <>
      <TopBar title="Defect Detail" subtitle={defect.id} />
      <div className="max-w-[1200px] mx-auto flex flex-col gap-4">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-body-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Image + Info */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Image */}
            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
              <div
                className="relative flex items-center justify-center"
                style={{ minHeight: '380px', backgroundColor: 'var(--color-surface-base)' }}
              >
                <div className="text-center" style={{ color: 'var(--color-text-dim)' }}>
                  <Shield size={48} className="mx-auto mb-3" style={{ color: SEVERITY_COLORS[defect.severity] }} />
                  <p className="text-headline-md" style={{ color: 'var(--color-text-primary)' }}>{defect.defect_type}</p>
                  <p className="text-label-mono mt-2" style={{ color: 'var(--color-text-muted)', textTransform: 'none' }}>
                    Demo image placeholder
                  </p>
                </div>
                {/* SVG bbox overlay */}
                {defect.bbox && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 640 480" preserveAspectRatio="none">
                    <rect
                      x={defect.bbox[0]} y={defect.bbox[1]}
                      width={defect.bbox[2]} height={defect.bbox[3]}
                      fill="none" stroke={SEVERITY_COLORS[defect.severity]} strokeWidth={2.5}
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'CONFIDENCE', value: `${defect.confidence}%`, color: 'var(--color-text-primary)' },
                { label: 'RISK SCORE', value: `${defect.risk_score}/100`, color: SEVERITY_COLORS[defect.severity] },
                { label: 'SEVERITY', value: defect.severity, color: SEVERITY_COLORS[defect.severity] },
                { label: 'STATUS', value: defect.status.replace('_', ' '), color: 'var(--color-info)' },
              ].map(({ label, value, color }) => (
                <div key={label} className="panel" style={{ borderTop: `2px solid ${color}` }}>
                  <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>{label}</span>
                  <p className="text-kpi-value mt-1" style={{ color, fontSize: '22px' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="panel">
              <h3 className="text-label-mono mb-4" style={{ color: 'var(--color-text-muted)' }}>Defect Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-text-dim)' }} />
                  <div>
                    <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>GPS LOCATION</span>
                    <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      {defect.latitude.toFixed(4)}° N, {defect.longitude.toFixed(4)}° E
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-text-dim)' }} />
                  <div>
                    <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>TIMESTAMP</span>
                    <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      {formatDate(defect.timestamp)} · {formatTime(defect.timestamp)}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>SECTION</span>
                  <p className="text-body-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{defect.section}</p>
                </div>
                <div>
                  <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>INSPECTION ID</span>
                  <p className="text-body-sm mt-0.5" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>{defect.inspection_id}</p>
                </div>
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>RECOMMENDED ACTION</span>
                <p className="text-body-sm mt-1" style={{ color: 'var(--color-text-primary)' }}>{defect.recommended_action}</p>
              </div>
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="lg:col-span-4">
            <div className="panel">
              <h3 className="text-label-mono mb-6" style={{ color: 'var(--color-text-muted)' }}>Resolution Timeline</h3>
              <div className="flex flex-col gap-0">
                {timeline.map((step, i) => (
                  <div key={step.label} className="flex gap-4">
                    {/* Connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: step.done ? 'var(--color-low)' : step.active ? 'var(--color-info)' : 'var(--color-surface-high)',
                          border: step.active ? '2px solid var(--color-info)' : 'none',
                        }}
                      >
                        {step.done ? (
                          <CheckCircle size={14} color="white" />
                        ) : (
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: step.active ? 'var(--color-info)' : 'var(--color-text-dim)' }} />
                        )}
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="h-10 w-0.5" style={{ backgroundColor: step.done ? 'var(--color-low)' : 'var(--color-border)' }} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-6">
                      <p className="text-body-sm font-semibold" style={{ color: step.done || step.active ? 'var(--color-text-primary)' : 'var(--color-text-dim)' }}>
                        {step.label}
                      </p>
                      <p className="text-label-mono mt-0.5" style={{ color: 'var(--color-text-muted)', fontSize: '10px', textTransform: 'none' }}>
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="panel mt-3 flex flex-col gap-2">
              <button className="btn-primary w-full" onClick={() => navigate('/maintenance')}>
                Create Maintenance Task
              </button>
              <button className="btn-outline w-full" onClick={() => navigate('/map')}>
                View on Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
