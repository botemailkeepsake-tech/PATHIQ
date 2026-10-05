# SaarthiAI Implementation Audit

**Phase 0 — Codebase audit against finalized specifications**
Date: 2026-10-04 · Auditor: automated code audit · Scope: implementation vs. `docs/` source-of-truth

> **Note**: This audit was conducted when the product was named **SaarthiAI**. The product was renamed to **PATHIQ** in January 2025. This document retains the historical name for accuracy.

> **Headline finding:** This is a **pre-implementation (greenfield) repository.** The specification phase is complete and high quality, but **no implementation code exists**. `backend/` and `frontend/` are empty directories. There is no application, no database, no API, no UI, no tests, and no deployment configuration. The only non-documentation artifacts are a placeholder seed record, an empty source registry, two synthetic eval fixtures, and a config template.

---

## 1. Executive Status

**Overall implementation readiness: ~1%**

This is **not** an arbitrary average. The basis:

| Dimension | Readiness | Note |
|---|---|---|
| Specification / design | ~100% | 11 complete, internally consistent docs + master doc + README |
| Config scaffold | present | `.env.example` is complete and already honours several non-negotiables (see below) |
| Eval fixtures | ~15% | 2 of 4 fixture files exist, synthetic-only, no runner |
| Seed knowledge data | ~0% | one `_template.json` placeholder; **zero** real/verified records |
| **Runnable implementation (backend, DB, RAG, API, frontend, tests, Docker)** | **0%** | **nothing exists** |

The product's value is entirely in runnable behaviour (shared session, concern detection, verified-evidence retrieval, abstention, handoff). **None of that behaviour is implemented.** The non-zero fraction reflects only the config template and synthetic eval fixtures — assets that no code yet consumes. Treat this as "ready to begin M0", not "partially built".

**What is genuinely done well (counts toward project readiness, not implementation):**
- A complete, mutually consistent spec set. The hard safety rules (verified-only evidence, abstention, `none` never persisted, no winner, distress escalation, demo labelling) are specified clearly and repeatedly across PRD/ARCHITECTURE/AI_SPEC/KB_SPEC/API_SPEC/SAFETY_PRIVACY.
- `.env.example` already encodes config-first discipline: `CONCERN_CONFIRM_THRESHOLD=0.70` (configurable, not hardcoded), `SESSION_RETENTION_DAYS=30` (configurable), `SMALL_CELL_MIN=10`, and `HELPLINE_CONFIG_PATH` (helplines via config file, **not** hardcoded from memory). Providers (LLM/embedding/STT/TTS) are left blank behind adapter config, matching the "swap providers" architecture decision.
- Eval fixtures are structurally sound starters: all six concern labels present, multi-label and Hinglish cases, an explicitly ambiguous confirmation case, and `none` cases; abstention set covers no-record, promise/guarantee, case-specific escalation, neutral-comparison, and distress.

---

## 2. Requirement Matrix

Legend: **IMPLEMENTED · PARTIAL · MISSING · BROKEN · NON-COMPLIANT · PLACEHOLDER · UNVERIFIED**
"Code Location" = where the implementation would/should live. `(absent)` = directory/file does not exist.

### 2.1 Repository structure & assets
| Requirement | Spec | Code Location | Status | Evidence | Gap |
|---|---|---|---|---|---|
| Documentation set | README, CLAUDE.md | `docs/*`, `README.md` | IMPLEMENTED | All 11 docs + master doc present, consistent | — (this is spec, not code) |
| Config template | ARCH §5 | `.env.example` | IMPLEMENTED | All required vars present; threshold/retention/helpline configurable | No app reads it yet |
| Backend scaffold | TASKS M0 | `backend/` | MISSING | Directory empty | Everything |
| Frontend scaffold | TASKS M0 | `frontend/` | MISSING | Directory empty | Everything |
| Seed knowledge records | KB_SPEC §3–4 | `data/seed/*.json` | PLACEHOLDER | Only `_template.json`, all PLACEHOLDER, `status=needs_review`, `is_demo=true` | Real labelled/demo records; required-coverage set |
| Source registry | KB_SPEC §5 | `data/sources/REGISTRY.md` | PLACEHOLDER | Header-only table, "add rows as sources are collected" | Real sources + rows |
| Eval: concern utterances | TEST_PLAN §3 | `evals/concern_utterances.jsonl` | PLACEHOLDER | 25 synthetic utterances, well-labelled | Real reviewed utterances; no runner |
| Eval: abstention cases | TEST_PLAN §3 | `evals/abstention_cases.jsonl` | PLACEHOLDER | 8 synthetic cases, good taxonomy | No runner |
| Eval: retrieval/grounding cases | TEST_PLAN §3 | `evals/retrieval_cases.jsonl`, `grounding_cases.jsonl` | MISSING | Files do not exist (M2 deliverable) | Create in M2 |
| Eval runner | TASKS T2.5 | `evals/run_evals.py` | MISSING | Does not exist | Build |

