import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Train,
  Radio,
  Eye,
  Play,
  Pause,
  RefreshCw,
  MapPin,
  Camera,
  Activity,
  Layers,
  Flame,
} from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import { useAuth } from '../context/AuthContext';
import { SEVERITY_COLORS } from '../data/mockData';

export default function AIInspection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isStreaming, setIsStreaming] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'RAW' | 'OPENCV_EDGE' | 'YOLO_BOXES'>('YOLO_BOXES');
  const [chainageKm, setChainageKm] = useState(142.85);
  const [frameNumber, setFrameNumber] = useState(14892);

  // Live telemetry ticker simulation
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setFrameNumber((f) => f + 1);
      setChainageKm((c) => +(c + 0.02).toFixed(2));
    }, 250);
    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleInspectNow = () => {
    sessionStorage.setItem('inspectionFileName', `TRV_LIVE_STREAM_KM_${chainageKm.toFixed(2)}.mp4`);
    sessionStorage.setItem('inspectionFileType', 'video/mp4');
    navigate('/inspect/processing');
  };

  return (
    <>
      <TopBar title="Live Train AI Inspection" subtitle="Onboard Edge Telemetry Stream" />
      <div className="max-w-[1600px] mx-auto flex flex-col gap-4">
        {/* Onboard Train Vehicle Status Banner */}
        <div
          className="panel flex flex-wrap items-center justify-between gap-4"
          style={{
            borderLeft: '4px solid var(--color-info)',
            backgroundColor: 'var(--color-surface-container)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--color-info)', color: '#000000' }}
            >
              <Train size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  TRV-09 "VANDE RAKSHAK"
                </span>
                <span className="text-label-mono px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(52, 199, 89, 0.15)', color: 'var(--color-low)' }}>
                  ● LIVE FEED ACTIVE
                </span>
              </div>
              <p className="text-label-mono mt-0.5" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                Corridor: {user?.permittedArea.name || 'Northern Mainline'} · Edge Device: NVIDIA Jetson AGX Orin
              </p>
            </div>
          </div>

          {/* Real-Time Live Telemetry Chips */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor: 'var(--color-surface-base)', border: '1px solid var(--color-border)' }}>
              <Camera size={16} style={{ color: 'var(--color-info)' }} />
              <div>
                <span className="text-label-mono block" style={{ color: 'var(--color-text-dim)', fontSize: '9px' }}>OPTICAL SENSOR</span>
                <span className="text-body-sm font-bold font-mono" style={{ color: 'var(--color-text-primary)' }}>
                  4K HDR (60 FPS)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor: 'var(--color-surface-base)', border: '1px solid var(--color-border)' }}>
              <MapPin size={16} style={{ color: 'var(--color-high)' }} />
              <div>
                <span className="text-label-mono block" style={{ color: 'var(--color-text-dim)', fontSize: '9px' }}>TRACK CHAINAGE</span>
                <span className="text-body-sm font-bold font-mono" style={{ color: 'var(--color-text-primary)' }}>
                  KM {chainageKm}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor: 'var(--color-surface-base)', border: '1px solid var(--color-border)' }}>
              <Activity size={16} style={{ color: 'var(--color-low)' }} />
              <div>
                <span className="text-label-mono block" style={{ color: 'var(--color-text-dim)', fontSize: '9px' }}>INFERENCE ENGINE</span>
                <span className="text-body-sm font-bold font-mono" style={{ color: 'var(--color-low)' }}>
                  YOLOv8 ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Inspection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Live Train Camera Stream Window */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="panel relative overflow-hidden" style={{ padding: 0, backgroundColor: '#05070a' }}>
              {/* Simulated Camera Feed Container */}
              <div className="relative w-full aspect-video flex items-center justify-center select-none overflow-hidden">
                {/* SVG Visual Railway Track Simulation */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="railGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                    <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0b1118" />
                      <stop offset="100%" stopColor="#151d28" />
                    </linearGradient>
                  </defs>

                  {/* Ground & Ballast */}
                  <rect width="800" height="450" fill="url(#groundGrad)" />

                  {/* Sleepers (Ties) in Perspective */}
                  {[60, 100, 150, 210, 280, 360, 440].map((y, i) => (
                    <polygon
                      key={y}
                      points={`
                        ${300 - i * 35},${y} 
                        ${500 + i * 35},${y} 
                        ${510 + i * 35},${y + 12 + i * 2} 
                        ${290 - i * 35},${y + 12 + i * 2}
                      `}
                      fill="#262f3d"
                      stroke="#1e2633"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Left Rail Track */}
                  <polygon points="340,40 350,40 220,450 180,450" fill="url(#railGrad)" stroke="#64748b" strokeWidth="2" />
                  <line x1="345" y1="40" x2="200" y2="450" stroke="#94a3b8" strokeWidth="3" opacity="0.9" />

                  {/* Right Rail Track */}
                  <polygon points="460,40 450,40 580,450 620,450" fill="url(#railGrad)" stroke="#64748b" strokeWidth="2" />
                  <line x1="455" y1="40" x2="600" y2="450" stroke="#94a3b8" strokeWidth="3" opacity="0.9" />

                  {/* OpenCV Edge Filter Visual Overlay */}
                  {activeFilter === 'OPENCV_EDGE' && (
                    <g opacity="0.85">
                      <rect width="800" height="450" fill="#000000" opacity="0.6" />
                      <line x1="345" y1="40" x2="200" y2="450" stroke="#00d1ff" strokeWidth="2" strokeDasharray="4 2" />
                      <line x1="455" y1="40" x2="600" y2="450" stroke="#00d1ff" strokeWidth="2" strokeDasharray="4 2" />
                      {/* Detected crack contours in edge view */}
                      <path d="M 230,340 L 235,348 L 232,356 L 240,365" stroke="#ff3b30" strokeWidth="3" fill="none" />
                    </g>
                  )}

                  {/* Real-Time YOLO AI Bounding Box Overlay */}
                  {(activeFilter === 'YOLO_BOXES' || activeFilter === 'RAW') && (
                    <g className="animate-pulse">
                      {/* Defect 1: Rail Fracture on Left Rail */}
                      <rect
                        x="205"
                        y="330"
                        width="85"
                        height="65"
                        fill="none"
                        stroke="#ff3b30"
                        strokeWidth="2.5"
                      />
                      <rect x="205" y="306" width="160" height="22" fill="#ff3b30" rx="2" />
                      <text x="210" y="321" fill="#ffffff" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                        RAIL FRACTURE 96.4%
                      </text>

                      {/* Defect 2: Missing Fastener on Right Rail */}
                      <rect
                        x="525"
                        y="225"
                        width="50"
                        height="40"
                        fill="none"
                        stroke="#ff9500"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                      <rect x="525" y="205" width="160" height="18" fill="#ff9500" rx="2" />
                      <text x="530" y="218" fill="#000000" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                        MISSING FASTENER 91.2%
                      </text>
                    </g>
                  )}
                </svg>

                {/* HUD Camera Overlay Information */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 font-mono text-xs">
                  <div className="flex items-center gap-2 bg-black/80 backdrop-blur px-2.5 py-1 rounded border border-white/10 text-white">
                    <Radio size={12} className="text-red-500 animate-ping" />
                    <span className="text-red-400 font-bold">CAM-01 [FRONT OPTICAL 4K]</span>
                    <span className="text-white/40">|</span>
                    <span>REC: 24/08/2026</span>
                  </div>
                  <div className="bg-black/80 backdrop-blur px-2.5 py-0.5 rounded border border-white/10 text-[var(--color-info)] text-[11px]">
                    FRM #{frameNumber} · 3840x2160 @ 60fps · OpenCV: ACTIVE
                  </div>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <span className="badge badge-critical animate-bounce">
                    ⚠ 2 DEFECTS IN SIGHT
                  </span>
                </div>

                {/* Bottom Stream Telemetry Bar */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between bg-black/85 backdrop-blur px-3 py-2 rounded border border-white/10">
                  <div className="flex items-center gap-4 text-xs font-mono text-white/90">
                    <span className="text-white/60">GPS:</span>
                    <span className="text-[var(--color-info)]">
                      {user?.permittedArea.center[0] || '28.6139'}° N, {user?.permittedArea.center[1] || '77.2090'}° E
                    </span>
                    <span className="text-white/40">|</span>
                    <span className="text-white/60">SECTOR:</span>
                    <span className="text-[var(--color-high)]">{user?.permittedArea.name || 'Delhi Section'}</span>
                  </div>
                  <div className="text-xs font-mono text-[var(--color-low)] flex items-center gap-1.5">
                    <Flame size={13} />
                    YOLOv8 INFERENCE: 14.2 ms
                  </div>
                </div>
              </div>
            </div>

            {/* Stream View Filters & Mode Selection */}
            <div className="panel flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
                  VIEW LAYER:
                </span>
                {[
                  { id: 'YOLO_BOXES', label: 'AI Detections (YOLOv8)', icon: Eye },
                  { id: 'OPENCV_EDGE', label: 'OpenCV Edge Processing', icon: Layers },
                  { id: 'RAW', label: 'Raw Camera Optical', icon: Camera },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-label-mono transition-all cursor-pointer"
                      style={{
                        fontSize: '11px',
                        backgroundColor: isActive ? 'var(--color-info)' : 'var(--color-surface-container)',
                        color: isActive ? '#000000' : 'var(--color-text-muted)',
                        fontWeight: isActive ? 700 : 500,
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <Icon size={13} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Play / Pause Stream */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStreaming(!isStreaming)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-label-mono transition-colors cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-surface-container)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    fontSize: '11px',
                  }}
                >
                  {isStreaming ? <Pause size={13} /> : <Play size={13} />}
                  {isStreaming ? 'Pause Stream' : 'Resume Stream'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live Defect Queue & Inspection Action */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Primary Action Card: Ingest & Deep Analyze Live Feed */}
            <div className="panel flex flex-col gap-3" style={{ borderTop: '3px solid var(--color-critical)' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-headline-md font-bold" style={{ color: 'var(--color-text-primary)', fontSize: '15px' }}>
                  Live Anomaly Alert
                </h3>
                <span className="badge badge-critical animate-pulse">IMMEDIATE ATTN</span>
              </div>
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                Onboard YOLO model identified high-risk physical track fracture on{' '}
                <strong className="text-white">{user?.permittedArea.name}</strong> at chainage <strong>KM {chainageKm}</strong>.
              </p>

              <div
                className="rounded p-3 flex flex-col gap-2"
                style={{ backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
                    CLASSIFICATION
                  </span>
                  <span className="text-body-sm font-bold" style={{ color: 'var(--color-critical)' }}>
                    Rail Fracture (Transverse)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
                    AI CONFIDENCE
                  </span>
                  <span className="text-body-sm font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    96.4%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
                    CALCULATED RISK SCORE
                  </span>
                  <span className="text-body-sm font-mono font-bold" style={{ color: 'var(--color-critical)' }}>
                    94 / 100 (CRITICAL)
                  </span>
                </div>
              </div>

              {/* Trigger Full Diagnostics */}
              <button
                onClick={handleInspectNow}
                className="btn-critical w-full py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-95"
              >
                <RefreshCw size={16} />
                DEEP ANALYZE & DISPATCH WORK ORDER
              </button>
            </div>

            {/* Recent Live Anomalies Intercepted by Train */}
            <div className="panel flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-label-mono" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                  Live Anomaly Telemetry Queue
                </h3>
                <span className="text-label-mono" style={{ color: 'var(--color-info)', fontSize: '10px' }}>
                  AUTO-RECORDING
                </span>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto max-h-[260px]">
                {[
                  { type: 'Rail Fracture', km: 'KM 142.85', conf: '96.4%', sev: 'CRITICAL', time: 'Just now' },
                  { type: 'Missing Fastener', km: 'KM 141.20', conf: '91.2%', sev: 'HIGH', time: '2 min ago' },
                  { type: 'Surface Crack', km: 'KM 139.75', conf: '84.6%', sev: 'MEDIUM', time: '5 min ago' },
                  { type: 'Sleeper Damage', km: 'KM 138.10', conf: '88.1%', sev: 'MEDIUM', time: '8 min ago' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded flex items-center justify-between cursor-pointer hover:bg-[var(--color-surface-high)] transition-colors"
                    style={{ backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-border)' }}
                    onClick={handleInspectNow}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-7 w-1 rounded-full shrink-0"
                        style={{ backgroundColor: SEVERITY_COLORS[item.sev as keyof typeof SEVERITY_COLORS] }}
                      />
                      <div>
                        <p className="text-body-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                          {item.type}
                        </p>
                        <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
                          {item.km} · Conf: {item.conf}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge badge-${item.sev.toLowerCase()}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                        {item.sev}
                      </span>
                      <p className="text-label-mono mt-0.5" style={{ color: 'var(--color-text-dim)', fontSize: '9px' }}>
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
