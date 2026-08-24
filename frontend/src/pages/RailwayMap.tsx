import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Shield, Lock, Compass } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import { demoDefects, SEVERITY_COLORS, timeAgo } from '../data/mockData';
import type { Defect, Severity } from '../types';
import { useAuth } from '../context/AuthContext';

function markerIcon(severity: Severity) {
  const color = SEVERITY_COLORS[severity];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="12" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
    <circle cx="14" cy="14" r="6" fill="${color}"/>
  </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [28, 28], iconAnchor: [14, 14] });
}

export default function RailwayMap() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const { user } = useAuth();

  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [severityFilter, setSeverityFilter] = useState<Severity | ''>('');

  const isSuperAdmin = !user?.permittedSectionId || user.permittedSectionId === 'ALL';

  // Strict jurisdictional filtering
  const jurisdictionalDefects = isSuperAdmin
    ? demoDefects
    : demoDefects.filter((d) => d.section === user?.permittedArea.name);

  const filtered = jurisdictionalDefects.filter((d) => !severityFilter || d.severity === severityFilter);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMap.current) {
      leafletMap.current.remove();
      leafletMap.current = null;
    }

    const center = user?.permittedArea.center || [24.5, 78.5];
    const zoom = user?.permittedArea.zoom || 5;

    const map = L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Draw Permitted Boundary Polygon if restricted division
    if (!isSuperAdmin && user?.permittedArea.polygon) {
      const boundary = L.polygon(user.permittedArea.polygon as L.LatLngExpression[], {
        color: '#00d1ff',
        weight: 2.5,
        dashArray: '8, 6',
        fillColor: '#00d1ff',
        fillOpacity: 0.08,
      }).addTo(map);

      boundary.bindTooltip(
        `<div style="font-family:JetBrains Mono;font-size:11px;font-weight:bold;color:#00d1ff;background:#0a0c10;padding:4px 8px;border:1px solid #00d1ff;border-radius:2px;">
          JURISDICTION BOUNDARY: ${user.permittedArea.name.toUpperCase()}
        </div>`,
        { permanent: true, direction: 'top', className: 'custom-geo-label' }
      );
    }

    filtered.forEach((d) => {
      const marker = L.marker([d.latitude, d.longitude], { icon: markerIcon(d.severity) }).addTo(map);
      marker.on('click', () => setSelectedDefect(d));
    });

    leafletMap.current = map;
    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, [filtered, user, isSuperAdmin]);

  const resetView = () => {
    if (leafletMap.current && user?.permittedArea.center) {
      leafletMap.current.setView(user.permittedArea.center, user.permittedArea.zoom);
    }
  };

  return (
    <>
      <TopBar title="Geospatial Monitoring" subtitle={user?.permittedArea.name} />
      <div className="relative" style={{ height: 'calc(100vh - var(--topbar-height) - 48px)' }}>
        {/* Map Canvas */}
        <div ref={mapRef} className="absolute inset-0" />

        {/* Top Floating Bar: Jurisdiction & Filters */}
        <div className="absolute top-4 left-4 z-[500] flex flex-wrap gap-2 items-center">
          {/* Permitted Area Lock Indicator */}
          <div
            className="flex items-center gap-2 rounded px-3 py-1.5 shadow-md"
            style={{
              backgroundColor: 'rgba(13, 20, 29, 0.95)',
              border: '1px solid var(--color-info)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {isSuperAdmin ? (
              <Shield size={14} style={{ color: 'var(--color-low)' }} />
            ) : (
              <Lock size={14} style={{ color: 'var(--color-info)' }} />
            )}
            <span className="text-label-mono font-bold" style={{ color: 'var(--color-text-primary)', fontSize: '11px' }}>
              {isSuperAdmin ? 'ALL REGIONS (UNRESTRICTED)' : `PERMITTED: ${user?.permittedArea.name.toUpperCase()}`}
            </span>
          </div>

          {/* Recenter Button */}
          <button
            onClick={resetView}
            className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-label-mono transition-colors"
            style={{
              backgroundColor: 'rgba(13, 20, 29, 0.85)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              backdropFilter: 'blur(8px)',
              fontSize: '11px',
            }}
            title="Recenter Map to Permitted Jurisdiction"
          >
            <Compass size={13} />
            Recenter
          </button>

          {/* Severity Filters */}
          <div className="flex gap-1">
            {(['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as (Severity | '')[]).map((sev) => (
              <button
                key={sev || 'ALL'}
                onClick={() => setSeverityFilter(sev)}
                className="rounded px-2.5 py-1.5 text-label-mono transition-colors"
                style={{
                  fontSize: '11px',
                  backgroundColor:
                    severityFilter === sev
                      ? sev
                        ? SEVERITY_COLORS[sev] + '30'
                        : 'var(--color-surface-high)'
                      : 'rgba(13, 20, 29, 0.85)',
                  color: sev ? SEVERITY_COLORS[sev] : 'var(--color-text-primary)',
                  border: `1px solid ${
                    severityFilter === sev
                      ? sev
                        ? SEVERITY_COLORS[sev]
                        : 'var(--color-border-strong)'
                      : 'var(--color-border)'
                  }`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                {sev || 'ALL'}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Left Legend */}
        <div
          className="absolute bottom-4 left-4 z-[500] rounded p-3 flex flex-col gap-2"
          style={{
            backgroundColor: 'rgba(13, 20, 29, 0.92)',
            border: '1px solid var(--color-border)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-label-mono" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>
              SEVERITY KEY
            </span>
            <span className="text-label-mono" style={{ color: 'var(--color-info)', fontSize: '10px' }}>
              {filtered.length} VISIBLE
            </span>
          </div>
          {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as Severity[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[s] }} />
              <span className="text-body-sm" style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Side Panel for Selected Defect */}
        {selectedDefect && (
          <div
            className="absolute top-0 right-0 z-[500] h-full w-[380px] animate-slide-in flex flex-col"
            style={{ backgroundColor: 'var(--color-surface-low)', borderLeft: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h3 className="text-headline-md" style={{ color: 'var(--color-text-primary)', fontSize: '15px' }}>
                Defect Telemetry
              </h3>
              <button onClick={() => setSelectedDefect(null)} style={{ color: 'var(--color-text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-body-sm font-bold" style={{ color: 'var(--color-text-primary)', fontSize: '16px' }}>
                  {selectedDefect.defect_type}
                </h4>
                <span className={`badge badge-${selectedDefect.severity.toLowerCase()}`}>
                  {selectedDefect.severity}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="panel" style={{ borderTop: `2px solid ${SEVERITY_COLORS[selectedDefect.severity]}` }}>
                  <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
                    CONFIDENCE
                  </span>
                  <p className="text-kpi-value mt-1" style={{ fontSize: '22px' }}>
                    {selectedDefect.confidence}%
                  </p>
                </div>
                <div className="panel" style={{ borderTop: `2px solid ${SEVERITY_COLORS[selectedDefect.severity]}` }}>
                  <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
                    RISK SCORE
                  </span>
                  <p
                    className="text-kpi-value mt-1"
                    style={{ color: SEVERITY_COLORS[selectedDefect.severity], fontSize: '22px' }}
                  >
                    {selectedDefect.risk_score}/100
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  {
                    label: 'GPS LOCATION',
                    value: `${selectedDefect.latitude.toFixed(4)}° N, ${selectedDefect.longitude.toFixed(4)}° E`,
                  },
                  { label: 'SECTION', value: selectedDefect.section },
                  { label: 'STATUS', value: selectedDefect.status.replace('_', ' ') },
                  { label: 'TIMESTAMP', value: timeAgo(selectedDefect.timestamp) },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
                      {label}
                    </span>
                    <span
                      className="text-body-sm"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
                {selectedDefect.recommended_action}
              </p>
            </div>
            <div className="p-4 flex gap-2" style={{ borderTop: '1px solid var(--color-border)' }}>
              <button
                className="btn-primary flex-1 text-xs"
                onClick={() => navigate(`/defects/${selectedDefect.id}`)}
              >
                View Incident File
              </button>
              <button className="btn-outline flex-1 text-xs" onClick={() => navigate('/maintenance')}>
                Dispatch Task
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