### 2.2 Backend / services
| Requirement | Spec | Code Location | Status | Evidence | Gap |
|---|---|---|---|---|---|
| FastAPI app + `/health` | ARCH §3.1, TASKS T0.2 | `backend/app/main.py` | MISSING | No file | Build |
| Config loading + structured logging | ARCH §6, TASKS T0.2 | `backend/app/core/` | MISSING | No file | Build |
| JWT auth + RBAC (family/counsellor/admin) | ARCH §3.1, SAFETY §5 | `backend/app/core/auth` | MISSING | No file | Build |
| Consent service + gate | ARCH §3.2 | `backend/app/services/consent_service.py` | MISSING | No file | Build |
| Session service + speaker roles | ARCH §3.2 | `backend/app/services/session_service.py` | MISSING | No file | Build |
| Messages (speaker role stored) | DATA_MODEL, API | `backend/app/services`, models | MISSING | No file | Build |
| Concern classifier (interface + baseline) | AI_SPEC §3 | `backend/app/services/concern_service.py` | MISSING | No file | Build |
| Concern confirmation + corrections log | AI_SPEC §3, DATA_MODEL | same | MISSING | No file | Build |
| Evidence retrieval | AI_SPEC §4, ARCH §3.3 | `backend/app/rag/retriever.py` | MISSING | No file | Build |
| Evidence Card builder | API EvidenceCard | `backend/app/services/evidence_service.py` | MISSING | No file | Build |
| Progression ladder | API, DATA_MODEL | `backend/app/services/ladder_service.py` | MISSING | No file | Build |
| Agreement mode | AI_SPEC §7 | `backend/app/services/agreement_service.py` | MISSING | No file | Build |
| Readiness checklist (Yes/Partly/No) | AI_SPEC §8 | `backend/app/services/summary_service.py` | MISSING | No file | Build |
| Family summary + PDF | API, UX | same | MISSING | No file | Build |
| Handoff service + package | AI_SPEC §9, API | `backend/app/services/handoff_service.py` | MISSING | No file | Build |
| Escalation rules | AI_SPEC §9 | same / orchestrator | MISSING | No file | Build |
| Safety / distress service | AI_SPEC §10, SAFETY §7 | `backend/app/services/safety_service.py` | MISSING | No file | Build |

### 2.3 Database
| Requirement | Spec | Code Location | Status | Evidence | Gap |
|---|---|---|---|---|---|
| SQLAlchemy models | DATA_MODEL | `backend/app/models/` | MISSING | No file | Build all tables |
| Alembic migrations | TASKS T0.3 | `backend/alembic/` | MISSING | No file | Initial migration |
| pgvector enablement | ARCH, DATA_MODEL | migration | MISSING | No DB | Enable extension + vector col |
| Tables: sources, knowledge_records, progression_edges | DATA_MODEL | models | MISSING | — | Build |
| Tables: sessions, consents, messages, concerns, concern_corrections, preferences, evidence_shown, summaries | DATA_MODEL | models | MISSING | — | Build |
| Tables: counsellors, handoffs, audit_log | DATA_MODEL | models | MISSING | — | Build |
| Constraint: expired/conflicting/withdrawn never returned to families | DATA_MODEL, AI_SPEC §4 | retriever + query layer | MISSING | — | Enforce in code + test |
| Rule: concern `none` never persisted | DATA_MODEL, AI_SPEC §2 | concern_service | MISSING | — | Enforce + test 7 |
| Enum: `consenter_role = parent \| guardian` | DATA_MODEL `consents` | models | MISSING | — | Build with both values |
| Indexes (knowledge_records composite, vector, messages, concerns) | DATA_MODEL §Indexes | migration | MISSING | — | Build |
| Retention job (retention_until) | DATA_MODEL, SAFETY §4 | scheduled job | MISSING | — | Build |

