"""
Maintenance Route — Manage maintenance work orders, assign technicians, and track resolution.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime, timedelta
import time
from backend.database import get_connection
from backend.models.schemas import (
    MaintenanceTaskSchema,
    MaintenanceTaskCreate,
    MaintenanceTaskUpdate
)

router = APIRouter(prefix="/api", tags=["Maintenance"])

@router.get("/maintenance", response_model=List[MaintenanceTaskSchema])
def list_maintenance_tasks():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM maintenance_tasks ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/maintenance", response_model=MaintenanceTaskSchema)
def create_maintenance_task(task: MaintenanceTaskCreate):
    conn = get_connection()
    cursor = conn.cursor()
    
    task_id = f"MT-{int(time.time()) % 1000:03d}"
    created_at = datetime.now().isoformat()
    deadline = task.deadline or (datetime.now() + timedelta(days=1)).isoformat()
    
    cursor.execute("""
    INSERT INTO maintenance_tasks (id, defect_id, defect_type, severity, section, status, assigned_to, deadline, created_at, notes)
    VALUES (?, ?, ?, ?, ?, 'OPEN', ?, ?, ?, ?)
    """, (
        task_id, task.defect_id, task.defect_type, task.severity, task.section,
        task.assigned_to or "", deadline, created_at, task.notes or ""
    ))
    
    conn.commit()
    conn.close()
    
    return {
        "id": task_id,
        "defect_id": task.defect_id,
        "defect_type": task.defect_type,
        "severity": task.severity,
        "section": task.section,
        "status": "OPEN",
        "assigned_to": task.assigned_to or "",
        "deadline": deadline,
        "created_at": created_at,
        "notes": task.notes or ""
    }

@router.patch("/maintenance/{task_id}", response_model=MaintenanceTaskSchema)
def update_maintenance_task(task_id: str, updates: MaintenanceTaskUpdate):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM maintenance_tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Maintenance task not found")
        
    current = dict(row)
    new_status = updates.status if updates.status is not None else current["status"]
    new_assigned = updates.assigned_to if updates.assigned_to is not None else current["assigned_to"]
    new_notes = updates.notes if updates.notes is not None else current["notes"]
    
    cursor.execute("""
    UPDATE maintenance_tasks
    SET status = ?, assigned_to = ?, notes = ?
    WHERE id = ?
    """, (new_status, new_assigned, new_notes, task_id))
    
    # If task resolved, also update defect status
    if new_status == "RESOLVED" and current.get("defect_id"):
        cursor.execute("UPDATE defects SET status = 'RESOLVED' WHERE id = ?", (current["defect_id"],))
        
    conn.commit()
    conn.close()
    
    current["status"] = new_status
    current["assigned_to"] = new_assigned
    current["notes"] = new_notes
    return current
