"""
RailRakshak AI — Lightweight SQLite Database Manager
Provides fast, zero-dependency persistence for prototype evaluation.
"""

import sqlite3
import os
from typing import Dict, List, Any, Optional

DB_PATH = os.getenv("DB_PATH", os.path.join(os.path.dirname(__file__), "railrakshak.db"))

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Defects Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS defects (
        id TEXT PRIMARY KEY,
        inspection_id TEXT,
        defect_type TEXT,
        confidence REAL,
        risk_score INTEGER,
        severity TEXT,
        latitude REAL,
        longitude REAL,
        timestamp TEXT,
        status TEXT,
        image_url TEXT,
        section TEXT,
        recommended_action TEXT,
        bbox TEXT
    )
    """)
    
    # Maintenance Tasks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS maintenance_tasks (
        id TEXT PRIMARY KEY,
        defect_id TEXT,
        defect_type TEXT,
        severity TEXT,
        section TEXT,
        status TEXT,
        assigned_to TEXT,
        deadline TEXT,
        created_at TEXT,
        notes TEXT
    )
    """)
    
    # Railway Sections Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS railway_sections (
        id TEXT PRIMARY KEY,
        name TEXT,
        latitude REAL,
        longitude REAL,
        risk_level TEXT,
        total_defects INTEGER,
        active_defects INTEGER
    )
    """)
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
