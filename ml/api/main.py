"""
Prognos ML API — FastAPI application.

Run with:  uvicorn api.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import predict

app = FastAPI(
    title="Prognos ML API",
    description="Machine learning backend for cancer risk prediction",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/predict", tags=["predictions"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "prognos-ml"}
