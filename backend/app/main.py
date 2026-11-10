from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.telemetry import router as telemetry_router
from app.routes.satellites import router as satellites_router

from app.routes.alerts import router as alerts_router

app = FastAPI(
    title="COSMOS",
    description="Cognitive Mission Intelligence Platform",
    version="1.0.0"
)

# Allow the COSMOS React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register telemetry API routes
app.include_router(telemetry_router)

app.include_router(satellites_router)

app.include_router(alerts_router)
@app.get("/")
def home():
    return {
        "project": "COSMOS",
        "message": "COSMOS Backend is running!",
        "status": "Online"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "COSMOS Backend"
    }