### 2.4 Knowledge base / RAG (critical area)
| Requirement | Spec | Code Location | Status | Evidence | Gap |
|---|---|---|---|---|---|
| Pydantic record schema + JSON validator | KB_SPEC §6, TASKS T1.1 | `backend/app/schemas/knowledge.py` | MISSING | No file | Build; reject missing source/dates/geo |
| Ingestion pipeline + report | KB_SPEC §6, TASKS T1.2 | `backend/app/rag/ingest` | MISSING | No file | Build |
| Chunking / embedding adapter | ARCH §2, TASKS T1.3 | `backend/app/rag/embeddings` | MISSING | No file | Build behind adapter |
| Vector storage + similarity search | ARCH, TASKS T1.3 | pgvector + retriever | MISSING | No DB | Build |
| Retriever w/ metadata filters | AI_SPEC §4, TASKS T1.4 | `backend/app/rag/retriever.py` | MISSING | No file | Build |
| Geography fallback district→state→national | ARCH §3.3, AI_SPEC §4 | `backend/app/rag/fallback.py` | MISSING | No file | Build + test 2 |
| Freshness filter (drop expired/withdrawn/conflicting) | ARCH §3.3, AI_SPEC §4 | `backend/app/rag/freshness.py` | MISSING | No file | Build + test 3 |
| **Verified-only filter for families** | ARCH §3.3, AI_SPEC §4, KB_SPEC §8, SAFETY §8 | `freshness.py`/retriever | MISSING | No file | **Build + test 4 (see §7)** |
| Grounding validator | AI_SPEC §6, TASKS T2.4 | `backend/app/rag/grounding.py` | MISSING | No file | Build + test 9 |
| Versioned prompt `answer_v1.md` | AI_SPEC §5, CLAUDE.md | `backend/app/rag/prompts/answer_v1.md` | MISSING | No file | Build (prompt text drafted in AI_SPEC) |
| Source provenance preserved | KB_SPEC §2,5 | sources table + registry | PLACEHOLDER | Template has source block; registry empty | Real sources |
| Real verified records | KB_SPEC §4 | `data/seed/*.json` | MISSING | 0 verified records; 1 demo template | Human sourcing+verification |

### 2.5 AI layer
| Requirement | Spec | Code Location | Status | Evidence | Gap |
|---|---|---|---|---|---|
| Concern classifier impl (embeddings or prompted) | AI_SPEC §3 | concern_service | MISSING | No file | Build; evaluate on fixtures |
| Confidence + `CONCERN_CONFIRM_THRESHOLD=0.70` wiring | AI_SPEC §3 | config + service | PARTIAL | Threshold in `.env.example` only; no code reads it | Build service that reads config |
| `none` = classifier-output-only behaviour | AI_SPEC §2 | concern_service | MISSING | No file | Enforce + test 7 |
| Distress detection (rules + optional classifier) | AI_SPEC §10 | safety_service | MISSING | No file | Build + test 8 |
| Retrieval orchestration | ARCH §4 | orchestrator | MISSING | No file | Build |
| Answer generation + LLM adapter | AI_SPEC §5 | rag/generation + adapter | MISSING | No file | Build |
| Abstention path | AI_SPEC §4, TASKS T2.2 | orchestrator | MISSING | No file | Build + test 1 |
| Escalation | AI_SPEC §9 | orchestrator/handoff | MISSING | No file | Build |

