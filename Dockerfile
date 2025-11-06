FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create and set the working directory
WORKDIR /app

# Copy the entire project structure
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Set PYTHONPATH to include the app directory
ENV PYTHONPATH="/app"

# Expose port
EXPOSE 10000

# Run the application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "10000"]
