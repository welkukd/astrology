from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "Astrology API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    
    AI_PROVIDER: str = "gemini"
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://opencode.ai/zen/v1"
    OPENROUTER_MODEL: str = "mimo-v2.5-free"
    
    REDIS_URL: str = ""
    
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    RATE_LIMIT_REQUESTS: int = 60
    RATE_LIMIT_WINDOW: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    return Settings()