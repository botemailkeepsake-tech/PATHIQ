# PATHIQ Backend

## Development

```bash
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

## Testing

```bash
pytest
```

## Linting

```bash
ruff check .
```