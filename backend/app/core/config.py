from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_env: str = Field(default="development", validation_alias="APP_ENV")
    app_secret_key: str = Field(default="change-me", validation_alias="APP_SECRET_KEY")
    jwt_secret: str = Field(default="change-me", validation_alias="JWT_SECRET")
    session_retention_days: int = Field(default=30, validation_alias="SESSION_RETENTION_DAYS")

    # Database
    database_url: str = Field(
        default="postgresql+psycopg://saarthi:saarthi@postgres:5432/saarthi",
        validation_alias="DATABASE_URL",
    )
    redis_url: str = Field(default="redis://redis:6379/0", validation_alias="REDIS_URL")

    # AI Providers
    llm_provider: str | None = Field(default=None, validation_alias="LLM_PROVIDER")
    llm_api_key: str | None = Field(default=None, validation_alias="LLM_API_KEY")
    llm_model: str | None = Field(default=None, validation_alias="LLM_MODEL")
    embedding_provider: str | None = Field(default=None, validation_alias="EMBEDDING_PROVIDER")
    embedding_api_key: str | None = Field(default=None, validation_alias="EMBEDDING_API_KEY")
    embedding_model: str | None = Field(default=None, validation_alias="EMBEDDING_MODEL")
    stt_provider: str | None = Field(default=None, validation_alias="STT_PROVIDER")
    stt_api_key: str | None = Field(default=None, validation_alias="STT_API_KEY")
    tts_provider: str | None = Field(default=None, validation_alias="TTS_PROVIDER")
    tts_api_key: str | None = Field(default=None, validation_alias="TTS_API_KEY")

    # Behaviour
    concern_confirm_threshold: float = Field(
        default=0.70, validation_alias="CONCERN_CONFIRM_THRESHOLD"
    )
    retrieval_top_k: int = Field(default=3, validation_alias="RETRIEVAL_TOP_K")
    grounding_max_retries: int = Field(default=1, validation_alias="GROUNDING_MAX_RETRIES")
    small_cell_min: int = Field(default=10, validation_alias="SMALL_CELL_MIN")
    default_languages: list[str] = Field(
        default=["hi", "en"], validation_alias="DEFAULT_LANGUAGES"
    )
    pilot_region_language: str | None = Field(
        default=None, validation_alias="PILOT_REGION_LANGUAGE"
    )

    # Safety
    helpline_config_path: str = Field(
        default="config/helplines.json", validation_alias="HELPLINE_CONFIG_PATH"
    )

    # Frontend
    next_public_api_base: str = Field(
        default="http://localhost:8000/api/v1", validation_alias="NEXT_PUBLIC_API_BASE"
    )

    # Logging
    log_level: str = Field(default="INFO", validation_alias="LOG_LEVEL")


@lru_cache
def get_settings() -> Settings:
    return Settings()
