import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv

# Import routers with relative paths
from routers.recommendations import router as recommendations_router
from routers.contact import router as contact_router
from routers.auth import router as auth_router
from routers.tmdb import router as tmdb_router

load_dotenv()
APP_NAME = os.getenv("APP_NAME", "AI RecoSys Backend")

app = FastAPI(title=APP_NAME, version="1.0.0")

# Allow all origins in development
# In production, replace with your actual frontend URL
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173",
    "https://690b7d04b5adea427e7005a9--reco-sys.netlify.app",
    "https://reco-sys.onrender.com",  # Add your Render frontend URL here
    "*"  # For development only, remove in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <!DOCTYPE html>
    <html>
        <head>
            <title>AI RecoSys Backend</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
                .container { max-width: 800px; margin: 0 auto; }
                .success { color: green; }
                .endpoint { background: #f4f4f4; padding: 10px; margin: 5px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>AI RecoSys Backend is running 🚀</h1>
                <p class="success">The server is up and running!</p>
                <h2>Available Endpoints:</h2>
                <div class="endpoint">
                    <strong>Interactive API Documentation:</strong> 
                    <a href="/docs" target="_blank">/docs</a> (Swagger UI)
                </div>
                <div class="endpoint">
                    <strong>Health Check:</strong> 
                    <a href="/health" target="_blank">/health</a>
                </div>
                <h3>API Routes:</h3>
                <ul>
                    <li><a href="/api/recommendations" target="_blank">/api/recommendations</a></li>
                    <li><a href="/api/contact" target="_blank">/api/contact</a></li>
                    <li><a href="/api/auth" target="_blank">/api/auth</a></li>
                    <li><a href="/api/tmdb" target="_blank">/api/tmdb</a></li>
                </ul>
            </div>
        </body>
    </html>
    """


app.include_router(recommendations_router, prefix="/api", tags=["recommendations"])
app.include_router(contact_router, prefix="/api", tags=["contact"])
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(tmdb_router, prefix="/api", tags=["tmdb"])


@app.get("/health")
async def health():
    return {"status": "ok"}
