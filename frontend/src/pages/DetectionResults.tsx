import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Wrench, Train, Compass } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import type { Severity, Detection } from '../types';
import { SEVERITY_COLORS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const DEMO_DETECTIONS: Detection[] = [
  {
    id: 'DET-001',
    defect_type: 'Rail Fracture',
    confidence: 96.4,
    risk_score: 94,
    severity: 'CRITICAL',
    bbox: [205, 330, 85, 65],
    recommended_action: 'Immediate field inspection required. Halt corridor traffic until crack weld is completed.',
  },
  {
    id: 'DET-002',
    defect_type: 'Missing Fastener',
    confidence: 91.2,
    risk_score: 78,
    severity: 'HIGH',
    bbox: [525, 225, 50, 40],
    recommended_action: 'Schedule fastener replacement within 24 hours.',
  },
  {
    id: 'DET-003',
    defect_type: 'Surface Crack',
    confidence: 84.6,
    risk_score: 62,
    severity: 'MEDIUM',
    bbox: [320, 260, 95, 45],
    recommended_action: 'Monitor crack progression. Schedule grinding within 72 hours.',
  },
];

function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`badge badge-${severity.toLowerCase()}`}>{severity}</span>;
}

export default function DetectionResults() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<Detection>(DEMO_DETECTIONS[0]);
  const fileName = sessionStorage.getItem('inspectionFileName') || 'TRV_09_EDGE_FEED_KM142.85.mp4';

  return (
    <>
      <TopBar title="AI Defect Telemetry" subtitle={fileName} />
      <div className="max-w-[1500px] mx-auto flex flex-col gap-4">
        {/* Telemetry Status Bar */}
        <div
          className="panel flex flex-wrap items-center justify-between gap-3"
          style={{ borderTop: '2px solid var(--color-info)', paddingBlock: '12px' }}
        >
          <div className="flex items-center gap-3">
            <span className="badge badge-demo">EDGE AI INFERENCE COMPLETE</span>
            <span className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Track Recording Vehicle <strong className="text-white">TRV-09</strong> processed 60 video frames via{' '}
              <strong className="text-white">OpenCV + YOLOv8</strong>. 3 anomalies classified.
            </span>
          </div>
          <div className="flex items-center gap-2 text-label-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <Train size={14} style={{ color: 'var(--color-info)' }} />
            <span>KM 142.85 · {user?.permittedArea.name || 'Delhi Section'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Annotated Track Feed with Bounding Box overlays */}
          <div className="lg:col-span-8 panel flex flex-col justify-between" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#05070a' }}>
            <div className="relative w-full aspect-video flex items-center justify-center select-none overflow-hidden">
              {/* High-Contrast Vector Track Simulation Canvas */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="railGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                  <linearGradient id="groundGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#080d14" />
                    <stop offset="100%" stopColor="#111822" />
                  </linearGradient>
                </defs>

                {/* Ground */}
                <rect width="800" height="450" fill="url(#groundGrad2)" />

                {/* Sleepers / Ties */}
                {[60, 100, 150, 210, 280, 360, 440].map((y, i) => (
                  <polygon
                    key={y}
                    points={`
                      ${300 - i * 35},${y} 
                      ${500 + i * 35},${y} 
                      ${510 + i * 35},${y + 12 + i * 2} 
                      ${290 - i * 35},${y + 12 + i * 2}
                    `}
                    fill="#232b38"
                    stroke="#1a222e"
                    strokeWidth="1"
                  />
                ))}

                {/* Left Rail Track */}
                <polygon points="340,40 350,40 220,450 180,450" fill="url(#railGrad2)" stroke="#64748b" strokeWidth="2" />
                <line x1="345" y1="40" x2="200" y2="450" stroke="#94a3b8" strokeWidth="3" opacity="0.9" />

                {/* Right Rail Track */}
                <polygon points="460,40 450,40 580,450 620,450" fill="url(#railGrad2)" stroke="#64748b" strokeWidth="2" />
                <line x1="455" y1="40" x2="600" y2="450" stroke="#94a3b8" strokeWidth="3" opacity="0.9" />

                {/* Dynamic Bounding Boxes */}
                {DEMO_DETECTIONS.map((d) => {
                  const isCurSelected = d.id === selected.id;
                  const color = SEVERITY_COLORS[d.severity];
                  return (
                    <g key={d.id} className="cursor-pointer" onClick={() => setSelected(d)}>
                      <rect
                        x={d.bbox[0]}
                        y={d.bbox[1]}
                        width={d.bbox[2]}
                        height={d.bbox[3]}
                        fill={isCurSelected ? `${color}20` : 'none'}
                        stroke={color}
                        strokeWidth={isCurSelected ? 3 : 1.8}
                        strokeDasharray={isCurSelected ? '0' : '5 3'}
                      />
                      <rect
                        x={d.bbox[0]}
                        y={d.bbox[1] - 22}
                        width={d.defect_type.length * 7.5 + 54}
                        height={20}
                        fill={color}
                        rx={2}
                      />
                      <text
                        x={d.bbox[0] + 5}
                        y={d.bbox[1] - 7}
                        fill={d.severity === 'HIGH' ? '#000000' : '#ffffff'}
                        fontSize="11"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight="700"
                      >
                        {d.defect_type.toUpperCase()} {d.confidence}%
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* HUD Sensor Watermark */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 font-mono text-xs">
                <div className="bg-black/85 backdrop-blur px-2.5 py-1 rounded border border-white/10 text-white">
                  FRAME CAPTURE: TRV-09 OPTICAL SENSOR 01
                </div>
              </div>
            </div>

            {/* Bottom bar of image */}
            <div className="px-4 py-3 border-t flex items-center justify-between text-label-mono text-xs" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-container)' }}>
              <div className="flex items-center gap-2">
                <Compass size={14} style={{ color: 'var(--color-info)' }} />
                <span>COORDINATES: 28.6139° N, 77.2090° E (NORTHERN RAILWAY CORRIDOR)</span>
              </div>
              <span className="text-[var(--color-text-dim)]">CLICK ANY BOUNDING BOX TO INSPECT</span>
            </div>
          </div>

          {/* Right: Selected Anomaly Diagnostics & Maintenance Trigger */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Detected List */}
            <div className="panel">
              <h3 className="text-label-mono mb-3" style={{ color: 'var(--color-text-muted)' }}>
                Identified Track Anomalies ({DEMO_DETECTIONS.length})
              </h3>
              <div className="flex flex-col gap-2">
                {DEMO_DETECTIONS.map((d, i) => {
                  const isCurSelected = d.id === selected.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setSelected(d)}
                      className="flex items-center gap-3 rounded p-2.5 transition-all text-left w-full cursor-pointer"
                      style={{
                        backgroundColor: isCurSelected ? 'rgba(76, 214, 255, 0.08)' : 'var(--color-surface-container)',
                        border: isCurSelected ? '1px solid var(--color-info)' : '1px solid transparent',
                      }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-xs font-bold font-mono"
                        style={{
                          backgroundColor: `${SEVERITY_COLORS[d.severity]}25`,
                          color: SEVERITY_COLORS[d.severity],
                        }}
                      >
                        #{i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-body-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                            {d.defect_type}
                          </span>
                          <SeverityBadge severity={d.severity} />
                        </div>
                        <span className="text-label-mono mt-0.5 block" style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'none' }}>
                          Confidence: {d.confidence}% · Risk: {d.risk_score}/100
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Selected Defect Telemetry */}
            <div
              className="panel animate-fade-in flex-1 flex flex-col justify-between"
              key={selected.id}
              style={{ borderTop: `3px solid ${SEVERITY_COLORS[selected.severity]}` }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-headline-md font-bold" style={{ color: 'var(--color-text-primary)', fontSize: '16px' }}>
                    {selected.defect_type}
                  </h3>
                  <SeverityBadge severity={selected.severity} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="panel" style={{ padding: '10px' }}>
                    <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
                      AI CONFIDENCE
                    </span>
                    <p className="text-kpi-value mt-1 font-mono" style={{ color: 'var(--color-text-primary)', fontSize: '24px' }}>
                      {selected.confidence}%
                    </p>
                  </div>
                  <div className="panel" style={{ padding: '10px' }}>
                    <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
                      RISK SCORE
                    </span>
                    <p className="text-kpi-value mt-1 font-mono" style={{ color: SEVERITY_COLORS[selected.severity], fontSize: '24px' }}>
                      {selected.risk_score}/100
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mb-4 text-xs font-mono" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-dim)]">GPS CHAINAGE:</span>
                    <span className="text-white">KM 142.85 (28.61° N, 77.20° E)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-dim)]">CORRIDOR:</span>
                    <span className="text-[var(--color-info)]">{user?.permittedArea.name || 'Delhi Section'}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[var(--color-text-dim)]">RECOMMENDED PROTOCOL:</span>
                    <p className="text-body-sm font-sans text-[var(--color-text-secondary)] leading-relaxed">
                      {selected.recommended_action}
                    </p>
                  </div>
                </div>
              </div>

              {/* Maintenance Work Order Dispatch Button */}
              <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button
                  className="btn-critical flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2.5 cursor-pointer shadow"
                  onClick={() => navigate('/maintenance')}
                >
                  <Wrench size={14} />
                  DISPATCH WORK ORDER
                </button>
                <button className="btn-outline flex items-center justify-center gap-2 text-xs px-3 cursor-pointer">
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
