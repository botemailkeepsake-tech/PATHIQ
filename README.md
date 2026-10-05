# PATHIQ

> **When a student's career choice becomes a family decision, PATHIQ gives both sides the evidence to decide together.**

A family-centric, evidence-grounded AI counselling system for vocational education in India. A student and a parent share one session; the system detects the parent's concerns, answers each with a sourced Evidence Card, shows a progression ladder, supports agreement between student and parent, and hands unresolved cases to a human counsellor with full context.

Built for Smart India Hackathon, Problem Statement 26241.

## Principles

- No unsourced facts: every figure shows source, date and geography level.
- If the system cannot verify something, it says so and offers a counsellor.
- Neutral: it supports an informed decision and never pushes a pathway.
- Privacy first: parental consent, data minimisation, anonymised analytics.

## Documentation

| Doc | Purpose |
|---|---|
| `docs/SOLUTION.md` | Full solution and pitch |
| `docs/PRD.md` | Product requirements |
| `docs/ARCHITECTURE.md` | System design |
| `docs/DATA_MODEL.md` | Database schema |
| `docs/AI_SPEC.md` | Concern detection, retrieval, grounding, prompts |
| `docs/KNOWLEDGE_BASE_SPEC.md` | Record format and review rules |
| `docs/API_SPEC.md` | Endpoints |
| `docs/UX_SPEC.md` | Screens and states |
| `docs/SAFETY_PRIVACY.md` | Consent, privacy, safety |
| `docs/TEST_PLAN.md` | Tests and evals |
| `docs/TASKS.md` | Milestones and tasks |

## Quick start (after M0)

```
cp .env.example .env     # fill in provider keys
docker compose up --build
```

Frontend: http://localhost:3000  
API docs: http://localhost:8000/docs

## Demo data

The knowledge base ships with a **template only** (`data/seed/`). The architecture supports verified evidence, but **production factual claims require verified knowledge-base records** that have been checked against cited source documents. Placeholder/demo records (`is_demo: true`) must never be presented as real verified evidence and are always labelled "Demo / illustrative". Real records require source provenance and verification before entering the knowledge base.

## Status

See `docs/TASKS.md` for the current milestone.

---

**Note**: This product was previously specified as SaarthiAI. The name was changed to PATHIQ in January 2025. Historical documents may reference the former name.
