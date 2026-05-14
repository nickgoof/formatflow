# STAGE 1: Angular Frontend bauen
FROM node:22-alpine AS build-stage
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npx ng build --configuration production
# STAGE 2: Python Backend & Serving
FROM python:3.11-slim
WORKDIR /app

# System-Abhängigkeiten (falls nötig)
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*
# Backend-Dateien kopieren
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
# Das gebaute Frontend von Stage 1 in das Backend kopieren
# Hinweis: Der Pfad 'dist/formatflow/browser' hängt von deiner Angular-Version ab.
COPY --from=build-stage /app/frontend/dist/FormatFlow/browser ./static
# Port freigeben
EXPOSE 8080
# Startbefehl (Beispiel für Gunicorn/Uvicorn)
# Falls du FastAPI nutzt: uvicorn main:app --host 0.0.0.0 --port 8080
# Falls du Flask nutzt: gunicorn main:app --bind 0.0.0.0:8080
CMD ["python", "main.py"]