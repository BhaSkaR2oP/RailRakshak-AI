"""
RailRakshak AI — Main FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.database import init_db
from backend.routes import inspect, defects, maintenance, analytics, locations

# Initialize database on startup
init_db()

app = FastAPI(
    title="RailRakshak AI Backend",
    description="AI-driven Railway Infrastructure Safety & Defect Monitoring Platform",
    version="1.0.0"
)

# CORS configuration for local development & frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploaded images/videos
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Register Routers
app.include_router(inspect.router)
app.include_router(defects.router)
app.include_router(maintenance.router)
app.include_router(analytics.router)
app.include_router(locations.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "RailRakshak AI",
        "version": "1.0.0",
        "pipeline": "ONLINE"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
