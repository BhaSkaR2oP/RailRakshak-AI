// ============================================================
// RailRakshak AI — API Service Layer
// Falls back to demo data when backend is unavailable
// ============================================================
import type { Defect, Inspection, MaintenanceTask, AnalyticsData, KPIData, RailwaySection } from '../types';
import { demoDefects, maintenanceTasks, analyticsData, kpiData, railwaySections } from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// ----- Health -----
export async function checkHealth(): Promise<boolean> {
  try {
    await apiFetch('/api/health');
    return true;
  } catch {
    return false;
  }
}

// ----- Inspections -----
export async function runInspection(file: File): Promise<Inspection> {
  try {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/api/inspect`, { method: 'POST', body: form });
    if (!res.ok) throw new Error('Inspection failed');
    return res.json();
  } catch {
    // Demo fallback
    return createDemoInspection(file);
  }
}

function createDemoInspection(file: File): Inspection {
  const id = `INS-${String(Date.now()).slice(-4)}`;
  return {
    id,
    filename: file.name,
    timestamp: new Date().toISOString(),
    status: 'COMPLETED',
    detection_mode: 'DEMO',
    model: 'YOLOv8n (Demo)',
    image_url: URL.createObjectURL(file),
    total_frames: file.type.startsWith('video') ? 60 : 1,
    processed_frames: file.type.startsWith('video') ? 60 : 1,
    detections: [
      {
        id: 'DET-001',
        defect_type: 'Rail Fracture',
        confidence: 96.4,
        risk_score: 94,
        severity: 'CRITICAL',
        bbox: [120, 80, 280, 200],
        recommended_action: 'Immediate field inspection required.',
      },
      {
        id: 'DET-002',
        defect_type: 'Missing Fastener',
        confidence: 91.2,
        risk_score: 78,
        severity: 'HIGH',
        bbox: [400, 150, 100, 80],
        recommended_action: 'Schedule fastener replacement within 24 hours.',
      },
      {
        id: 'DET-003',
        defect_type: 'Surface Crack',
        confidence: 84.6,
        risk_score: 62,
        severity: 'MEDIUM',
        bbox: [80, 300, 350, 120],
        recommended_action: 'Monitor crack progression.',
      },
    ],
  };
}

// ----- Defects -----
export async function getDefects(): Promise<Defect[]> {
  try {
    return await apiFetch<Defect[]>('/api/defects');
  } catch {
    return demoDefects;
  }
}

export async function getDefect(id: string): Promise<Defect | undefined> {
  try {
    return await apiFetch<Defect>(`/api/defects/${id}`);
  } catch {
    return demoDefects.find(d => d.id === id);
  }
}

// ----- Maintenance -----
export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  try {
    return await apiFetch<MaintenanceTask[]>('/api/maintenance');
  } catch {
    return maintenanceTasks;
  }
}

export async function createMaintenanceTask(task: Partial<MaintenanceTask>): Promise<MaintenanceTask> {
  try {
    return await apiFetch<MaintenanceTask>('/api/maintenance', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  } catch {
    const newTask: MaintenanceTask = {
      id: `MT-${String(Date.now()).slice(-3)}`,
      defect_id: task.defect_id || '',
      defect_type: task.defect_type || '',
      severity: task.severity || 'MEDIUM',
      section: task.section || '',
      status: 'OPEN',
      assigned_to: task.assigned_to || '',
      deadline: task.deadline || new Date(Date.now() + 86400000).toISOString(),
      created_at: new Date().toISOString(),
      notes: task.notes || '',
    };
    maintenanceTasks.push(newTask);
    return newTask;
  }
}

export async function updateMaintenanceTask(id: string, updates: Partial<MaintenanceTask>): Promise<MaintenanceTask> {
  try {
    return await apiFetch<MaintenanceTask>(`/api/maintenance/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  } catch {
    const idx = maintenanceTasks.findIndex(t => t.id === id);
    if (idx >= 0) Object.assign(maintenanceTasks[idx], updates);
    return maintenanceTasks[idx];
  }
}

// ----- Analytics -----
export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    return await apiFetch<AnalyticsData>('/api/analytics');
  } catch {
    return analyticsData;
  }
}

// ----- KPI -----
export async function getKPI(): Promise<KPIData> {
  try {
    return await apiFetch<KPIData>('/api/kpi');
  } catch {
    return kpiData;
  }
}

// ----- Locations -----
export async function getLocations(): Promise<RailwaySection[]> {
  try {
    return await apiFetch<RailwaySection[]>('/api/locations');
  } catch {
    return railwaySections;
  }
}
