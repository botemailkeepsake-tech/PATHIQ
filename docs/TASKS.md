# TASKS

Work one milestone at a time. Each task has an acceptance criterion (AC). Mark done only when the AC is met and tests pass. Commit after each milestone.

## M0: Scaffold
- [ ] T0.1 Repo structure, `docker-compose.yml` with api, web, postgres (pgvector), redis. AC: `docker compose up` starts all services.
- [ ] T0.2 FastAPI app with `/health`, config loading, structured logging. AC: `GET /api/v1/health` returns ok.
- [ ] T0.3 SQLAlchemy + Alembic, initial migration from `docs/DATA_MODEL.md`. AC: migration applies cleanly on empty DB.
- [ ] T0.4 Next.js app shell with i18n and PWA manifest. AC: loads on mobile viewport.
- [ ] T0.5 CI-style local scripts: lint, test. AC: commands in CLAUDE.md run.

## M1: Knowledge base and retrieval
- [ ] T1.1 Pydantic schema for records and the JSON validator. AC: placeholder template validates; records missing source or dates are rejected.
- [ ] T1.2 Ingestion pipeline per `docs/KNOWLEDGE_BASE_SPEC.md` section 6 with report. AC: report shows counts by topic, level, status, demo flag.
- [ ] T1.3 Embedding adapter and vector index. AC: similarity search returns expected records on a small fixture.
- [ ] T1.4 Retriever with filters, freshness filter, geography fallback. AC: must-pass tests 2 and 3.

## M2: Evidence Card and abstention (do before anything else AI-related)
- [ ] T2.1 Evidence Card builder and `GET /evidence`. AC: card contains all required fields; demo badge works.
- [ ] T2.2 Abstention path. AC: must-pass test 1.
- [ ] T2.3 Answer generation with `answer_v1` prompt and the LLM adapter. AC: answers cite record ids.
- [ ] T2.4 Grounding validator. AC: must-pass test 8.
- [ ] T2.5 Retrieval and grounding eval cases and scripts. AC: `evals/run_evals.py` prints retrieval and grounding metrics.

## M3: Session, consent and concern detection
- [ ] T3.1 Consent endpoints and gate. AC: must-pass tests 5 and 6.
- [ ] T3.2 Sessions, messages with speaker role. AC: role stored per message.
- [ ] T3.3 Concern classifier behind an interface; baseline implementation. AC: runs on `evals/concern_utterances.jsonl` and reports precision, recall, F1.
- [ ] T3.4 Confirmation flow and corrections log. AC: must-pass test 4.
- [ ] T3.5 Distress detection and escalation. AC: must-pass test 7.
- [ ] T3.6 Frontend: language, consent, Shared Session screen with toggle, concern panel. AC: a full parent-concern exchange works in the browser.

## M4: Progression Ladder
- [ ] T4.1 Progression edges ingestion and `GET /ladder`. AC: unverified edges are not returned as verified.
- [ ] T4.2 Ladder UI with tappable steps. AC: each step shows eligibility, rule, source, date, geography.

## M5: Agreement Mode and Family Summary
- [ ] T5.1 Preferences endpoints and priority vocabulary. AC: both roles can store preferences.
- [ ] T5.2 Agreement logic per `docs/AI_SPEC.md` section 7. AC: must-pass test 9.
- [ ] T5.3 Readiness Checklist rules. AC: each row explains its basis; no pass/fail text.
- [ ] T5.4 Family Summary generation and PDF download. AC: summary includes all required sections.
- [ ] T5.5 Frontend Screen 2 and Screen 3. AC: matches `docs/UX_SPEC.md`.

## M6: Counsellor handoff
- [ ] T6.1 Handoff package builder and endpoints. AC: package contains all required fields.
- [ ] T6.2 Escalation rules. AC: triggers in `docs/AI_SPEC.md` section 9 create handoffs.
- [ ] T6.3 Minimal counsellor console. AC: list, view, accept, complete.

## M7: Polish and demo
- [ ] T7.1 Load seed data (see the seeding prompt in the handoff notes). AC: ingestion report shows demo coverage per `docs/KNOWLEDGE_BASE_SPEC.md` section 4.
- [ ] T7.2 Localisation for pilot languages with reviewed strings. AC: no hard-coded UI text.
- [ ] T7.3 Demo script automation (Playwright). AC: the 8-step scenario passes.
- [ ] T7.4 README and setup instructions verified on a clean machine. AC: a new developer can run the demo.
- [ ] T7.5 Run the full acceptance checklist. AC: all items pass.

## Later (not in MVP)
- Phase 2: Retention Monitor
- Phase 3: Policy Intelligence Dashboard (aggregated, anonymised, small-cell suppression)
- Automatic speaker detection
- WhatsApp channel
