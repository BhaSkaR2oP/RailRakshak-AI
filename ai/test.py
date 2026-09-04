from ultralytics import YOLO
from pathlib import Path

def test_model():
    base_dir = Path(__file__).parent.parent
    test_dir = base_dir / "test"
    
    # Model selection logic: 
    # Try newly trained model first, then the existing one in models/, then fail.
    new_model_path = base_dir / "experiments" / "rail_defect_classification" / "weights" / "best.pt"
    existing_model_path = base_dir / "models" / "best.pt"
    
    if new_model_path.exists():
        model_path = new_model_path
        print(f"Loading newly trained model from: {model_path}")
    elif existing_model_path.exists():
        model_path = existing_model_path
        print(f"Loading existing model from: {model_path}")
    else:
        print("No trained model found! Please run train.py first.")
        return

    # Load the YOLO model
    try:
        model = YOLO(str(model_path))
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    # List of images to test in the test/ folder
    test_images = ["defective.jpg", "nondefective.jpg"]
    
    print("\nStarting inference...\n")
    for img_name in test_images:
        img_path = test_dir / img_name
        
        if not img_path.exists():
            print(f"Warning: Test image '{img_name}' not found at {img_path}. Skipping.")
            continue
            
        print(f"--- Analyzing '{img_name}' ---")
        
        # Run inference
        results = model(str(img_path))
        
        for result in results:
            if result.probs is not None:
                # Get the highest confidence class
                top1_index = result.probs.top1
                confidence = result.probs.top1conf.item()
                predicted_class = model.names[top1_index]
                
                print(f"Predicted Class: {predicted_class}")
                print(f"Confidence: {confidence * 100:.2f}%\n")
            else:
                # If it's an object detection model, it will have 'boxes' instead of 'probs'
                if result.boxes is not None and len(result.boxes) > 0:
                    print("This appears to be an object detection model.")
                    print(f"Found {len(result.boxes)} objects.")
                    for box in result.boxes:
                        cls = int(box.cls[0].item())
                        conf = box.conf[0].item()
                        print(f" - {model.names[cls]}: {conf * 100:.2f}% confidence")
                    print()
                else:
                    print("No detections or classification probabilities found.\n")

if __name__ == "__main__":
    test_model()
