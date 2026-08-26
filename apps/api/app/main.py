from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import get_settings
from app.api.routes import charts, ai, readings, reading_v2, billing, astrologer_chat, tarot, transits, numerology, compatibility, guide, humandesign

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(charts.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(readings.router, prefix="/api")
app.include_router(reading_v2.router, prefix="/api")
app.include_router(billing.router, prefix="/api")
app.include_router(astrologer_chat.router, prefix="/api")
app.include_router(tarot.router, prefix="/api")
app.include_router(transits.router, prefix="/api")
app.include_router(numerology.router, prefix="/api")
app.include_router(compatibility.router, prefix="/api")
app.include_router(guide.router, prefix="/api")
app.include_router(humandesign.router, prefix="/api")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": settings.APP_VERSION}


@app.get("/")
async def root():
    result = {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }
    if settings.DEBUG:
        result["docs"] = "/docs"
    return result
