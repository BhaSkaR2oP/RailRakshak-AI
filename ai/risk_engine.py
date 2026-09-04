"""
RailRakshak AI — Deterministic Risk Scoring Engine
Calculates risk severity and normalized risk scores based on defect type, model confidence, and operational factors.
"""

from typing import Dict, Any, Tuple

# Defect baseline severity map (Defect Name -> (Base Severity, Base Risk Score))
DEFECT_SEVERITY_FACTORS: Dict[str, Tuple[str, int]] = {
    "Rail Fracture": ("CRITICAL", 92),
    "Severe Misalignment": ("CRITICAL", 88),
    "Track Buckling": ("CRITICAL", 90),
    "Missing Fastener": ("HIGH", 76),
    "Surface Crack": ("HIGH", 72),
    "Sleeper Damage": ("MEDIUM", 58),
    "Ballast Degradation": ("MEDIUM", 48),
    "Minor Corrosion": ("LOW", 28),
    "Surface Wear": ("LOW", 22),
}

def calculate_risk(defect_type: str, confidence: float, location_factor: float = 1.0) -> Dict[str, Any]:
    """
    Computes a deterministic risk score (0-100) and categorical severity level.
    
    IMPORTANT: Confidence measures the AI's certainty in its prediction,
    while Risk Score measures the operational danger of the physical defect.
    They are maintained as distinct metrics.
    """
    base_severity, base_score = DEFECT_SEVERITY_FACTORS.get(defect_type, ("MEDIUM", 50))
    
    # Confidence weight: 70% base impact + 30% confidence modulation
    confidence_ratio = max(0.1, min(1.0, confidence / 100.0))
    raw_risk = (base_score * 0.75) + (base_score * 0.25 * confidence_ratio)
    
    # Apply optional regional/location risk modifier
    adjusted_risk = min(100, max(1, int(raw_risk * location_factor)))
    
    # Categorize severity based on calibrated thresholds
    if adjusted_risk >= 85:
        severity = "CRITICAL"
        action = "Immediate field inspection required. Halt or restrict train speed on this block."
    elif adjusted_risk >= 70:
        severity = "HIGH"
        action = "Schedule maintenance dispatch within 24 hours. Monitor vibration sensors."
    elif adjusted_risk >= 45:
        severity = "MEDIUM"
        action = "Log for routine inspection within 72 hours. Track defect progression."
    else:
        severity = "LOW"
        action = "Apply standard preventive maintenance during next scheduled track block."
        
    return {
        "risk_score": adjusted_risk,
        "severity": severity,
        "recommended_action": action
    }
