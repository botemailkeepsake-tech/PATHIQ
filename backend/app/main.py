from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.evidence import router as evidence_router
from app.core.config import get_settings
from app.core.db import close_db
from app.core.logging import setup_logging

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    yield
    await close_db()


app = FastAPI(
    title="SaarthiAI API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"] if settings.app_env == "development" else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(evidence_router)


@app.get("/")
async def root():
    return {"message": "SaarthiAI API", "version": "0.1.0", "docs": "/docs"}
