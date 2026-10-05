# KNOWLEDGE BASE SPEC

## 1. Purpose

The knowledge base is the only source of career facts the system may state. It must be small, accurate and traceable before it is large.

**Important distinction:** This specification describes the **architecture** for verified evidence. The repository currently contains **template and seed files only** (see `data/seed/`). Production factual claims require **verified knowledge-base records** that have been checked against cited source documents. Placeholder/demo records must never be presented as real verified evidence. Real records require source provenance and verification.

## 2. Record rules

1. One claim per record.
2. Every record links to a source with authority, type, and a document reference or URL.
3. Every record has a verified date, a review-due date and a status.
4. Geography level and code are mandatory.
5. Applicability and conditions must be written wherever eligibility depends on institution, state or notification.
6. Any figure that is not from a real source is `is_demo: true` and shown as "Demo / illustrative".
7. No record may contain a promise or guarantee.
8. Translations are stored per record and carry a `reviewed` flag; unreviewed translations are not shown to families in production mode.

## 3. File format (`data/seed/*.json`)

```json
{
  "id": "rec_example_001",
  "topic": "progression",
  "trade": "electrician",
  "claim": "PLACEHOLDER: plain-language claim goes here",
  "value": null,
  "source": {
    "title": "PLACEHOLDER: official document title",
    "authority": "PLACEHOLDER: issuing body",
    "source_type": "official_notification",
    "url": null,
    "document_ref": "data/sources/PLACEHOLDER.pdf",
    "published_date": null,
    "retrieved_date": "YYYY-MM-DD"
  },
  "geography": { "level": "state", "code": "PLACEHOLDER" },
  "applicability": "PLACEHOLDER: conditions, eligibility, exceptions",
  "language_variants": {
    "hi": { "claim": "", "applicability": "", "reviewed": false }
  },
  "verified_date": "YYYY-MM-DD",
  "review_due": "YYYY-MM-DD",
  "status": "needs_review",
  "is_demo": true
}
```

Replace every PLACEHOLDER and set `is_demo` to `false` only when the claim has been checked against the cited document.

## 4. Required seed coverage for the MVP demo

One trade (Electrician) and one pilot state. At least one verified or clearly labelled record for each:

| Topic | Needed for |
|---|---|
| job_security / local_opportunity | Job-security Evidence Card |
| income | Income Evidence Card |
| degree_foreclosure / progression | Progression Ladder (ITI to Diploma, Diploma to degree) |
| progression (credit transfer, academic equivalence) | Ladder transitions |
| safety | Safety Evidence Card (including conditions for women where relevant) |
| scheme | Scheme question in the demo |
| provider | Local training provider information |

At least one concern topic must intentionally have no state-level record, to demonstrate national fallback; at least one question must have no record, to demonstrate abstention.

## 5. Source registry

`data/sources/` holds the original documents. `data/sources/REGISTRY.md` lists each document with title, authority, retrieved date and the record ids that rely on it.

## 6. Ingestion pipeline

1. Validate each JSON against the schema (`backend/app/schemas/knowledge.py`).
2. Reject records missing source, dates, geography or applicability.
3. Reject `status: verified` records whose `review_due` is in the past.
4. Compute the embedding from claim plus applicability.
5. Upsert into `knowledge_records` and `sources`; write progression edges.
6. Print a report: counts by topic, geography level, status, and demo flag.

## 7. Review workflow

- A record moves to `verified` only after a second person checks it against the source document.
- A scheduled job flips records past `review_due` to `needs_review`.
- Conflicting records for the same claim and geography are both marked `conflicting` until a human resolves them.
- Withdrawn records are kept for audit but never shown.

## 8. Display rules

Evidence Card always shows: claim, value (if any), source title and authority, published date, verified-on date, geography level badge, applicability, status. If `is_demo`, show a visible "Demo / illustrative" badge. If geography level is not the family's district, show "State-level figure; district-level data unavailable" (or the national equivalent).

**Production retrieval rule:** For family-facing answers, only records with `status = verified` are retrieved and displayed. Records with `status = needs_review`, `expired`, `conflicting`, or `withdrawn` are excluded from family-facing retrieval. If no verified record is available, the system abstains and offers a counsellor. "Needs review" records may only be used for internal evaluation, admin workflows, testing, or explicitly labelled environments, and must be clearly labelled as such in those contexts.
