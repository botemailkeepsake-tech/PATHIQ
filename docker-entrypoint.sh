#!/bin/sh
set -e

# Render provides PORT for the public web service (defaults to 10000)
RENDER_PORT="${PORT:-10000}"

echo "=================================================="
echo "Starting PATHIQ Combined Deployment"
echo "Public Port (Next.js): ${RENDER_PORT}"
echo "Internal Port (FastAPI): 8000"
echo "=================================================="

# Normalize Render DATABASE_URL if needed (convert postgres:// to postgresql+psycopg://)
if [ -n "$DATABASE_URL" ]; then
    case "$DATABASE_URL" in
        postgres://*)
            export DATABASE_URL="postgresql+psycopg://${DATABASE_URL#postgres://}"
            ;;
        postgresql://*)
            export DATABASE_URL="postgresql+psycopg://${DATABASE_URL#postgresql://}"
            ;;
    esac
fi

# Optional database migration check
if [ -n "$DATABASE_URL" ]; then
    echo "Applying database migrations..."
    (cd /app/backend && alembic upgrade head) || echo "Notice: Database migrations could not be completed; continuing startup."
fi

# Function to handle termination signals cleanly
cleanup() {
    echo "Received termination signal. Shutting down PATHIQ services..."
    if [ -n "$FASTAPI_PID" ]; then
        kill -TERM "$FASTAPI_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill -TERM "$FRONTEND_PID" 2>/dev/null || true
    fi
    wait 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM

# 1. Start FastAPI backend in background on port 8000
echo "Starting FastAPI backend on 0.0.0.0:8000..."
cd /app/backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
FASTAPI_PID=$!

# 2. Wait for FastAPI to start and verify responsiveness
echo "Waiting for FastAPI to initialize on port 8000..."
MAX_RETRIES=60
COUNTER=0
while [ $COUNTER -lt $MAX_RETRIES ]; do
    if curl -s http://127.0.0.1:8000/api/v1/health >/dev/null 2>&1; then
        echo "FastAPI backend is ready on port 8000."
        break
    fi
    if ! kill -0 "$FASTAPI_PID" 2>/dev/null; then
        echo "Error: FastAPI process exited unexpectedly."
        exit 1
    fi
    sleep 1
    COUNTER=$((COUNTER + 1))
done

if [ $COUNTER -eq $MAX_RETRIES ]; then
    echo "Error: FastAPI health check timed out after ${MAX_RETRIES}s. Aborting."
    kill -TERM "$FASTAPI_PID" 2>/dev/null || true
    exit 1
fi

# 3. Start Next.js frontend in the foreground on ${PORT:-10000}
echo "Starting Next.js frontend on 0.0.0.0:${RENDER_PORT}..."
cd /app/frontend

npm run start -- --hostname 0.0.0.0 --port "${RENDER_PORT}" &
FRONTEND_PID=$!

# Wait for frontend process. If frontend exits, exit script.
wait "$FRONTEND_PID"
EXIT_CODE=$?

cleanup
exit $EXIT_CODE