### 2.6 API endpoints (all vs. API_SPEC)
| Endpoint | Spec | Status | Evidence |
|---|---|---|---|
| `POST /consents/start` | API_SPEC | MISSING | No router |
| `POST /consents/{id}/grant` | API_SPEC | MISSING | No router |
| `POST /consents/{id}/handoff-consent` | API_SPEC | MISSING | No router |
| `POST /sessions/{id}/messages` (+ SSE stream) | API_SPEC | MISSING | No router |
| `POST /sessions/{id}/concerns/{cid}/confirm` | API_SPEC | MISSING | No router |
| `POST /sessions/{id}/concerns/{cid}/status` | API_SPEC | MISSING | No router |
| `GET /sessions/{id}/evidence` | API_SPEC | MISSING | No router |
| `GET /sessions/{id}/ladder` | API_SPEC | MISSING | No router |
| `PUT /sessions/{id}/preferences/{role}` | API_SPEC | MISSING | No router |
| `GET /sessions/{id}/agreement` | API_SPEC | MISSING | No router |
| `POST /sessions/{id}/summary` + `GET …/download` | API_SPEC | MISSING | No router |
| `POST /sessions/{id}/handoff` | API_SPEC | MISSING | No router |
| `GET /counsellor/handoffs` + `/{id}` + accept/complete | API_SPEC | MISSING | No router |
| `GET /health` | API_SPEC | MISSING | No router |
| `POST /admin/knowledge/ingest` | API_SPEC | MISSING | No router |

### 2.7 Frontend (vs. UX_SPEC)
| Requirement | Spec | Status | Evidence |
|---|---|---|---|
| Next.js app shell + PWA manifest | TASKS T0.4 | MISSING | `frontend/` empty |
| i18n layer (`frontend/i18n/<lang>.json`) | UX §5 | MISSING | No file |
| Language selection | UX §2 | MISSING | No file |
| Consent screen (read-aloud, parent/guardian) | UX §3 | MISSING | No file |
| Screen 1: Shared Session (toggle, concerns panel) | UX §3 | MISSING | No file |
| Screen 2: Evidence + Progression Ladder | UX §3 | MISSING | No file |
| Screen 3: Agreement + Readiness + Summary | UX §3 | MISSING | No file |
| Required states (loading/abstain/fallback/distress/offline/consent-missing/voice-failed) | UX §4 | MISSING | No file |
| Counsellor console | UX §3 | MISSING | No file |

### 2.8 Safety / Privacy, Tests, Deployment
| Requirement | Spec | Status | Evidence |
|---|---|---|---|
| Session/handoff/research consent capture + gate | SAFETY §3 | MISSING | No code |
| Data minimisation (no PII; ids-only logs) | SAFETY §2 | MISSING | No code |
| Retention + deletion-on-withdrawal | SAFETY §4 | MISSING | No code |
| Access control by role | SAFETY §5 | MISSING | No code |
| Encryption/HTTPS config | SAFETY §5 | MISSING | No deploy config |
| Helpline config (verified, not hardcoded) | SAFETY §7 | PARTIAL | `HELPLINE_CONFIG_PATH` in env; `config/helplines.json` absent |
| Small-cell suppression analytics | SAFETY §6 | MISSING | No code (`SMALL_CELL_MIN=10` in env) |
| Must-pass tests 1–11 | TEST_PLAN §2 | MISSING | No test suite |
| Unit/integration/e2e harnesses | TEST_PLAN §1 | MISSING | No pytest/vitest/Playwright |
| `docker-compose.yml` (api/web/postgres/redis) | ARCH §5, TASKS T0.1 | MISSING | No file |
| Dockerfiles | ARCH §5 | MISSING | No file |
| Health checks / migrations on startup | TASKS M0 | MISSING | No file |

---

## 3. Critical Blockers

These prevent the core MVP from functioning at all. In a greenfield repo, "blocker" = foundational prerequisite with nothing downstream possible without it.

