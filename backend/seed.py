"""
RailRakshak AI — Database Seeder Script
Populates SQLite with realistic railway inspection and defect records.
"""

import json
from backend.database import get_connection, init_db

def seed_database():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    
    # Clear existing tables for a clean seed
    cursor.execute("DELETE FROM defects")
    cursor.execute("DELETE FROM maintenance_tasks")
    cursor.execute("DELETE FROM railway_sections")
    
    # 1. Seed Railway Sections
    sections = [
        ("SEC-001", "Delhi Section", 28.6139, 77.2090, "CRITICAL", 42, 8),
        ("SEC-002", "Mumbai Section", 19.0760, 72.8777, "HIGH", 35, 6),
        ("SEC-003", "Lucknow Section", 26.8467, 80.9462, "MEDIUM", 28, 4),
        ("SEC-004", "Jaipur Section", 26.9124, 75.7873, "LOW", 23, 2),
    ]
    cursor.executemany("""
    INSERT INTO railway_sections (id, name, latitude, longitude, risk_level, total_defects, active_defects)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, sections)
    
    # 2. Seed Defects
    defects = [
        (
            "DEF-00128", "INS-0042", "Rail Fracture", 96.4, 94, "CRITICAL",
            28.6139, 77.2090, "2026-08-24T21:45:12+05:30", "OPEN",
            "/demo/rail_fracture.jpg", "Delhi Section",
            "Immediate field inspection required. Halt corridor traffic until crack weld is completed.",
            json.dumps([120, 80, 280, 200])
        ),
        (
            "DEF-00127", "INS-0041", "Missing Fastener", 91.2, 78, "HIGH",
            28.6280, 77.2195, "2026-08-24T21:38:45+05:30", "ACKNOWLEDGED",
            "/demo/missing_fastener.jpg", "Delhi Section",
            "Schedule fastener replacement within 24 hours.",
            json.dumps([200, 150, 100, 80])
        ),
        (
            "DEF-00126", "INS-0040", "Surface Crack", 84.6, 62, "MEDIUM",
            28.5940, 77.1855, "2026-08-24T21:31:00+05:30", "IN_PROGRESS",
            "/demo/surface_crack.jpg", "Delhi Section",
            "Monitor crack progression. Schedule maintenance within 72 hours.",
            json.dumps([80, 200, 350, 120])
        ),
        (
            "DEF-00125", "INS-0039", "Sleeper Damage", 88.1, 56, "MEDIUM",
            19.0760, 72.8777, "2026-08-24T20:15:30+05:30", "OPEN",
            "/demo/sleeper_damage.jpg", "Mumbai Section",
            "Assess structural integrity. Replace if deterioration exceeds 40%.",
            json.dumps([50, 100, 400, 250])
        ),
        (
            "DEF-00124", "INS-0038", "Severe Misalignment", 93.7, 91, "CRITICAL",
            19.0890, 72.8650, "2026-08-24T19:50:00+05:30", "ACKNOWLEDGED",
            "/demo/misalignment.jpg", "Mumbai Section",
            "URGENT: Halt traffic on this section. Dispatch realignment crew immediately.",
            json.dumps([100, 60, 320, 180])
        ),
        (
            "DEF-00123", "INS-0037", "Minor Corrosion", 76.3, 28, "LOW",
            26.8467, 80.9462, "2026-08-24T18:20:00+05:30", "RESOLVED",
            "/demo/corrosion.jpg", "Lucknow Section",
            "Apply anti-corrosion treatment during next scheduled maintenance.",
            json.dumps([180, 140, 200, 160])
        ),
        (
            "DEF-00122", "INS-0036", "Rail Fracture", 97.1, 96, "CRITICAL",
            26.8590, 80.9120, "2026-08-24T17:45:00+05:30", "IN_PROGRESS",
            "/demo/rail_fracture_2.jpg", "Lucknow Section",
            "Critical: Deploy emergency repair crew. Divert all traffic.",
            json.dumps([90, 70, 340, 210])
        ),
        (
            "DEF-00121", "INS-0035", "Missing Fastener", 89.5, 74, "HIGH",
            26.9124, 75.7873, "2026-08-24T16:30:00+05:30", "OPEN",
            "/demo/missing_fastener_2.jpg", "Jaipur Section",
            "Replace missing fasteners within 48 hours.",
            json.dumps([220, 120, 90, 70])
        ),
        (
            "DEF-00120", "INS-0034", "Surface Crack", 82.0, 58, "MEDIUM",
            19.1100, 72.9000, "2026-08-24T15:10:00+05:30", "OPEN",
            "/demo/surface_crack_2.jpg", "Mumbai Section",
            "Monitor and schedule grinding operation within 1 week.",
            json.dumps([150, 180, 260, 100])
        ),
        (
            "DEF-00119", "INS-0033", "Ballast Degradation", 79.8, 45, "MEDIUM",
            26.9300, 75.8100, "2026-08-24T14:00:00+05:30", "RESOLVED",
            "/demo/ballast.jpg", "Jaipur Section",
            "Schedule ballast replacement during next block period.",
            json.dumps([40, 220, 440, 180])
        ),
        (
            "DEF-00118", "INS-0032", "Minor Corrosion", 71.2, 25, "LOW",
            28.6350, 77.2250, "2026-08-24T12:30:00+05:30", "RESOLVED",
            "/demo/corrosion_2.jpg", "Delhi Section",
            "Apply protective coating during routine maintenance.",
            json.dumps([160, 100, 180, 140])
        ),
        (
            "DEF-00117", "INS-0031", "Rail Fracture", 95.3, 92, "CRITICAL",
            19.0500, 72.8400, "2026-08-24T10:45:00+05:30", "RESOLVED",
            "/demo/rail_fracture_3.jpg", "Mumbai Section",
            "Emergency weld repair completed. Monitor for 72 hours.",
            json.dumps([110, 90, 300, 190])
        ),
    ]
    cursor.executemany("""
    INSERT INTO defects (id, inspection_id, defect_type, confidence, risk_score, severity, latitude, longitude, timestamp, status, image_url, section, recommended_action, bbox)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, defects)
    
    # 3. Seed Maintenance Tasks
    tasks = [
        ("MT-001", "DEF-00128", "Rail Fracture", "CRITICAL", "Delhi Section", "OPEN", "Rahul Sharma", "2026-08-25T18:00:00+05:30", "2026-08-24T21:50:00+05:30", "Immediate inspection required. Emergency repair crew dispatched."),
        ("MT-002", "DEF-00124", "Severe Misalignment", "CRITICAL", "Mumbai Section", "ACKNOWLEDGED", "Priya Patel", "2026-08-25T12:00:00+05:30", "2026-08-24T20:00:00+05:30", "Traffic halted. Realignment crew dispatched."),
        ("MT-003", "DEF-00127", "Missing Fastener", "HIGH", "Delhi Section", "ACKNOWLEDGED", "Amit Kumar", "2026-08-26T10:00:00+05:30", "2026-08-24T21:40:00+05:30", "Fastener kit requisitioned from depot."),
        ("MT-004", "DEF-00122", "Rail Fracture", "CRITICAL", "Lucknow Section", "IN_PROGRESS", "Vikram Singh", "2026-08-25T06:00:00+05:30", "2026-08-24T18:00:00+05:30", "Emergency welding in progress. 60% complete."),
        ("MT-005", "DEF-00126", "Surface Crack", "MEDIUM", "Delhi Section", "IN_PROGRESS", "Neha Gupta", "2026-08-27T18:00:00+05:30", "2026-08-24T21:35:00+05:30", "Crack monitoring sensors installed. Grinding scheduled."),
        ("MT-006", "DEF-00117", "Rail Fracture", "CRITICAL", "Mumbai Section", "RESOLVED", "Raj Malhotra", "2026-08-24T18:00:00+05:30", "2026-08-24T11:00:00+05:30", "Emergency weld repair completed. Post-repair inspection passed."),
        ("MT-007", "DEF-00125", "Sleeper Damage", "MEDIUM", "Mumbai Section", "OPEN", "", "2026-08-28T18:00:00+05:30", "2026-08-24T20:20:00+05:30", "Awaiting assignment."),
        ("MT-008", "DEF-00121", "Missing Fastener", "HIGH", "Jaipur Section", "OPEN", "Suresh Yadav", "2026-08-26T18:00:00+05:30", "2026-08-24T16:45:00+05:30", "Parts ordered. Awaiting delivery."),
    ]
    cursor.executemany("""
    INSERT INTO maintenance_tasks (id, defect_id, defect_type, severity, section, status, assigned_to, deadline, created_at, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, tasks)
    
    conn.commit()
    conn.close()
    print("Database seeded with sample railway defect telemetry successfully.")

if __name__ == "__main__":
    seed_database()
