# PRD: PATHIQ

## 1. Summary

PATHIQ helps a student and a parent make a vocational-education decision together. It detects the parent's concerns, answers each with verified, sourced evidence, shows progression pathways, maps disagreement between student and parent, and escalates unresolved cases to a human counsellor.

**One-line pitch:** When a student's career choice becomes a family decision, PATHIQ gives both sides the evidence to decide together.

## 2. Problem

Vocational decisions in India are family decisions. Parents often fund, approve or veto the pathway. Career tools mostly serve the individual learner. Families lack a shared, trusted way to resolve different priorities using current, local, verifiable evidence.

## 3. Users

| User | Goal | Key needs |
|---|---|---|
| Student | Explore trades and express interest | Simple language, voice, relevant trades |
| Parent / guardian | Judge security, income, status, safety, future education | Verifiable evidence, local relevance, regional language, low-literacy UI |
| Counsellor | Take over unresolved cases efficiently | Full context, no repeated questions |
| Scheme administrator (Phase 3) | Understand demand-side objections by district | Anonymised aggregate insights |

## 4. Goals and non-goals

**Goals (MVP):** shared student-parent session; concern detection with confirmation; evidence cards with source, date and geography; progression ladder; agreement mode and family summary; counsellor handoff; consent and privacy basics.

**Non-goals (MVP):** automatic speaker diarization; retention monitoring; admin dashboard; enrolment or payment; guaranteeing jobs, salaries or admissions; deciding eligibility for institutions; a single decision score.

## 5. Scope tiers

| Tier | Features |
|---|---|
| Core | Shared Family Session; Concern Detection; Verified Evidence Engine; Progression Ladder; Counsellor Handoff |
| Supporting | Agreement Mode; Family Summary and Readiness Checklist; Consent and privacy controls |
| Phase 2 | Retention Monitor |
| Phase 3 | Policy Intelligence Dashboard |

## 6. User stories and acceptance criteria

### Shared session
- **US-1** As a family, we start one session and a parent consents before data is stored.
  - AC: no session data is written until consent is recorded; consent screen is in the chosen language.
- **US-2** As a participant, I mark who is speaking (Student / Parent).
  - AC: every message stores its speaker role; toggle is large and always visible.

### Concern detection
- **US-3** As a parent, my worries are recognised without me using specific terms.
  - AC: input is classified into job security, income, social perception, safety, degree foreclosure, or none (classifier output only; "none" is not persisted).
- **US-4** As a parent, I confirm or correct a low-confidence reading.
  - AC: below the confidence threshold the system asks a confirmation question; "no" corrects the label and logs a correction.

### Evidence
- **US-5** As a parent, I see a sourced answer to my concern.
  - AC: an Evidence Card shows claim, value, source, source type, published date, verified-on date, geography level, applicability and status.
- **US-6** As a parent, I am told when local data is unavailable.
  - AC: geography badge shows the level used; fallback follows district → state → national.
- **US-7** As a family, I am told when the system cannot verify something.
  - AC: with no valid record, the response is the abstention message and a counsellor option; no number is generated.

### Progression
- **US-8** As a parent, I see whether the degree door stays open.
  - AC: ladder shows steps from qualification to employment and further study; each transition opens eligibility, rule, source, date, geography and conditions; unverified routes are not shown as fact.

### Agreement
- **US-9** As a family with different preferences, we see priorities side by side.
  - AC: both preferences, each side's priorities, shared priorities and compatible pathways are shown; the system never declares a winner.
- **US-10** As a family, we take home a summary.
  - AC: Family Summary lists preferences, concerns, evidence reviewed, agreement, open issues, next verification step and counsellor contact; downloadable.
- **US-11** As a family, I see what remains unresolved.
  - AC: Readiness Checklist is rule-based and explains each status; no pass/fail label.

### Handoff and safety
- **US-12** As a family, I can talk to a human without repeating myself.
  - AC: handoff package contains profile fields, interests, concerns with status, evidence shown, questions asked, open issues and summary; separate consent for sharing.
- **US-13** As a distressed user, I get a human quickly.
  - AC: distress language triggers immediate escalation and a helpline pointer.

## 7. Languages

Pilot: Hindi, English, and the dominant regional language of the pilot state (set by configuration).

## 8. Success metrics

Parent confidence (pre/post); concern resolution rate; student-parent alignment; evidence trust; handoff completeness and quality; classifier precision, recall, F1; retrieval accuracy and source validity; data freshness; session completion; escalation rate. Impact is measured in a pilot, not claimed in advance.

## 9. Assumptions and risks

- Verified local data may be sparse: fallback hierarchy and abstention cover this.
- Regional-language quality varies: pilot with counsellor correction loop.
- Digital literacy varies: voice, large buttons, assisted kiosk.
- All external claims (rules, statistics, scheme details) must be verified before entering the knowledge base.
- **The repository contains template/seed data only. Production deployment requires sourcing and verifying real records. Placeholder data is always labelled "Demo / illustrative" and never presented as verified evidence.**

## 10. Definition of done (MVP)

All items in `docs/TEST_PLAN.md` section "Acceptance checklist" pass, and the 3-minute demo scenario in `docs/SOLUTION.md` runs end to end on seeded, sourced data.