1. **No application scaffold (M0).** No FastAPI app, no Next.js app, no `docker-compose.yml`. Nothing can run. Every other feature is blocked on this.
2. **No database layer.** No SQLAlchemy models, no Alembic migrations, no pgvector. Sessions, consent, messages, concerns, knowledge records — none can be persisted or retrieved.
3. **No knowledge base / retrieval.** No schema, ingestion, embeddings, retriever, fallback, or freshness filter. The core promise ("verified, sourced evidence") cannot be delivered.
4. **No safety core.** No verified-only filter, no abstention, no grounding validator, no distress detection, no consent gate. Per CLAUDE.md and TASKS these must exist **before any LLM is connected**; today none do.
5. **No verified knowledge records.** Only a single placeholder (`is_demo=true`, `status=needs_review`). Even once code exists, there is nothing truthful to show a family. (This is a human sourcing+verification task, not a coding task — keep it off the code critical path by seeding clearly-labelled demo records.)

---

## 4. High Priority Issues

- **No tests exist** despite CLAUDE.md mandating tests-first for abstention, geography fallback, concern confirmation, consent gating, distress escalation. The 11 must-pass tests in TEST_PLAN §2 are entirely unwritten.
- **No eval runner** (`evals/run_evals.py`); fixtures exist but cannot be executed. Two of four fixture files (retrieval, grounding) are not yet created.
- **No prompt files** under `backend/app/rag/prompts/` (CLAUDE.md requires versioned prompt files, not inline strings). The `answer_v1` text is drafted in AI_SPEC §5 but not materialised.
- **No `config/helplines.json`** — distress escalation cannot point to a verified helpline until this exists (and SAFETY §7 forbids hardcoding).
- **No i18n string files** — UX_SPEC §5 forbids hard-coded UI text, so the frontend cannot be built compliantly without the i18n layer first.

---

## 5. Medium / Low Priority Issues

- **Dangling doc reference (low):** `docs/TASKS.md` T7.1 says "see the seeding prompt in the handoff notes," but no "handoff notes" file exists in the repo. This will block the seeding task later unless the prompt is supplied. *(Not fixed in this phase — flagged only.)*
- **Trivial:** template id is `rec_template_001` while KB_SPEC §3 example uses `rec_example_001`; cosmetic only.
- **Seed/record format vs. DB schema:** the JSON file format (nested `source`/`geography`) intentionally differs from the normalised DB tables (`sources` + flattened columns). This is correct by design (ingestion maps file→tables), but the mapping is unimplemented — note it so ingestion is written to the file format in KB_SPEC §3, not the DB shape.
- **No `.gitignore` and not a git repository.** CLAUDE.md expects commits after each milestone; version control should be initialised before M0 work lands.

---

## 6. Security / Safety Findings

No code exists, so there are **no live vulnerabilities** — but equally **none of the required safety controls are implemented**. The risk is entirely prospective and must be built before any family-facing path or LLM is wired.

- **Consent gate (not implemented):** API_SPEC and SAFETY §3 require that no message endpoint works before `session` consent. Must be enforced server-side and tested (test 6) before messages are accepted.
- **Handoff consent (not implemented):** separate consent required before sharing a package (test 7).
- **Distress escalation (not implemented):** must halt flow, show DISTRESS message, use a **verified** helpline from config, create high-priority handoff if consent allows (test 8). No helpline config file exists yet.
- **PII minimisation / log hygiene (not implemented):** SAFETY §2 forbids logging message text; structured logging must use ids only. Build this into the logging config from day one.
- **AuthZ (not implemented):** family→own session only; counsellor→region + handoff-consent; admin→no session text. Must be enforced per-route.
- **Secrets:** `.env.example` correctly uses placeholders (`change-me`) and env-only secrets; no secrets are committed. Good. Ensure `.env` is gitignored once git is initialised.
- **Positive:** config design already avoids the two classic traps — the confirmation threshold is config-driven (not hardcoded) and the helpline is a config path (not a memorised number).

---

## 7. RAG / Evidence Findings

Direct answers to the required questions:

