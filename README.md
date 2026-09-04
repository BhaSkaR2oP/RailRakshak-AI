# RailRakshak AI 🚆🛡️

> **Intelligent Railway Safety System** powered by AI, Computer Vision, and Real-Time Risk Analytics to detect railway hazards and track defects before accidents occur.

---

## 📁 Project Architecture

```
RailRakshak-AI/
├── .env.example              # Environment variable configuration template
├── .gitignore                # Optimized ignore rules (ignoring node_modules, datasets, etc.)
├── README.md                 # System overview and quickstart guide
├── requirements.txt          # Unified Python dependencies (FastAPI, Ultralytics, OpenCV)
│
├── ai/                       # AI & Computer Vision Module
│   ├── detection.py          # YOLOv8 live detection and prototype demo detector
│   ├── preprocessing.py      # Image normalization and enhancement
│   ├── risk_engine.py        # Defect risk scoring and severity assessment
│   ├── train.py              # YOLOv8 model training pipeline
│   ├── test.py               # Model evaluation & inference test script
│   ├── prepare_dataset.py    # Dataset preprocessing & format converter
│   └── api_flask_demo.py     # Standalone lightweight Flask web demo
│
├── backend/                  # FastAPI REST API Platform
│   ├── main.py               # Application entry point & router mounting
│   ├── database.py           # SQLite connection & table schema initializer
│   ├── seed.py               # Mock telemetry & defect data seeder
│   ├── railrakshak.db        # SQLite database file
│   ├── requirements.txt      # Backend Python dependencies
│   ├── models/               # Pydantic schemas (Defects, Tasks, KPIs, Inspections)
│   ├── routes/               # API route handlers
│   │   ├── inspect.py        # POST /api/inspect (YOLO inference pipeline)
│   │   ├── defects.py        # Defect telemetry endpoints
│   │   ├── maintenance.py    # Maintenance task assignment endpoints
│   │   ├── analytics.py      # Safety KPIs & risk distribution
│   │   └── locations.py      # GIS hazard coordinates
│   ├── uploads/              # Uploaded inspection media storage
│   └── legacy_express/       # Archived Node.js / Express starter template
│
├── frontend/                 # Vite + React 19 + TypeScript + TailwindCSS Web App
│   ├── index.html            # SPA HTML entry point
│   ├── package.json          # Node dependencies & build scripts
│   ├── vite.config.ts        # Vite build configuration
│   ├── public/               # Static assets, SVG icons & benchmark dataset samples
│   └── src/                  # React source code (routing, design tokens, components)
│       ├── pages/
│       │   ├── Dashboard.tsx        # Command Center Overview & KPI telemetry
│       │   ├── DatasetAnalysis.tsx  # Track & Dataset Image Upload & AI Inference Analyzer
│       │   ├── AIInspection.tsx     # Onboard Live Train stream simulation
│       │   ├── Defects.tsx          # Defect inventory & multi-filtering table
│       │   ├── RailwayMap.tsx       # Interactive GIS Railway Hazard Map
│       │   ├── Maintenance.tsx      # Maintenance task assignment board
│       │   ├── Analytics.tsx        # Defect trends & corridor risk distributions
│       │   └── Settings.tsx         # Platform configurations & model thresholds
│
├── database/                 # Database documentation and schema specs
│   └── README.md             # Schema definitions and data dictionary
│
├── models/                   # Pretrained and fine-tuned YOLO model weights
│   ├── best.pt
│   └── yolov8n-cls.pt
│
├── dataset/                  # Track defect image dataset (Git-ignored)
├── experiments/              # Model training experiment metrics & logs
├── test/                     # Sample images for testing inference
└── videos/                   # Sample railway footage for video analysis
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

### 3. Backend (FastAPI)
Install dependencies and seed the database:
```bash
# Install Python dependencies
pip install -r requirements.txt

# (Optional) Seed the database with sample inspection telemetry
python backend/seed.py

# Start the FastAPI server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
API documentation will be accessible at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health Check: `http://localhost:8000/api/health`

### 4. Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

### 5. Standalone AI Demo
To run the quick standalone Flask preview:
```bash
python ai/api_flask_demo.py
```
Visit `http://localhost:5000` to upload track images for instant defect classification.

### 6. Training YOLO Models
To train the YOLOv8 classification model on the dataset:
```bash
python ai/train.py
```
Training logs and best weights will be saved under `experiments/rail_defect_classification/`.

---

## 🛡️ Key Features
- **Real-Time Defect Detection**: Automatic identification of rail fractures, missing fasteners, surface cracks, and sleeper damage via YOLOv8.
- **Calibrated Risk Engine**: Calculates risk score (0-100) and severity level (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) with immediate recommended maintenance actions.
- **Maintenance Task Dispatch**: Assign repair work orders and track resolution status.
- **Geospatial Mapping**: Track coordinates and hazard hot-spots for railway GIS integration.
