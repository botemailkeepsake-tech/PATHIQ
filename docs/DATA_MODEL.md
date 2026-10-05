# DATA MODEL

PostgreSQL with pgvector. UUID primary keys. All timestamps are timezone-aware UTC. No names, Aadhaar or contact details are required to run a session.

## Knowledge base

### `sources`
| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| title | text | Document or dataset title |
| authority | text | Issuing body |
| source_type | enum | official_notification, government_report, survey, institutional, other |
| url | text null | |
| document_ref | text null | Reference number or file name in `data/sources/` |
| published_date | date null | |
| retrieved_date | date | |

### `knowledge_records`
| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| topic | enum | job_security, income, social_perception, safety, degree_foreclosure, progression, scheme, provider, trade_profile, local_opportunity |
| trade | text null | e.g. electrician |
| claim | text | Plain-language claim |
| value | jsonb null | Number, range, unit, period |
| source_id | uuid fk | |
| geography_level | enum | district, state, national |
| geography_code | text | District or state code, `IN` for national |
| applicability | text | Conditions and eligibility notes |
| language_variants | jsonb | Translations of claim and applicability, reviewed flag |
| published_date | date null | |
| verified_date | date | |
| review_due | date | |
| status | enum | verified, needs_review, expired, conflicting, withdrawn |
| is_demo | boolean | True for illustrative data; must be shown as "Demo / illustrative" |
| embedding | vector | For retrieval |
| created_at, updated_at | timestamptz | |

Constraints: records with `status` in (expired, conflicting, withdrawn) are never returned to families. `is_demo = true` records always carry the demo label.

### `progression_edges`
| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| from_node | text | e.g. iti_electrician |
| to_node | text | e.g. diploma_year2 |
| record_id | uuid fk | Knowledge record that verifies this transition |
| eligibility | text | |
| conditions | text | |

## Sessions

### `sessions`
id, created_at, language, pilot_region, trade_of_interest, status (active, summarised, handed_off, closed), retention_until.

### `consents`
id, session_id, kind (session, counsellor_handoff, anonymised_research), granted (bool), consenter_role (parent, guardian), method (typed_confirmation, otp, counsellor_witnessed), timestamp, language_shown, version_of_text.

### `messages`
id, session_id, speaker_role (student, parent, system), text, language, created_at, safety_flag (none, distress).

### `concerns`
id, session_id, message_id, label (job_security, income, social_perception, safety, degree_foreclosure), confidence (0-1), confirmed (null, true, false), status (open, partly_resolved, resolved), resolved_by_evidence_ids (uuid[]), updated_at.

**Note:** The label `none` is a classifier output only and is **never persisted** in this table. If the classifier returns `none`, no concern row is created.

### `concern_corrections`
id, concern_id, original_label, corrected_label, created_at. Used for evaluation.

### `preferences`
id, session_id, role (student, parent), preferred_pathway, priorities (text[]), created_at.

### `evidence_shown`
id, session_id, record_id, shown_at, geography_level_shown, helpful_feedback (null, true, false).

### `summaries`
id, session_id, content (jsonb: preferences, concerns, evidence_ids, agreements, open_issues, next_step), readiness (jsonb checklist), generated_at.

## Handoff

### `counsellors`
id, display_name, languages (text[]), region, active.

### `handoffs`
id, session_id, counsellor_id null, reason (outside_knowledge, repeated_confusion, distress, unresolved_disagreement, requested, evidence_conflict, case_specific), package (jsonb), status (pending, accepted, completed), created_at, consent_id fk.

## Ops

### `audit_log`
id, actor_role, action, entity, entity_id, timestamp. No personal data.

### `evaluation_cases` (optional, or kept in `evals/`)
Labelled utterances and abstention cases; see `docs/TEST_PLAN.md`.

## Indexes

- `knowledge_records(topic, trade, geography_level, geography_code, status)`
- vector index on `knowledge_records.embedding`
- `messages(session_id, created_at)`
- `concerns(session_id, status)`

## Retention

`sessions.retention_until` is set at creation. A scheduled job deletes or anonymises sessions, messages, concerns and preferences after that date. Aggregate counts for analytics suppress any cell below a minimum size (configurable, default 10).
