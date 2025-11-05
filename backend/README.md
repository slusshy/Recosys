# AI RecoSys Backend (FastAPI)

A lightweight FastAPI backend for AI RecoSys – AI Powered Recommendation System.

## Endpoints
- GET `/` → health message
- GET `/api/recommendations?category=movies&genre=sci-fi` → mock recommendations from `data/sample_data.json` or fallback util
- POST `/api/contact` → accepts contact payload and logs to console

## Run locally
```
cd backend
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Open http://127.0.0.1:8000 and visit docs at http://127.0.0.1:8000/docs

## CORS
CORS is enabled for local dev and a placeholder Netlify domain. Update `origins` in `main.py` as needed.

## Notes
- Replace `utils/recommender.py` with real ML logic later.
- Move `data/sample_data.json` to a database when ready.