- **Is verified-only filtering actually enforced?** **No — unimplemented.** The rule is specified in four places (ARCHITECTURE §3.3, AI_SPEC §4, KB_SPEC §8, SAFETY §8) and the DB constraint is described (DATA_MODEL), but there is no retriever, no freshness filter, and no query layer. Nothing enforces it today.
- **Can unverified evidence reach the family UI?** **Not currently — because there is no UI and no retrieval path at all.** However, there is also **no implemented guard**, and the *only* seed record is `status=needs_review, is_demo=true`. So the first implementation MUST land the verified-only filter (and demo labelling) **before** any family-facing retrieval is wired, or that non-verified demo record would be the first thing surfaced. This is the single most important invariant to test first (must-pass test 4).
- **Is provenance preserved?** **Defined but absent.** The schema (sources table, record→source FK) and registry format exist; the template carries a `source` block. But `REGISTRY.md` is empty and there are zero real records, so no provenance is actually present. Ingestion must reject records missing source/dates (KB_SPEC §6).
- **Is geography applied?** **No — unimplemented.** The district→state→national fallback with level labelling is fully specified (AI_SPEC §4, API EvidenceCard `geography.label`) but there is no `fallback.py`. The template has `geography.level=state, code=PLACEHOLDER`.
- **Is freshness applied?** **No — unimplemented.** `review_due`/status flips and exclusion of expired/withdrawn/conflicting are specified (KB_SPEC §7) but there is no `freshness.py` and no scheduled job.
- **Can the model hallucinate unsupported career claims?** **No model is wired in, so there is no live hallucination today — but every control that would prevent it is missing.** There is no retrieval-only enforcement, no grounding validator (AI_SPEC §6), and no abstention path. These three controls must exist and be tested (tests 1 and 9) **before** any LLM adapter is connected. Until then, do not connect a generation model.

---

## 8. End-to-End Journey

Not runnable — no services exist. Every stage is unimplemented.

```
Understand   [MISSING]  no session/message/concern-classifier code
Explain      [MISSING]  no answer generation / LLM adapter
Prove        [MISSING]  no retrieval, no Evidence Card, no verified-only filter
Compare      [MISSING]  no ladder, no agreement mode
Decide       [MISSING]  no readiness checklist, no family summary
Hand off     [MISSING]  no handoff package, no counsellor console, no escalation
```

The smallest meaningful journey (start services → migrate → load demo → create session → send messages → detect/confirm concern → retrieve/display evidence → ladder → agreement → readiness → summary → handoff) could not be attempted: there is no `docker-compose.yml`, no app entrypoint, and no database. **0 of 16 journey steps are executable.**

---

## 9. Test Results

No test suite exists. I searched for `pytest`/`vitest`/Playwright config, test files, and `evals/run_evals.py`; none are present.

| Metric | Count |
|---|---|
| Passed | 0 |
| Failed | 0 |
| Skipped | 0 |
| Tests present | 0 |
| Must-pass tests (TEST_PLAN §2) implemented | 0 / 11 |

**Missing coverage = all of it.** The 11 must-pass tests (abstention, geography fallback, expired/conflicting rejection, needs_review rejection, confirmation, consent gate, handoff consent, distress, grounding, neutrality, demo label) and all eval metrics are unwritten. Per CLAUDE.md these safety tests should be written **first**.

---

## 10. Recommended Implementation Sequence

Based on the **actual** state (greenfield), not a blind repeat of TASKS.md. The TASKS.md ordering is sound; the key refinements are (a) initialise version control first, (b) write the safety must-pass tests before the code they guard (TDD per CLAUDE.md), and (c) keep real-record sourcing off the code critical path by using clearly-labelled demo records.

