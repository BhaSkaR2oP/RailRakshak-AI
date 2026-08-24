import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { demoDefects, SEVERITY_COLORS, timeAgo } from '../../data/mockData';
import type { Severity } from '../../types';
import { useAuth } from '../../context/AuthContext';

function markerIcon(severity: Severity) {
  const color = SEVERITY_COLORS[severity];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
    <circle cx="12" cy="12" r="5" fill="${color}"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter defects based on operator's permitted jurisdiction
  const permittedSection = user?.permittedSectionId;
  const isSuperAdmin = !permittedSection || permittedSection === 'ALL';
  
  const visibleDefects = isSuperAdmin
    ? demoDefects
    : demoDefects.filter(d => d.section === user?.permittedArea.name);

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

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Draw Geo-fence boundary for permitted area if division officer
    if (!isSuperAdmin && user?.permittedArea.polygon) {
      const polygon = L.polygon(user.permittedArea.polygon as L.LatLngExpression[], {
        color: '#00d1ff',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#00d1ff',
        fillOpacity: 0.08,
      }).addTo(map);

      polygon.bindTooltip(`Permitted Jurisdiction: ${user.permittedArea.name}`, {
        permanent: false,
        direction: 'center',
        className: 'geo-tooltip',
      });
    }

    // Add permitted defect markers
    visibleDefects.forEach((d) => {
      const marker = L.marker([d.latitude, d.longitude], {
        icon: markerIcon(d.severity),
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;font-size:13px;min-width:180px;color:#dce3f0;background:#192029;border:1px solid #2a2f3a;border-radius:4px;padding:12px;margin:-14px -20px;">
          <div style="font-weight:600;margin-bottom:4px;">${d.defect_type}</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#9ca3af;margin-bottom:8px;">${d.section}</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="color:#9ca3af;font-size:12px;">Confidence</span>
            <span style="color:${SEVERITY_COLORS[d.severity]};font-weight:600;font-size:12px;">${d.confidence}%</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="color:#9ca3af;font-size:12px;">Risk Score</span>
            <span style="font-weight:600;font-size:12px;">${d.risk_score}/100</span>
          </div>
          <div style="font-size:10px;color:#6b7280;">${timeAgo(d.timestamp)}</div>
        </div>`,
        { className: 'custom-popup', closeButton: false }
      );

      marker.on('click', () => {
        navigate(`/defects/${d.id}`);
      });
    });

    leafletMap.current = map;

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, [navigate, user, isSuperAdmin, visibleDefects]);

  return (
    <div className="relative h-full w-full" style={{ minHeight: '400px' }}>
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Geofence / Permitted Jurisdiction HUD Overlay */}
      <div
        className="absolute top-3 left-3 z-[400] rounded px-3 py-1.5 flex items-center gap-2"
        style={{
          backgroundColor: 'rgba(13, 20, 29, 0.92)',
          border: '1px solid var(--color-border)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: isSuperAdmin ? 'var(--color-low)' : 'var(--color-info)' }}
        />
        <span className="text-label-mono" style={{ color: 'var(--color-text-primary)', fontSize: '10px' }}>
          {isSuperAdmin
            ? 'ALL JURISDICTIONS (HQ UNRESTRICTED)'
            : `PERMITTED AREA: ${user?.permittedArea.name.toUpperCase()}`}
        </span>
        <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>
          ({visibleDefects.length} active defects)
        </span>
      </div>
    </div>
  );
}
