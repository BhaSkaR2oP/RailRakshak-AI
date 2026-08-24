import TopBar from '../components/layout/TopBar';
import { Cpu, Database, Sliders } from 'lucide-react';

export default function Settings() {
  return (
    <>
      <TopBar title="System Settings" subtitle="Configuration & Thresholds" />
      <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
        {/* AI Model Config */}
        <div className="panel flex flex-col gap-4" style={{ borderTop: '2px solid var(--color-info)' }}>
          <div className="flex items-center gap-3">
            <Cpu size={20} style={{ color: 'var(--color-info)' }} />
            <h3 className="text-headline-md" style={{ color: 'var(--color-text-primary)', fontSize: '16px' }}>
              AI Detection Pipeline
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-label-mono mb-2 block" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>
                ACTIVE MODEL
              </label>
              <input
                type="text"
                disabled
                value="YOLOv8n (RailRakshak AI Optimized)"
                className="w-full rounded py-2 px-3 text-body-sm opacity-80"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
            <div>
              <label className="text-label-mono mb-2 block" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>
                DETECTION MODE
              </label>
              <select
                defaultValue="DEMO"
                className="w-full rounded py-2 px-3 text-body-sm"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <option value="DEMO">Demo Mode (Simulated AI Defect Ingestion)</option>
                <option value="LIVE">Live Inference (Ultralytics YOLO)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Threshold Settings */}
        <div className="panel flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Sliders size={20} style={{ color: 'var(--color-high)' }} />
            <h3 className="text-headline-md" style={{ color: 'var(--color-text-primary)', fontSize: '16px' }}>
              Risk Engine Severity Thresholds
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-label-mono mb-2 block" style={{ color: 'var(--color-critical)', fontSize: '10px' }}>
                CRITICAL THRESHOLD (SCORE)
              </label>
              <input
                type="number"
                defaultValue={85}
                className="w-full rounded py-2 px-3 text-body-sm"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
            <div>
              <label className="text-label-mono mb-2 block" style={{ color: 'var(--color-high)', fontSize: '10px' }}>
                HIGH RISK THRESHOLD (SCORE)
              </label>
              <input
                type="number"
                defaultValue={70}
                className="w-full rounded py-2 px-3 text-body-sm"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
            <div>
              <label className="text-label-mono mb-2 block" style={{ color: 'var(--color-medium)', fontSize: '10px' }}>
                MEDIUM RISK THRESHOLD (SCORE)
              </label>
              <input
                type="number"
                defaultValue={50}
                className="w-full rounded py-2 px-3 text-body-sm"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Storage & Integration */}
        <div className="panel flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Database size={20} style={{ color: 'var(--color-low)' }} />
            <h3 className="text-headline-md" style={{ color: 'var(--color-text-primary)', fontSize: '16px' }}>
              Storage & Regional Feed
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-label-mono mb-2 block" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>
                DEFAULT REGION
              </label>
              <input
                type="text"
                defaultValue="Northern Railway Zone (NR-HQ Delhi)"
                className="w-full rounded py-2 px-3 text-body-sm"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
            <div>
              <label className="text-label-mono mb-2 block" style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>
                BACKEND API URL
              </label>
              <input
                type="text"
                defaultValue="http://localhost:8000"
                className="w-full rounded py-2 px-3 text-body-sm"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