1. **Pre-M0:** `git init`, add `.gitignore` (ignore `.env`, `__pycache__`, `node_modules`, `.next`). Commit the current spec baseline.
2. **M0 — Scaffold:** `docker-compose.yml` (api/web/postgres-pgvector/redis), FastAPI app + `/api/v1/health` + config loader + structured logging (ids-only), Next.js shell + PWA manifest + i18n skeleton. **AC:** `docker compose up` healthy; health endpoint ok.
3. **M0.5 — DB foundation:** SQLAlchemy models for all DATA_MODEL tables + enums (incl. `consenter_role = parent|guardian`), Alembic initial migration, enable pgvector, add indexes. **AC:** migration applies on empty DB.
4. **Write safety tests first (TDD):** encode must-pass tests 1–4 (abstention, geography fallback, expired/conflicting rejection, needs_review rejection) and 6 (consent gate) as failing tests before M1/M2 code.
5. **M1 — Knowledge base + retrieval:** record Pydantic schema + validator, ingestion pipeline + report, embedding adapter + vector index, retriever with filters, **`freshness.py` (verified-only) and `fallback.py` (geography)**. Seed with clearly-labelled **demo** records covering the KB_SPEC §4 matrix (one topic with no state record for fallback; one with no record for abstention). **AC:** must-pass tests 2, 3, 4 pass.
6. **M2 — Evidence Card + abstention + grounding (before any other AI):** Evidence Card builder + `GET /evidence`, abstention path, `answer_v1.md` prompt + LLM adapter, **grounding validator**, eval runner + retrieval/grounding fixtures. **AC:** must-pass tests 1, 9 pass; `evals/run_evals.py` prints metrics. **Only connect the LLM once grounding + abstention pass.**
7. **M3 — Session, consent, concern detection:** consent endpoints + gate, sessions/messages with speaker role, concern classifier (evaluated on fixtures), confirmation + corrections, distress + escalation, Screen 1 frontend. **AC:** tests 5, 6, 7, 8 pass; `none` never persisted (test 7-data-model).
8. **M4 — Progression Ladder:** edges ingestion + `GET /ladder` (unverified edges not shown as fact) + ladder UI.
9. **M5 — Agreement Mode + Family Summary:** preferences, agreement logic (no winner), readiness checklist (Yes/Partly/No), summary + PDF, Screens 2 & 3. **AC:** tests 9/10 (neutrality), readiness enum.
10. **M6 — Counsellor handoff:** package builder + endpoints, escalation rules, minimal console.
11. **M7 — Polish/demo:** real verified records (human verification loop), reviewed localisation, Playwright demo, clean-machine README verification, full acceptance checklist.

**Parallel, non-code track (start now):** source and verify real knowledge records + populate `data/sources/REGISTRY.md`; verify helpline numbers → `config/helplines.json`; native-speaker review of distress phrase lists and i18n strings. These gate the pilot, not the build.

---

## 11. Files That Should Be Created in the Next Phase

(Everything is net-new; none of these exist yet.)

**Repo root / infra**
- `.gitignore`, `docker-compose.yml`
- `backend/Dockerfile`, `frontend/Dockerfile`
- `config/helplines.json` (verified numbers, with verified date)

**Backend (`backend/`)**
- `pyproject.toml` / `requirements.txt`, `ruff` config
- `app/main.py`, `app/core/config.py`, `app/core/logging.py`, `app/core/auth.py`, `app/core/db.py`
- `app/models/*.py` (all DATA_MODEL tables), `alembic.ini`, `alembic/versions/0001_initial.py`
- `app/schemas/knowledge.py`, `app/schemas/*.py` (request/response per API_SPEC)
- `app/rag/retriever.py`, `fallback.py`, `freshness.py`, `grounding.py`, `embeddings.py`, `ingest.py`
- `app/rag/prompts/answer_v1.md`
- `app/services/{consent,session,concern,evidence,ladder,agreement,summary,handoff,safety}_service.py`
- `app/api/{health,consents,sessions,messages,concerns,evidence,ladder,agreement,summary,handoff,counsellor,admin}.py`
- `tests/` (must-pass tests 1–11 + unit/integration)

**Frontend (`frontend/`)**
- Next.js app (`app/`, `components/`, `lib/`), `package.json`, PWA manifest
- `i18n/hi.json`, `i18n/en.json`, `i18n/<regional>.json`
- Screens 1–3, consent flow, language selector, counsellor console
- `tests/` (vitest) + Playwright demo spec

**Data / evals**
- `data/seed/*.json` (demo records per KB_SPEC §4), populated `data/sources/REGISTRY.md`
- `evals/run_evals.py`, `evals/retrieval_cases.jsonl`, `evals/grounding_cases.jsonl`

---

## Audit scope note

No files were modified in this phase except the creation of this report. No specification files were changed. No fake verified evidence was created. Classifications reflect verified file contents, not comments, filenames, or README claims. Nothing was run because no runnable artifact (test suite, services, migrations) exists.
