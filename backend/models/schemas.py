"""
RailRakshak AI — Pydantic Data Validation Schemas
"""

from pydantic import BaseModel
from typing import List, Optional, Tuple

class DetectionSchema(BaseModel):
    id: str
    defect_type: str
    confidence: float
    risk_score: int
    severity: str
    bbox: List[int]
    recommended_action: str

class InspectionResponse(BaseModel):
    id: str
    filename: str
    timestamp: str
    status: str
    detection_mode: str
    detections: List[DetectionSchema]
    total_frames: Optional[int] = 1
    processed_frames: Optional[int] = 1
    model: str
    image_url: str

class DefectSchema(BaseModel):
    id: str
    inspection_id: str
    defect_type: str
    confidence: float
    risk_score: int
    severity: str
    latitude: float
    longitude: float
    timestamp: str
    status: str
    image_url: str
    section: str
    recommended_action: str
    bbox: Optional[List[int]] = None

class MaintenanceTaskCreate(BaseModel):
    defect_id: str
    defect_type: str
    severity: str
    section: str
    assigned_to: Optional[str] = ""
    deadline: Optional[str] = ""
    notes: Optional[str] = ""

class MaintenanceTaskUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None

class MaintenanceTaskSchema(BaseModel):
    id: str
    defect_id: str
    defect_type: str
    severity: str
    section: str
    status: str
    assigned_to: str
    deadline: str
    created_at: str
    notes: str

class RailwaySectionSchema(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    risk_level: str
    total_defects: int
    active_defects: int

class KPISchema(BaseModel):
    total_inspections: int
    active_defects: int
    critical_defects: int
    high_risk: int
    resolved_percentage: int
