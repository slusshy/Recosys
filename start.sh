#!/bin/bash

# Set the Python path
export PYTHONPATH="/app"

# Change to the backend directory
cd /app/backend

# Install dependencies (in case anything is missing)
pip install --no-cache-dir -r requirements.txt

# Run the FastAPI application
echo "Starting FastAPI application..."
uvicorn main:app --host 0.0.0.0 --port 10000 --reload
