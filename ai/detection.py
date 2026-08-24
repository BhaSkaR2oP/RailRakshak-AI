"""
RailRakshak AI — Defect Detection Module (Ultralytics YOLO / Simulated AI Inference)
Accurately distinguishes between LIVE model prediction and structured DEMO mode.
"""

import os
import random
from typing import List, Dict, Any
from ai.risk_engine import calculate_risk

# Realistic Railway Defect catalog for high-fidelity demonstration
PROTOTYPE_DEFECT_SAMPLES = [
    {
        "defect_type": "Rail Fracture",
        "confidence_range": (94.0, 98.5),
        "bbox": [120, 75, 260, 180],
    },
    {
        "defect_type": "Missing Fastener",
        "confidence_range": (88.0, 94.0),
        "bbox": [410, 140, 95, 75],
    },
    {
        "defect_type": "Surface Crack",
        "confidence_range": (82.0, 89.0),
        "bbox": [65, 270, 310, 110],
    },
    {
        "defect_type": "Sleeper Damage",
        "confidence_range": (85.0, 91.0),
        "bbox": [90, 110, 340, 220],
    }
]

class DefectDetector:
    def __init__(self):
        self.model_path = os.getenv("YOLO_MODEL_PATH", "")
        self.demo_mode = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")
        self.model = None
        
        if not self.demo_mode and self.model_path and os.path.exists(self.model_path):
            try:
                from ultralytics import YOLO
                self.model = YOLO(self.model_path)
                print(f"[RailRakshak AI] Loaded custom YOLO model from: {self.model_path}")
            except Exception as e:
                print(f"[RailRakshak AI] Failed to load YOLO model: {e}. Falling back to DEMO mode.")
                self.demo_mode = True
        else:
            self.demo_mode = True

    def detect(self, image_path: str) -> Dict[str, Any]:
        """
        Runs defect detection pipeline on the provided railway image.
        Returns detailed bounding boxes, confidence values, and calibrated risk assessments.
        """
        if self.demo_mode or self.model is None:
            return self._run_demo_detection(image_path)
            
        return self._run_live_detection(image_path)

    def _run_demo_detection(self, image_path: str) -> Dict[str, Any]:
        """
        Generates realistic defect telemetry for SIH prototype evaluation without false accuracy claims.
        """
        # Pick 2-3 realistic detections
        selected_samples = random.sample(PROTOTYPE_DEFECT_SAMPLES, k=min(3, len(PROTOTYPE_DEFECT_SAMPLES)))
        detections = []
        
        for idx, sample in enumerate(selected_samples, start=1):
            conf = round(random.uniform(*sample["confidence_range"]), 1)
            risk_info = calculate_risk(sample["defect_type"], conf)
            
            detections.append({
                "id": f"DET-{str(idx).zfill(3)}",
                "defect_type": sample["defect_type"],
                "confidence": conf,
                "risk_score": risk_info["risk_score"],
                "severity": risk_info["severity"],
                "bbox": sample["bbox"],
                "recommended_action": risk_info["recommended_action"]
            })
            
        return {
            "mode": "DEMO",
            "model_name": "RailRakshak-YOLOv8n-Demo",
            "image_path": image_path,
            "detections": detections,
            "total_defects_found": len(detections)
        }

    def _run_live_detection(self, image_path: str) -> Dict[str, Any]:
        """
        Executes live inference with Ultralytics YOLO model.
        """
        results = self.model(image_path)
        detections = []
        
        for idx, box in enumerate(results[0].boxes, start=1):
            cls_id = int(box.cls[0])
            conf = round(float(box.conf[0]) * 100, 1)
            class_name = self.model.names[cls_id]
            
            # Calculate operational risk
            risk_info = calculate_risk(class_name, conf)
            xywh = box.xywh[0].tolist()
            
            detections.append({
                "id": f"DET-{str(idx).zfill(3)}",
                "defect_type": class_name,
                "confidence": conf,
                "risk_score": risk_info["risk_score"],
                "severity": risk_info["severity"],
                "bbox": [int(v) for v in xywh],
                "recommended_action": risk_info["recommended_action"]
            })
            
        return {
            "mode": "LIVE",
            "model_name": os.path.basename(self.model_path) if self.model_path else "YOLOv8",
            "image_path": image_path,
            "detections": detections,
            "total_defects_found": len(detections)
        }

# Global singleton instance
detector = DefectDetector()
