#!/bin/bash

# Set the Python path
export PYTHONPATH="/app"

# Change to the backend directory
cd /app/backend

# Run the FastAPI application
uvicorn main:app --host 0.0.0.0 --port 10000
