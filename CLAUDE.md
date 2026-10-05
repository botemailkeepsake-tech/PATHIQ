# CLAUDE.md: PATHIQ project rules

PATHIQ is a family-centric, evidence-grounded counselling system for vocational education in India (Smart India Hackathon, PS 26241). A student and a parent share one session; the system detects the parent's concerns, answers with sourced Evidence Cards, shows a progression ladder, supports agreement, and hands unresolved cases to a human counsellor.

Read `docs/SOLUTION.md` for the full vision and `docs/TASKS.md` for the current milestone. Work on ONE milestone at a time.

## Non-negotiable rules

1. **Never invent career facts.** Every factual statement (salary, placement, eligibility, rule, scheme) must come from a record in the knowledge base. If no valid record exists, return the abstention response and offer a counsellor. Never fill a gap from model memory.
2. **Every factual output carries source, date and geography level** (district / state / national). Use the fallback order district → state → national → counsellor → no answer. Always label the level shown.
3. **No opaque score.** There is no "decision score". Use the rule-based Readiness Checklist only.
4. **No winner in Agreement Mode.** The system never says the student or the parent is right and never pushes toward vocational education. If the evidence points to an academic path, it may say so neutrally.
5. **Demo or placeholder data is always labelled** "Demo / illustrative" in data and on screen. Never present placeholder numbers as verified.
6. **Privacy first.** No name or Aadhaar needed to run a session. Parental consent is captured before any session data is stored. Analytics are aggregated with small-cell suppression.
7. **Distress language escalates to a human immediately.** The AI does not handle it alone.
8. **Low-confidence concern classification asks the parent to confirm.** Never silently assume.
9. Expired, conflicting or withdrawn records never appear as current evidence.

## Stack

- Backend: Python 3.11+, FastAPI, SQLAlchemy + Alembic, PostgreSQL with pgvector, Redis
- Frontend: Next.js (TypeScript), PWA, i18n, large-button low-literacy UI
- AI: LLM with grounding constraints, embedding model, lightweight concern classifier, regional-language STT/TTS (behind adapter interfaces so providers can change)
- Infra: Docker Compose, JWT with role-based access (family, counsellor, admin)

## Repo layout

```
CLAUDE.md
README.md
.env.example
docs/        PRD, ARCHITECTURE, DATA_MODEL, AI_SPEC, KNOWLEDGE_BASE_SPEC, API_SPEC, UX_SPEC, SAFETY_PRIVACY, TEST_PLAN, TASKS, SOLUTION
data/seed/   knowledge records (JSON), validated against the schema
data/sources/ original source documents used by the records
evals/       labelled utterances, abstention cases, eval scripts
backend/     app/{api,services,rag,models,schemas,core} tests/
frontend/    app/ components/ i18n/ lib/
```

## Working agreements

- Start each task by reading the relevant doc in `docs/`. If a doc is ambiguous or missing, ask before inventing.
- Write tests first for: abstention, geography fallback, concern confirmation, consent gating, distress escalation.
- Do not change the schema without updating `docs/DATA_MODEL.md` and adding a migration.
- Do not change public API shapes without updating `docs/API_SPEC.md`.
- Keep prompts in `backend/app/rag/prompts/` as versioned files, not inline strings.
- Secrets only via environment variables; never commit `.env`.
- Commit after each milestone with a clear message.

## Commands (fill in as the scaffold lands)

```
docker compose up --build        # run everything
cd backend && pytest             # backend tests
cd backend && ruff check .       # lint
cd frontend && npm run dev       # frontend dev server
cd frontend && npm test          # frontend tests
python evals/run_evals.py        # concern + abstention + grounding evals
```

---

**Note**: This product was previously specified as SaarthiAI. The name was changed to PATHIQ in January 2025.
