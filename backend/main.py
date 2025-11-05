from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.recommendations import router as recommendations_router
from routers.contact import router as contact_router
from routers.auth import router as auth_router
from routers.tmdb import router as tmdb_router
from dotenv import load_dotenv
import os

load_dotenv()
APP_NAME = os.getenv("APP_NAME", "AI RecoSys Backend")

app = FastAPI(title=APP_NAME, version="1.0.0")

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173",
    # Production frontend
    "https://reco-sys.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "AI RecoSys Backend is running 🚀"}


app.include_router(recommendations_router, prefix="/api", tags=["recommendations"])
app.include_router(contact_router, prefix="/api", tags=["contact"])
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(tmdb_router, prefix="/api", tags=["tmdb"])


@app.get("/health")
async def health():
    return {"status": "ok"}


# Helpful API root so /api doesn't 404
@app.get("/api")
async def api_root():
    return {"status": "ok", "message": "API root", "endpoints": [
        "/api/recommendations/",
        "/api/recommendations/trending",
        "/health"
    ]}
