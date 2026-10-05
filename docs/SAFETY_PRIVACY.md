# SAFETY AND PRIVACY

## 1. Scope

PATHIQ handles minors' interests and parents' sentiment. Design follows data-minimisation and consent principles aligned with the Digital Personal Data Protection Act, 2023, and any institutional policy of the deploying organisation. This document sets engineering requirements; legal review is required before any real deployment.

## 2. Data minimisation

- No name, Aadhaar, phone number or address needed to run a session.
- Store only: language, region and district code, trade of interest, messages, concerns, preferences, summaries, consent records.
- Do not log message text in application logs; use ids only.
- Free-text messages are stored only after session consent.

## 3. Consent

| Consent | When | Notes |
|---|---|---|
| Session | Before any message is stored | Given by the parent or guardian; verifiable method per deployment (typed confirmation in the pilot demo; OTP or counsellor-witnessed in the field pilot) |
| Counsellor handoff | Before sharing the handoff package | Separate, optional |
| Anonymised research use | Optional | Separate, optional, off by default |

Requirements: plain-language text in the family's language with read-aloud; text version recorded with each consent; consent can be withdrawn and triggers deletion of session data; the system works without the optional consents.

## 4. Retention and deletion

- `retention_until` set at session creation (default 30 days, configurable).
- A scheduled job deletes or anonymises expired sessions.
- Withdrawal of consent deletes the session's messages, concerns and preferences immediately; the audit log keeps only a non-identifying event.

## 5. Access control

| Role | Access |
|---|---|
| family | Own session only, via session token |
| counsellor | Handoffs assigned or pending for their region, only with handoff consent |
| admin | Knowledge base management and aggregated analytics; no individual session text |

Encryption in transit (HTTPS) and at rest. Audit log for consent, handoff access and record changes.

## 6. Analytics

Aggregated only. Suppress any cell with fewer than N families (default 10). No individual-level data in dashboards or exports.

## 7. Distress and safety

- Detect distress or mention of self-harm or harm to others using reviewed per-language phrase lists plus optional classifier.
- On detection: halt normal flow, show calm DISTRESS message with a verified helpline, offer an immediate human, create a high-priority handoff if consent allows.
- Helpline numbers must be verified before use and stored in configuration with a verified date; never hard-coded from memory.
- The AI must not attempt counselling for distress itself.

## 8. Hallucination and misinformation controls

- Retrieval-only facts; grounding validator; abstention.
- **Only records with `status = verified` are used for family-facing production answers.** Stale, expired, conflicting, and withdrawn records are excluded. "Needs review" records must not silently appear as normal verified evidence; they are only used for internal evaluation, admin workflows, testing, or explicitly labelled environments.
- Demo data labelled everywhere.
- No promises of employment, salary or admission.

## 9. Bias and fairness

- No gender-stereotyped recommendations; safety information is presented as evidence and conditions, not as a reason to steer a daughter away from a trade.
- The system may state that an academic pathway fits the stated goals.
- Evaluate classification and answer quality across languages and dialects; log and review failures.

## 10. Incident handling

Define an owner and a process for: data exposure, a wrong factual record found live (withdraw immediately, review sessions that showed it), and a safety escalation failure.

## 11. Pre-deployment checklist

- [ ] Legal review of consent text and retention
- [ ] Helpline numbers verified and dated
- [ ] Distress phrase lists reviewed by native speakers
- [ ] Penetration or security review
- [ ] Counsellor training on handoff package
