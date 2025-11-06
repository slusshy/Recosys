FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
RUN mkdir -p /app/backend

# Set working directory
WORKDIR /app/backend

# Copy requirements first for better caching
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ /app/backend/

# Copy the start script
COPY start.sh /app/start.sh

# Make the start script executable
RUN chmod +x /app/start.sh

# Set PYTHONPATH to include the app directory
ENV PYTHONPATH="/app"

# Expose port
EXPOSE 10000

# Run the application
CMD ["/app/start.sh"]
