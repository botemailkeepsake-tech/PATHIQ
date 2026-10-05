
from app.core.config import Settings


def test_settings_load_defaults():
    settings = Settings()
    assert settings.app_env == "development"
    assert settings.database_url is not None
    assert settings.redis_url is not None
    assert settings.concern_confirm_threshold == 0.70
    assert settings.session_retention_days == 30
    assert settings.small_cell_min == 10


def test_settings_validation():
    settings = Settings()
    assert 0.0 <= settings.concern_confirm_threshold <= 1.0
    assert settings.retrieval_top_k > 0
    assert settings.grounding_max_retries >= 0
