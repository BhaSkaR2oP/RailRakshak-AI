import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, Cpu, Eye, BarChart3, Radio, MapPin, Database } from 'lucide-react';
import TopBar from '../components/layout/TopBar';

interface Step {
  label: string;
  detail: string;
  icon: React.ElementType;
  duration: number; // ms
}

const STEPS: Step[] = [
  { label: 'Capturing Train Optical Video Stream', detail: 'Connecting to TRV-09 4K 60fps edge camera feed...', icon: Radio, duration: 800 },
  { label: 'OpenCV Frame Extraction & Preprocessing', detail: 'Extracting keyframes, normalizing lighting & perspective...', icon: Cpu, duration: 1100 },
  { label: 'YOLOv8 AI Defect Localization', detail: 'Scanning rail surfaces for cracks, fractures & loose fasteners...', icon: Eye, duration: 1600 },
  { label: 'Attaching GPS & Track Chainage Metadata', detail: 'Binding precision GPS coordinates & KM 142.85 chainage...', icon: MapPin, duration: 800 },
  { label: 'Calculating Structural Risk Score', detail: 'Executing deterministic risk formula (operational severity)...', icon: BarChart3, duration: 700 },
  { label: 'Syncing Database & Dispatching Command Alert', detail: 'Logging incident file to SQLite & updating geospatial map...', icon: Database, duration: 600 },
];

export default function AIProcessing() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [detectionsFound, setDetectionsFound] = useState(0);
  const [progress, setProgress] = useState(0);
  const fileName = sessionStorage.getItem('inspectionFileName') || 'TRV_TRACK_VIDEO_STREAM.mp4';
  const totalFrames = 60;

  useEffect(() => {
    let stepIndex = 0;

    function runNextStep() {
      if (stepIndex >= STEPS.length) {
        // Done — navigate to results
        setTimeout(() => navigate('/inspect/results/demo'), 500);
        return;
      }
      setCurrentStep(stepIndex);
      setProgress(Math.round(((stepIndex + 1) / STEPS.length) * 100));

      // Simulate detections appearing during YOLO step
      if (stepIndex === 2) {
        setTimeout(() => setDetectionsFound(1), 400);
        setTimeout(() => setDetectionsFound(2), 800);
        setTimeout(() => setDetectionsFound(3), 1200);
      }

      const step = STEPS[stepIndex];
      stepIndex++;
      setTimeout(runNextStep, step.duration);
    }

    const timer = setTimeout(runNextStep, 300);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <TopBar title="Edge AI Processing" subtitle={fileName} />
      <div className="max-w-[750px] mx-auto flex flex-col gap-6 mt-4">
        {/* Header */}
        <div className="panel text-center py-8" style={{ borderTop: '2px solid var(--color-info)' }}>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Loader2 size={48} className="animate-spin" style={{ color: 'var(--color-info)' }} />
              <Cpu size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-primary)' }} />
            </div>
          </div>
          <h2 className="text-headline-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
            AUTONOMOUS TRAIN EDGE PIPELINE
          </h2>
          <p className="text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
            Ingesting and analyzing track video stream in real-time
          </p>

          {/* Progress Bar */}
          <div className="mt-6 mx-auto max-w-md">
            <div className="flex justify-between mb-2">
              <span className="text-label-mono" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                Pipeline Execution
              </span>
              <span className="text-label-mono" style={{ color: 'var(--color-info)', fontSize: '11px' }}>
                {progress}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-high)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: 'var(--color-info)' }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 mx-auto max-w-md">
            <div>
              <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>OPENCV FRAMES</span>
              <p className="text-kpi-value mt-1 font-mono" style={{ color: 'var(--color-text-primary)', fontSize: '24px' }}>
                {currentStep >= 1 ? totalFrames : '—'} / {totalFrames}
              </p>
            </div>
            <div>
              <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>YOLO DETECTIONS</span>
              <p className="text-kpi-value mt-1 font-mono" style={{ color: detectionsFound > 0 ? 'var(--color-critical)' : 'var(--color-text-primary)', fontSize: '24px' }}>
                {detectionsFound}
              </p>
            </div>
            <div>
              <span className="text-label-mono" style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>EDGE MODEL</span>
              <p className="text-body-sm mt-2 font-semibold font-mono" style={{ color: 'var(--color-info)' }}>
                YOLOv8-Rail
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="panel">
          <h3 className="text-label-mono mb-4" style={{ color: 'var(--color-text-muted)' }}>Automated Telemetry Pipeline</h3>
          <div className="flex flex-col gap-1">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isDone = i < currentStep;
              const isActive = i === currentStep;

              return (
                <div
                  key={step.label}
                  className="flex items-center gap-3 rounded p-3 transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? 'rgba(76, 214, 255, 0.05)' : 'transparent',
                    borderLeft: isActive ? '2px solid var(--color-info)' : '2px solid transparent',
                  }}
                >
                  {isDone ? (
                    <CheckCircle size={18} style={{ color: 'var(--color-low)' }} />
                  ) : isActive ? (
                    <Loader2 size={18} className="animate-spin" style={{ color: 'var(--color-info)' }} />
                  ) : (
                    <Icon size={18} style={{ color: 'var(--color-text-dim)' }} />
                  )}
                  <div className="flex-1">
                    <span
                      className="text-body-sm font-medium"
                      style={{ color: isDone ? 'var(--color-low)' : isActive ? 'var(--color-text-primary)' : 'var(--color-text-dim)' }}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <p className="text-label-mono mt-0.5" style={{ color: 'var(--color-text-muted)', fontSize: '10px', textTransform: 'none' }}>
                        {step.detail}
                      </p>
                    )}
                  </div>
                  {isDone && (
                    <span className="text-label-mono" style={{ color: 'var(--color-low)', fontSize: '10px' }}>DONE</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
