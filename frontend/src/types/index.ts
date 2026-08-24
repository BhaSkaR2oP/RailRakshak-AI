// ============================================================
// RailRakshak AI — TypeScript Types
// ============================================================

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type DefectStatus = 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';
export type DetectionMode = 'LIVE' | 'DEMO';
export type UserRole = 'CHIEF_ENGINEER' | 'DIVISION_OFFICER' | 'SUPER_ADMIN';

export interface PermittedArea {
  id: string;
  name: string;
  zone: string;
  division: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  bounds?: [[number, number], [number, number]];
  polygon?: [number, number][]; // Boundary for geo-fencing visualization
  radiusKm?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  badgeId: string;
  avatarInitials: string;
  permittedSectionId: string | 'ALL';
  permittedArea: PermittedArea;
}

export interface Detection {
  id: string;
  defect_type: string;
  confidence: number;
  risk_score: number;
  severity: Severity;
  bbox: [number, number, number, number]; // [x, y, w, h]
  recommended_action: string;
}

export interface Defect {
  id: string;
  inspection_id: string;
  defect_type: string;
  confidence: number;
  risk_score: number;
  severity: Severity;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: DefectStatus;
  image_url: string;
  section: string;
  recommended_action: string;
  bbox?: [number, number, number, number];
}

export interface Inspection {
  id: string;
  filename: string;
  timestamp: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  detection_mode: DetectionMode;
  detections: Detection[];
  total_frames?: number;
  processed_frames?: number;
  model: string;
  image_url: string;
}

export interface MaintenanceTask {
  id: string;
  defect_id: string;
  defect_type: string;
  severity: Severity;
  section: string;
  status: DefectStatus;
  assigned_to: string;
  deadline: string;
  created_at: string;
  notes: string;
}

export interface RailwaySection {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  risk_level: Severity;
  total_defects: number;
  active_defects: number;
}

export interface KPIData {
  total_inspections: number;
  active_defects: number;
  critical_defects: number;
  high_risk: number;
  resolved_percentage: number;
}

export interface AnalyticsData {
  defects_by_type: { name: string; value: number }[];
  defects_by_severity: { name: string; value: number; color: string }[];
  defects_over_time: { date: string; defects: number; resolved: number }[];
  section_risk: { section: string; risk: Severity; score: number; defects: number }[];
  mttr_hours: number;
  sla_compliance: number;
  critical_backlog: number;
}

export interface ProcessingStep {
  label: string;
  status: 'pending' | 'active' | 'completed';
  icon: string;
}
