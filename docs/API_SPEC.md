# API SPEC (v1)

Base path: `/api/v1`. JSON over HTTPS. Auth: session token (`family`) issued after consent; JWT for `counsellor` and `admin`. All error bodies: `{ "error": { "code": string, "message": string } }`.

## Consent and sessions

### POST `/consents/start`
Create a pending session and show consent text.
Request: `{ "language": "hi", "pilot_region": "XX", "district_code": "XX-01" }`
Response: `{ "session_id": "uuid", "consent_text": { "version": "v1", "text": "..." } }`

### POST `/consents/{session_id}/grant`
Request: `{ "kind": "session", "consenter_role": "parent | guardian", "method": "typed_confirmation" }`
Response: `{ "session_token": "...", "expires_at": "..." }`
Rule: no message endpoint works before a `session` consent is granted.

### POST `/consents/{session_id}/handoff-consent`
Request: `{ "granted": true }`. Required before sharing a handoff package.

## Messages and concerns

### POST `/sessions/{session_id}/messages`
Request: `{ "speaker_role": "student | parent", "text": "...", "language": "hi" }`
Response:
```json
{
  "message_id": "uuid",
  "safety": { "distress": false },
  "concerns": [{ "id": "uuid", "label": "job_security", "confidence": 0.82, "needs_confirmation": false }],
  "reply": {
    "kind": "answer | confirm | abstain | distress",
    "text": "...",
    "evidence_cards": [ { "$ref": "EvidenceCard" } ]
  },
  "escalation": { "suggested": false, "reason": null }
}
```

**Note:** The `concerns` array only contains persisted concern records. The classifier label `none` is never included here; if no concern is detected, the array is empty and the conversation continues normally.

### POST `/sessions/{session_id}/concerns/{concern_id}/confirm`
Request: `{ "confirmed": false, "corrected_label": "income" }`

### POST `/sessions/{session_id}/concerns/{concern_id}/status`
Request: `{ "status": "resolved" }` (values: open, partly_resolved, resolved)

## Evidence

### GET `/sessions/{session_id}/evidence?topic=job_security&trade=electrician`
Response: `{ "cards": [EvidenceCard], "geography_used": "state", "abstained": false }`

### EvidenceCard
```json
{
  "record_id": "uuid",
  "claim": "...",
  "value": { "text": "...", "numeric": null, "unit": null },
  "source": { "title": "...", "authority": "...", "type": "official_notification", "published_date": "YYYY-MM-DD", "reference": "..." },
  "verified_date": "YYYY-MM-DD",
  "geography": { "level": "state", "code": "XX", "label": "State-level figure; district-level data unavailable" },
  "applicability": "...",
  "status": "verified",
  "is_demo": false
}
```

**Note:** The `status` field in EvidenceCard is always `"verified"` for family-facing responses. Records with other statuses (`needs_review`, `expired`, `conflicting`, `withdrawn`) are never returned in this endpoint for family sessions.

## Progression ladder

### GET `/sessions/{session_id}/ladder?trade=electrician`
Response: `{ "nodes": [{ "id": "...", "label": "..." }], "edges": [{ "from": "...", "to": "...", "eligibility": "...", "conditions": "...", "evidence": EvidenceCard }] }`
Edges without a valid verifying record are omitted or returned with `"verified": false` and not displayed as fact.

## Agreement and summary

### PUT `/sessions/{session_id}/preferences/{role}`
Request: `{ "preferred_pathway": "...", "priorities": ["practical_work", "employment"] }` with role `student` or `parent`.

### GET `/sessions/{session_id}/agreement`
Response: `{ "student": {...}, "parent": {...}, "shared_priorities": [...], "pathways": [{ "name": "...", "matches": [...], "evidence": [EvidenceCard] }] }`

### POST `/sessions/{session_id}/summary`
Generates the Family Summary and Readiness Checklist.
Response: `{ "summary": {...}, "readiness": [{ "item": "...", "status": "Yes | Partly | No", "basis": "..." }], "download_url": "..." }`

### GET `/sessions/{session_id}/summary/download?format=pdf`

## Handoff and counsellor

### POST `/sessions/{session_id}/handoff`
Request: `{ "reason": "requested" }`
Response: `{ "handoff_id": "uuid", "status": "pending" }`. Fails with `consent_required` if handoff consent is missing.

### GET `/counsellor/handoffs?status=pending` (role: counsellor)
### GET `/counsellor/handoffs/{id}` returns the full package:
```json
{
  "profile": { "language": "...", "region": "...", "trade_of_interest": "..." },
  "student_interests": [...],
  "parent_concerns": [{ "label": "...", "status": "open" }],
  "evidence_shown": [EvidenceCard],
  "questions_asked": [...],
  "unresolved": [...],
  "summary": "..."
}
```
### POST `/counsellor/handoffs/{id}/accept` and `/complete`

## Ops

### GET `/health` returns `{ "status": "ok" }`
### POST `/admin/knowledge/ingest` (role: admin) runs the ingestion pipeline and returns the report.

## Conventions

- Language codes: BCP 47 (`hi`, `en`, regional code).
- IDs: UUID strings.
- Dates: ISO 8601.
- Streaming of replies (optional): Server-Sent Events at `/sessions/{id}/messages/stream`.
- Rate limiting and request size limits apply on all session endpoints.
