import os
import shutil
from pathlib import Path

def setup_dataset():
    # Base dataset directory
    base_dir = Path(__file__).parent.parent
    dataset_dir = base_dir / "dataset"
    yolo_dataset_dir = dataset_dir / "yolo_format"
    
    print(f"Setting up YOLO dataset structure in: {yolo_dataset_dir}")
    yolo_dataset_dir.mkdir(parents=True, exist_ok=True)
    
    # YOLO classification requires 'train', 'val', 'test' lowercase directories
    mapping = {
        "Train": "train",
        "Validation": "val",
        "Test": "test"
    }
    
    for old_name, new_name in mapping.items():
        src = dataset_dir / old_name
        dst = yolo_dataset_dir / new_name
        
        if src.exists() and not dst.exists():
            print(f"Copying {src.name} to {new_name}...")
            shutil.copytree(src, dst)
        elif dst.exists():
            print(f"{dst.name} already exists. Skipping.")
        else:
            print(f"Source folder {src} not found! Check your dataset path.")
            
    print("Dataset preparation complete.")

if __name__ == "__main__":
    setup_dataset()
