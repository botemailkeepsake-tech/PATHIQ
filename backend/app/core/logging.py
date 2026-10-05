import logging
import sys
from typing import Any

import structlog
from pythonjsonlogger import jsonlogger

from app.core.config import get_settings


def setup_logging() -> None:
    settings = get_settings()

    log_level = getattr(logging, settings.log_level.upper(), logging.INFO)

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.dev.set_exc_info,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(log_level),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(file=sys.stdout),
        cache_logger_on_first_use=True,
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        jsonlogger.JsonFormatter(
            fmt="%(timestamp)s %(level)s %(name)s %(message)s",
            rename_fields={"levelname": "level"},
        )
    )

    root_logger = logging.getLogger()
    root_logger.handlers = [handler]
    root_logger.setLevel(log_level)

    logging.getLogger("uvicorn.access").handlers = [handler]
    logging.getLogger("uvicorn.error").handlers = [handler]
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


def get_logger(name: str) -> structlog.BoundLogger:
    return structlog.get_logger(name)


class PrivacySafeLogger:
    def __init__(self, logger: structlog.BoundLogger):
        self._logger = logger

    def _sanitize(self, data: dict[str, Any]) -> dict[str, Any]:
        sensitive_keys = {
            "text",
            "message",
            "content",
            "body",
            "password",
            "secret",
            "token",
            "aadhaar",
            "phone",
            "email",
            "address",
            "name",
        }
        sanitized = {}
        for k, v in data.items():
            if any(sk in k.lower() for sk in sensitive_keys):
                sanitized[k] = "[REDACTED]"
            else:
                sanitized[k] = v
        return sanitized

    def info(self, event: str, **kwargs: Any) -> None:
        self._logger.info(event, **self._sanitize(kwargs))

    def warning(self, event: str, **kwargs: Any) -> None:
        self._logger.warning(event, **self._sanitize(kwargs))

    def error(self, event: str, **kwargs: Any) -> None:
        self._logger.error(event, **self._sanitize(kwargs))

    def debug(self, event: str, **kwargs: Any) -> None:
        self._logger.debug(event, **self._sanitize(kwargs))


def get_privacy_logger(name: str) -> PrivacySafeLogger:
    return PrivacySafeLogger(get_logger(name))
