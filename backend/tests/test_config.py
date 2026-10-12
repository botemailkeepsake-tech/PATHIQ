
from app.core.config import Settings


def test_settings_load_defaults():
    settings = Settings(_env_file=None, _env_file_encoding=None)
    assert settings.app_env == "development"
    assert settings.redis_url is None
    assert settings.concern_confirm_threshold == 0.70
    assert settings.session_retention_days == 30
    assert settings.small_cell_min == 10


def test_settings_validation():
    settings = Settings(_env_file=None, _env_file_encoding=None)
    assert 0.0 <= settings.concern_confirm_threshold <= 1.0
    assert settings.retrieval_top_k > 0
    assert settings.grounding_max_retries >= 0


def test_settings_production_requires_database_url():
    import os
    os.environ["APP_ENV"] = "production"
    os.environ["DATABASE_URL"] = "postgresql+psycopg://user:pass@prod-db:5432/db"
    os.environ["REDIS_URL"] = ""
    os.environ["JWT_SECRET"] = "test-secret"
    os.environ["APP_SECRET_KEY"] = "test-secret"
    try:
        settings = Settings(_env_file=None, _env_file_encoding=None)
        assert settings.app_env == "production"
        assert settings.database_url == "postgresql+psycopg://user:pass@prod-db:5432/db"
        assert settings.redis_url in (None, "")
    finally:
        os.environ.pop("APP_ENV", None)
        os.environ.pop("DATABASE_URL", None)
        os.environ.pop("REDIS_URL", None)
        os.environ.pop("JWT_SECRET", None)
        os.environ.pop("APP_SECRET_KEY", None)


def test_settings_docker_compose_defaults():
    import os
    os.environ["DATABASE_URL"] = "postgresql+psycopg://saarthi:saarthi@postgres:5432/saarthi"
    os.environ["REDIS_URL"] = "redis://redis:6379/0"
    try:
        settings = Settings(_env_file=None, _env_file_encoding=None)
        assert settings.database_url == "postgresql+psycopg://saarthi:saarthi@postgres:5432/saarthi"
        assert settings.redis_url == "redis://redis:6379/0"
    finally:
        os.environ.pop("DATABASE_URL", None)
        os.environ.pop("REDIS_URL", None)
