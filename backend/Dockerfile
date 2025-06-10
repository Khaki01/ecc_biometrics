# Start from a base Python image
FROM python:3.9-slim-bookworm

# Install system dependencies required for dlib and face_recognition
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libjpeg-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

RUN mkdir -p faces_db && python -c "from apps.face_utils import load_face_database; load_face_database()"

EXPOSE 8000
# Run the app
CMD ["uvicorn", "apps.main:app", "--host", "0.0.0.0", "--port", "8000"]