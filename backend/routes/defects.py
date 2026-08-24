"""
Defects Route — Query and filter railway defect telemetry records.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import json
from backend.database import get_connection
from backend.models.schemas import DefectSchema

router = APIRouter(prefix="/api", tags=["Defects"])

@router.get("/defects", response_model=List[DefectSchema])
def list_defects(
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    section: Optional[str] = Query(None)
):
    conn = get_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM defects WHERE 1=1"
    params = []
    
    if severity:
        query += " AND severity = ?"
        params.append(severity.upper())
    if status:
        query += " AND status = ?"
        params.append(status.upper())
    if section:
        query += " AND section LIKE ?"
        params.append(f"%{section}%")
        
    query += " ORDER BY risk_score DESC"
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        d = dict(r)
        if d.get("bbox"):
            try:
                d["bbox"] = json.loads(d["bbox"])
            except Exception:
                d["bbox"] = None
        results.append(d)
        
    return results

@router.get("/defects/{defect_id}", response_model=DefectSchema)
def get_defect_detail(defect_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM defects WHERE id = ?", (defect_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Defect not found")
        
    d = dict(row)
    if d.get("bbox"):
        try:
            d["bbox"] = json.loads(d["bbox"])
        except Exception:
            d["bbox"] = None
    return d
