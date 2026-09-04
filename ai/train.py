from ultralytics import YOLO
from pathlib import Path
import os

def train_model():
    # Define paths
    base_dir = Path(__file__).parent.parent
    yolo_dataset_dir = base_dir / "dataset" / "yolo_format"
    model_path = base_dir / "models" / "best.pt"
    
    # Ensure the YOLO dataset exists
    if not yolo_dataset_dir.exists():
        print(f"Dataset directory not found at {yolo_dataset_dir}")
        print("Please run prepare_dataset.py first.")
        return

    # Load model
    if model_path.exists():
        print(f"Loading existing model from {model_path}...")
        try:
            model = YOLO(str(model_path))
            print("Successfully loaded existing model.")
        except Exception as e:
            base_cls_model = base_dir / "models" / "yolov8n-cls.pt"
            model_source = str(base_cls_model) if base_cls_model.exists() else "yolov8n-cls.pt"
            model = YOLO(model_source)  # Nano classification model
    else:
        print("Loading pre-trained YOLOv8 nano classification model...")
        base_cls_model = base_dir / "models" / "yolov8n-cls.pt"
        model_source = str(base_cls_model) if base_cls_model.exists() else "yolov8n-cls.pt"
        model = YOLO(model_source)

    print(f"Starting model training on dataset: {yolo_dataset_dir}")
    
    # Train the model
    # Note: 'epochs' is set to 50 for actual fine-tuning.
    # 'device' is set to CPU. Change to '0' if you have a CUDA-enabled GPU.
    results = model.train(
        data=str(yolo_dataset_dir),
        epochs=50, 
        imgsz=224, # Standard image size for classification
        batch=16,
        device="cpu",
        project=str(base_dir / "experiments"),
        name="rail_defect_classification",
        exist_ok=True
    )
    
    print("Training completed!")
    print(f"Results and new weights are saved in: {base_dir / 'experiments' / 'rail_defect_classification'}")

if __name__ == "__main__":
    train_model()
