# ARCHITECTURE

## 1. Overview

A web/PWA frontend talks to a FastAPI backend. The backend orchestrates a counselling engine (intent, concern detection, session state), a retrieval layer over a verified knowledge base in PostgreSQL + pgvector, and generators for Evidence Cards, the Progression Ladder, Agreement Mode and the Family Summary. Unresolved cases go to a counsellor through a handoff service.

```
Frontend (Next.js PWA)
   │  REST + SSE
   ▼
API layer (FastAPI) ── auth (JWT, roles) ── consent gate
   │
   ▼
Session service ── session state (Redis cache, Postgres source of truth)
   │
   ▼
Counselling engine
   ├─ Intent classifier
   ├─ Concern classifier (+ confirmation logic)
   ├─ Distress detector (rules + classifier)
   └─ Orchestrator
        │
        ▼
Retrieval layer ── geography fallback ── freshness filter (verified-only for families)
        │
        ▼
Knowledge base (Postgres + pgvector)
        │
        ▼
Generators: Evidence Card | Progression Ladder | Agreement Mode | Family Summary | Readiness Checklist
        │
        ├─► Response to family
        └─► Handoff service ─► Counsellor console
```

## 2. Key design decisions

| Decision | Choice | Reason |
|---|---|---|
| Fact source | Retrieval from approved knowledge base only | Prevents invented figures; enables source, date and geography display |
| LLM role | Language only: phrase and translate retrieved records; never the source of facts | Keeps grounding enforceable |
| Grounding enforcement | Generation receives only retrieved records; output validator checks every number and claim maps to a record id | Catches drift before it reaches the family |
| Speaker identity | Explicit toggle | Diarization is unreliable in noisy multilingual audio |
| Concern classifier | Small, interpretable (embedding + classifier, or prompt-based with calibrated confidence) | Explainable and evaluable |
| Readiness | Rule-based checklist | No false precision |
| State | Postgres is the source of truth; Redis caches active sessions | Durability plus speed |
| Providers | STT, TTS, LLM, embeddings behind adapter interfaces | Swap providers without rewrites |
| Handoff | Structured package generated from session records | No restart for family |
| Knowledge base content | **Architecture supports verified evidence; production records must be sourced and verified. Placeholder/demo data (`is_demo: true`) is never shown as verified.** | Prevents presenting unverified claims as facts |

## 3. Components

### 3.1 API layer (`backend/app/api`)
Routers for consent, sessions, messages, concerns, evidence, ladder, agreement, summary, handoff, counsellor, health. JWT with roles: `family` (session token), `counsellor`, `admin`.

### 3.2 Services (`backend/app/services`)
- `session_service`: create, speaker roles, state
- `consent_service`: capture, verify, gate
- `concern_service`: classify, confirm, correct, track status
- `evidence_service`: build Evidence Cards from records
- `ladder_service`: build ladder from progression records
- `agreement_service`: priorities, shared ground, compatible pathways
- `summary_service`: Family Summary and Readiness Checklist
- `handoff_service`: package, consent check, counsellor assignment
- `safety_service`: distress detection and escalation

### 3.3 RAG (`backend/app/rag`)
- `retriever.py`: hybrid retrieval (metadata filter by trade, topic, geography; vector similarity)
- `fallback.py`: district → state → national → none
- `freshness.py`: drops expired, withdrawn and conflicting records; **for family-facing retrieval, keeps only `status = verified`; flags `needs_review` for internal use only**
- `grounding.py`: validates generated text against records; abstains on failure
- `prompts/`: versioned prompt files

### 3.4 Frontend (`frontend/`)
Three screens (Shared Session, Evidence and Ladder, Agreement and Summary), a consent flow, a language selector, a counsellor console (minimal), and an i18n layer.

## 4. Data flow: a parent concern

1. Parent message arrives with speaker role `parent`.
2. Safety service checks distress; if triggered, escalate and stop.
3. Concern classifier returns label and confidence.
4. If confidence is below threshold, ask for confirmation; otherwise continue.
5. Retriever fetches records for (trade, concern topic) with the geography fallback.
6. Freshness filter removes unusable records.
7. If no usable record, return the abstention response and offer a counsellor.
8. Otherwise generate a phrased answer from the records; the grounding validator checks it.
9. Return the Evidence Card plus short answer; update concern status.

## 5. Deployment

Docker Compose for local and demo: `api`, `web`, `postgres` (pgvector), `redis`. HTTPS in any hosted environment. Environment variables per `.env.example`.

## 6. Non-functional requirements

- Latency target for a grounded answer: under 5 seconds on the demo setup
- Works on low-end phones (PWA, small bundles, large touch targets)
- Audit log for consent, handoff and record changes
- Observability: structured logs, request ids, no personal data in logs
