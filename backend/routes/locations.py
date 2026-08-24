"""
Locations Route — Returns railway division/section GPS monitoring checkpoints.
"""

from fastapi import APIRouter
from typing import List
from backend.database import get_connection
from backend.models.schemas import RailwaySectionSchema

router = APIRouter(prefix="/api", tags=["Locations"])

@router.get("/locations", response_model=List[RailwaySectionSchema])
def list_locations():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM railway_sections")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]
