# SAARTHIAI — MASTER PROJECT DOCUMENT
## Complete A–Z Project Specification, Research, Solution, Technology, Demo & SIH Guide

**Project:** SaarthiAI (renamed to **PATHIQ** in January 2025)  
**Smart India Hackathon Problem Statement:** 26241  
**Positioning:** Family-centric, evidence-grounded AI counselling for vocational education in India

> **Core tagline:**  
> **When a student's career choice becomes a family decision, PATHIQ gives both sides the evidence to decide together.**

---

> **Note**: This document was authored when the product was named **SaarthiAI**. The product was renamed to **PATHIQ** in January 2025. This master document retains the historical name for accuracy of the original project records.

---

# 0. DOCUMENT PURPOSE

This is the **master reference document** for SaarthiAI.

It consolidates the final project direction into one place so that the team can use it for:

- SIH problem understanding
- Research documentation
- Solution explanation
- Product development
- AI/ML implementation
- Database/backend planning
- Frontend planning
- Prototype development
- Demo preparation
- Judge questions
- PPT preparation
- Testing
- Pilot planning
- Future roadmap

### Important evidence rule

This document distinguishes between:

1. **Final project decisions** — what SaarthiAI is designed to do.
2. **Research to be validated** — hypotheses or observations that must be tested.
3. **Official information that must be verified** — government rules, statistics, eligibility, salaries, placement figures, etc.

The project must never turn an unverified assumption into a factual Evidence Card.

---

# 1. PROJECT AT A GLANCE

## 1.1 What is SaarthiAI?

SaarthiAI is a **family decision-support and AI counselling system** for vocational education.

It is designed around a simple observation:

> A student's career decision is often also a family decision.

A student may want a vocational route such as ITI or another skill pathway, while a parent may prefer a diploma or conventional degree.

The disagreement may come from concerns about:

- employment
- income
- safety
- social perception
- future education
- local opportunities

SaarthiAI does not tell the family what to choose.

Instead, it helps the family:

**Understand → Explain → Prove → Compare → Decide → Hand off**

---

# 2. THE CORE PROBLEM

## 2.1 Problem statement

A student may be interested in vocational education while a parent prefers an academic route.

Typical questions from parents include:

- Will my child get a stable job?
- Is the income enough?
- What happens if the company closes?
- What will relatives say?
- Is the work safe?
- Can my child still study for a diploma or degree?
- Are there opportunities locally?

The issue is therefore not simply:

> "Students do not have career information."

The deeper issue is:

> **Reliable career information may exist, but families lack a simple, shared, evidence-based way to turn it into a joint decision.**

This makes SaarthiAI a **multi-stakeholder decision-support problem**, not only an information-retrieval problem.

---

# 3. WHO ARE THE USERS?

## 3.1 Primary users

### Student

The student wants to understand:

- suitable vocational pathways
- trade options
- personal interests
- possible jobs
- further education
- career progression

### Parent/Guardian

The parent wants evidence about:

- job security
- income
- safety
- social acceptance
- future education
- local opportunity

### Family

The family needs:

- a shared understanding
- comparison of pathways
- unresolved concerns
- a practical next step

## 3.2 Secondary user

### Counsellor

The counsellor handles:

- unresolved questions
- sensitive cases
- conflicting evidence
- case-specific eligibility
- persistent disagreement
- situations where AI should not make the decision

## 3.3 Future user

### Administrator / Policy stakeholder

The future dashboard can provide:

- aggregated concerns
- district-level patterns
- rejected/accepted trade patterns
- unresolved barriers
- demand versus training capacity

No individual family should be exposed through this analytics layer.

---

# 4. THE CENTRAL INSIGHT

The project should not be positioned as:

> "We made an AI career chatbot."

That description is too generic.

The real product is:

> **A family-level, concern-specific, evidence-grounded decision-support system with a designed human handoff.**

The important chain is:

```text
Parent Concern
      ↓
Concern Classification
      ↓
Verified Evidence
      ↓
Progression / Options
      ↓
Student + Parent Comparison
      ↓
Family Summary
      ↓
Human Counsellor if needed
```

---

# 5. RESEARCH FOUNDATION

## 5.1 Research principle

SaarthiAI should not invent research findings.

The project has a research plan to determine:

- which concerns are actually common
- which sources families trust
- what information is difficult to verify
- where student-parent disagreement occurs
- what information changes confidence
- which cases require humans

No percentage should be presented as a measured finding until the team actually collects and analyses the data.

---

# 6. FIELD VALIDATION PLAN

## 6.1 Participants

The proposed validation should include:

| Participant | Target |
|---|---:|
| Students | 50–100 |
| Parents/guardians | 30–50 |
| ITI / skill-centre instructors | 10–15 |
| Career counsellors | 10–15 |
| Skill centres / ITIs | At least 2 |

These are **research targets**, not completed findings.

## 6.2 Research questions

1. What stops parents from supporting vocational pathways?
2. Which concerns are most frequent?
3. Which information sources do families trust?
4. Where do families struggle to verify career claims?
5. Where do student and parent priorities differ?
6. Which information changes understanding or confidence?
7. Which questions need a human counsellor?

---

# 7. RESEARCH → PRODUCT MAPPING

The most important design relationship is:

| Research observation to validate | Product response |
|---|---|
| Parents worry about employment | Job-security Evidence Card |
| Parents question income | Earnings Evidence Card |
| Parents doubt future education | Progression Ladder |
| Student and parent priorities differ | Agreement Mode |
| Local information is difficult to verify | Geography-aware evidence retrieval |
| Questions go beyond verified information | Human escalation |
| Families distrust unsourced claims | Source + date + geography |
| Low digital literacy | Voice + large-button interface |
| Regional language matters | Regional-language support |

This prevents SaarthiAI from becoming a random collection of AI features.

---

# 8. RESEARCH HYPOTHESES

The project should test measurable hypotheses.

## H1 — Parent confidence

**Hypothesis:** Source-backed counselling increases parent confidence in evaluating vocational pathways.

**Measurement:**

5-point confidence survey before and after the session.

---

## H2 — Concern resolution

**Hypothesis:** Evidence Cards resolve a measurable share of identified concerns.

**Measurement:**

Each concern is marked:

- Unresolved
- Partly resolved
- Resolved

---

## H3 — Family alignment

**Hypothesis:** Structured comparison increases aligned or partly aligned outcomes.

**Measurement:**

Agreement Mode outcome:

- Aligned
- Partly aligned
- Unresolved

---

## H4 — Counsellor efficiency

**Hypothesis:** A structured warm handoff reduces repeated questioning and gives counsellors better context.

**Measurement:**

- Counsellor completeness rating
- Time-to-understand
- Repeated-question frequency

---

## H5 — Evidence trust

**Hypothesis:** Showing source, date and geography increases trust.

**Measurement:**

Post-session evidence-trust score.

---

# 9. EXISTING LANDSCAPE

SaarthiAI must not make unsupported claims such as:

> "No existing platform does this."

Instead, the team should verify existing government and career platforms and compare capabilities.

The comparison should examine:

- Primary user
- Parent participation
- Shared family session
- Career information
- Concern detection
- Source transparency
- Local information
- Progression information
- Family disagreement support
- Human counselling
- Scalability

## Differentiation

The intended differentiation is:

> **Family-level + concern-specific + evidence-grounded + human-supported.**

---

# 10. SAARTHIAI JOURNEY

The complete journey is:

## 10.1 Understand

Understand:

- student goal
- parent concern
- career context
- language
- session state

## 10.2 Explain

Explain the concern in the family's language.

## 10.3 Prove

Provide source-backed evidence.

## 10.4 Compare

Compare student and parent priorities.

## 10.5 Decide

Help the family identify agreement and unresolved barriers.

## 10.6 Hand off

Escalate when evidence or AI capability is insufficient.

---

# 11. MVP DEFINITION

The MVP should remain focused.

## Core capabilities

1. Shared Family Session
2. Parent Concern Detection
3. Verified Evidence Engine
4. Progression Ladder
5. Human Counsellor Handoff

## Supporting MVP capabilities

6. Agreement Mode
7. Family Summary
8. Readiness Checklist
9. Consent and privacy controls

## Future roadmap

10. Retention Monitor
11. Policy Intelligence Dashboard

### Important development rule

Only call a capability **"built"** in a presentation if the actual prototype can demonstrate it.

Otherwise use:

- Prototype scope
- Planned MVP
- Target implementation

---

# 12. SHARED FAMILY SESSION

## 12.1 Three views

### Student View

Shows:

- interests
- preferred trades
- aptitude/preferences
- aspirations

### Parent View

Shows:

- concerns
- evidence
- income information
- employment information
- safety information
- progression options

### Family View

Shows:

- side-by-side pathways
- shared priorities
- resolved concerns
- unresolved concerns
- next action
- Family Summary

---

# 13. SPEAKER IDENTIFICATION

Automatic speaker diarization can be unreliable in:

- noisy homes
- multilingual conversations
- overlapping speech

Therefore, the MVP uses an explicit:

> **Who is speaking?**

toggle:

- Student
- Parent

Automatic speaker detection can be a later enhancement.

This is a deliberate MVP simplification, not a missing feature.

---

# 14. PARENT CONCERN DETECTION

The system uses a lightweight and interpretable classifier.

## Five initial categories

### 1. Job Security

Example:

> "What if the company shuts down?"

### 2. Income Adequacy

Example:

> "Can this give a stable income?"

### 3. Social Perception

Example:

> "What will relatives say?"

### 4. Safety

Example:

> "Is this work safe for her?"

### 5. Degree Foreclosure

Example:

> "Can he study further later?"

---

# 15. LOW-CONFIDENCE CLASSIFICATION

The system should never silently assume a parent's concern.

Example:

> "It sounds like your main concern is job security. Is that right?"

If the parent says no:

- correct the label
- continue the conversation
- log the correction for evaluation

This improves:

- transparency
- user trust
- classifier evaluation
- future training data quality

---

# 16. VERIFIED EVIDENCE ENGINE

This is one of the most important technical components.

## Principle

> **The language model must not invent career facts.**

The LLM is used to communicate grounded information, not to become the source of truth.

---

# 17. RAG PIPELINE

The basic flow:

```text
Family Question
      ↓
Intent Detection
      ↓
Concern Detection
      ↓
Knowledge Retrieval
      ↓
Source Validation
      ↓
Date Validation
      ↓
Geography Validation
      ↓
Grounded Answer
      ↓
Evidence Card
```

---

# 18. WHY RAG IS NECESSARY

A normal LLM could answer:

> "Electricians earn ₹X."

But that number could be:

- outdated
- from another state
- from another year
- based on another population
- unsupported
- hallucinated

SaarthiAI therefore requires an approved source before presenting a factual claim.

## If source exists

Retrieve → validate → explain → cite.

## If source does not exist

Do not guess.

Say:

> "Current verified evidence is unavailable."

Then offer human counselling.

---

# 19. EVIDENCE CARD

Every factual Evidence Card should show:

- Claim
- Number/value if applicable
- Source
- Source type
- Published date
- Verified-on date
- Geography
- Applicability/eligibility
- Status

Example:

```text
CLAIM
A progression route may exist from a particular vocational
qualification to a further qualification.

SOURCE
Official notification / authority

GEOGRAPHY
State / National

VERIFIED
DD-MM-YYYY

APPLICABILITY
Depends on trade, institution and current rules.

STATUS
Verified / Needs current confirmation
```

---

# 20. EVIDENCE HIERARCHY

When local data is unavailable:

### Level 1
District-level verified data

### Level 2
State-level verified data

### Level 3
National-level verified data

### Level 4
Human counsellor

### Level 5
No factual answer if reliable evidence cannot be established

The interface must clearly label geography.

Example:

> **State-level figure; district-level data unavailable.**

Never present a national number as if it describes a particular district.

---

# 21. KNOWLEDGE BASE

The knowledge base may contain:

- trade profiles
- NSQF levels
- training providers
- placement information
- earnings information where reliable
- government schemes
- progression rules
- lateral-entry rules
- credit-transfer rules
- academic-equivalence rules
- local opportunity information
- verified and consented success stories

## Knowledge record structure

```text
Record
 ├── Claim
 ├── Value
 ├── Source
 ├── Source URL / document reference
 ├── Published date
 ├── Verified date
 ├── Geography
 ├── Applicability
 └── Review status
```

---

# 22. DATA FRESHNESS

Career and policy information changes.

Every record should therefore contain:

- Created date
- Published date
- Verified date
- Review due date
- Status

## Status options

- Verified
- Needs review
- Expired
- Conflicting
- Withdrawn

An expired record must not silently appear as current evidence.

---

# 23. PROGRESSION LADDER

The Progression Ladder is one of SaarthiAI's strongest visual features.

Instead of arguing:

> "Vocational education is a dead end."

SaarthiAI shows the actual verified progression possibilities.

Example:

```text
10th
  │
  ▼
ITI / Skill Qualification
  │
  ├────────────► Employment
  │
  ▼
Diploma / Further Qualification
  │
  ▼
Degree / Higher Education
  │
  ▼
Advanced Career Options
```

Each transition should be clickable.

It should show:

- eligibility
- current rule
- source
- date
- geography
- conditions
- exceptions

---

# 24. CRITICAL VERIFICATION RULE

Possible routes such as:

- ITI → Diploma
- Diploma → Degree lateral entry
- NCrF credit transfer
- NIOS equivalence

must be verified against current official notifications before they are presented as facts.

The system must not turn a possible route into a guaranteed route.

---

# 25. AGREEMENT MODE

Agreement Mode handles disagreement.

## Example

### Student

Wants:

- Electrician
- practical work
- interest
- employment

### Parent

Wants:

- Diploma
- stability
- income
- future education

### SaarthiAI

Finds shared priorities:

- employment
- growth
- local opportunity
- future education

Then compares compatible pathways.

## What SaarthiAI does not do

It does not say:

> "Student is right."

It does not say:

> "Parent is right."

It supports informed discussion.

---

# 26. FAMILY SUMMARY

At the end of a session, SaarthiAI generates a one-page summary.

## It contains

- Student preference
- Parent concerns
- Evidence reviewed
- Areas of agreement
- Remaining disagreement
- Next verification step
- Counsellor option/contact

This makes the session useful even after the family leaves the application.

---

# 27. FAMILY READINESS CHECKLIST

Do not create an arbitrary AI score such as:

> "Family readiness = 82%."

That creates false precision.

Instead use:

| Area | Status |
|---|---|
| Student interest clear | Yes / Partly / No |
| Parent concerns addressed | X of Y |
| Local demand checked | Yes / No |
| Income discussed | Yes / No |
| Progression checked | Yes / No |
| Final barrier | Open issue |
| Next action | Action |

The checklist is:

- rule-based
- explainable
- transparent

It does not label a family as passing or failing.

---

# 28. HUMAN COUNSELLOR HANDOFF

AI is not the final authority.

## Escalation triggers

- question outside verified knowledge
- repeated confusion
- distress/safety concerns
- unresolved disagreement
- user requests a human
- outdated evidence
- contradictory evidence
- case-specific eligibility

## Warm handoff package

The counsellor receives:

```text
Family profile
+
Student interests
+
Parent concerns
+
Evidence already shown
+
Questions asked
+
Unresolved issues
+
Conversation summary
```

The family does not need to start again.

---

# 29. RESPONSIBLE AI

## Hallucination

Controls:

- RAG
- approved source registry
- source validation
- date validation
- geography validation
- abstention
- escalation

## Bias

The system must remain neutral.

It must be able to say:

> "An academic pathway may better fit the student's goals."

It must not push vocational education simply because vocational education is the project's focus.

No gender-stereotyped recommendations.

---

# 30. PRIVACY

Privacy is a design requirement, not an add-on.

## Principles

- Data minimisation
- Clear consent
- Plain-language consent
- Regional-language consent
- Role-based access
- Defined retention
- Encryption
- Aggregated analytics
- Small-cell suppression

## Data that should not be required for basic counselling

The basic session should not require:

- Aadhaar
- unnecessary identity data

---

# 31. CONSENT

Separate consent should be considered for:

1. Basic counselling
2. Human counsellor handoff
3. Anonymised research use

For minors, the project proposes verifiable parental consent at session start.

The implementation should be reviewed against applicable privacy law and institutional requirements before deployment.

---

# 32. DISTRESS AND SAFETY

If the system detects distress or crisis language:

- AI should not handle the case alone
- trigger human escalation
- provide an appropriate verified helpline pointer
- avoid continuing normal career counselling as if nothing happened

This is a safety boundary.

---

# 33. TECHNICAL ARCHITECTURE

```text
                  STUDENT + PARENT
                         │
                         ▼
                Family Session Layer
                         │
                         ▼
                Family Context Engine
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Intent         Concern        Session
      Detection      Detection        State
          └──────────────┼──────────────┘
                         ▼
                AI Counselling Engine
                         │
                         ▼
                   Retrieval Layer
                         │
                         ▼
               Verified Knowledge Base
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
         Evidence     Progression  Agreement
           Cards        Ladder       Mode
             └───────────┼───────────┘
                         ▼
                  Family Summary
                         │
                ┌────────┴────────┐
                ▼                 ▼
          Decision Support    Human Handoff
                                  │
                                  ▼
                             Counsellor
```

---

# 34. TECHNOLOGY STACK

## Frontend

- Next.js
- TypeScript
- Progressive Web App
- Responsive UI
- Low-literacy-friendly interface

## Backend

- FastAPI
- Python

## Database

- PostgreSQL
- pgvector

## AI

- LLM with grounding constraints
- Embedding model
- Lightweight concern classifier
- Regional-language STT
- Regional-language TTS

## Infrastructure

- Redis
- Containerised deployment
- JWT
- Role-based access

## Channels

- Web/PWA
- WhatsApp where feasible
- Counsellor-assisted kiosk mode

---

# 35. LANGUAGE STRATEGY

The pilot should not promise every Indian language immediately.

Start with:

- Hindi
- English
- dominant regional language of the selected pilot state/district

Language expansion should happen after testing:

- speech recognition
- concern classification
- translation quality
- counsellor correction feedback

---

# 36. AI EVALUATION

The AI should be evaluated at three levels.

## 36.1 Retrieval

Question:

> Did the system retrieve the correct source?

Metrics:

- Recall@K
- Precision@K
- Source validity

## 36.2 Grounding

Question:

> Is the generated answer actually supported by the evidence?

Metrics:

- Claim-support rate
- Unsupported-claim rate
- Citation correctness

## 36.3 Concern classification

Question:

> Did the system identify the correct parental concern?

Metrics:

- Precision
- Recall
- F1
- Low-confidence confirmation rate

---

# 37. DATA MODEL CONCEPT

A conceptual knowledge-base record can look like:

```text
KnowledgeRecord
----------------
id
claim
value
source_name
source_reference
published_date
verified_date
review_due_date
geography_level
geography_name
applicability
eligibility
status
created_at
updated_at
```

A session can conceptually contain:

```text
FamilySession
--------------
session_id
student_context
parent_context
language
consent_status
session_state
concerns[]
evidence_viewed[]
agreements[]
unresolved_issues[]
handoff_status
summary
created_at
```

A concern can contain:

```text
Concern
--------
id
session_id
speaker
category
confidence
confirmed_by_user
status
evidence_cards[]
created_at
```

These are conceptual structures and should be adapted to the actual implementation.

---

# 38. DEMO SCENARIO

Use one simple, emotionally understandable scenario.

## Setup

Student wants:

> Electrician

Parent wants:

> Diploma

## Parent concern

> "I am worried about stable employment and whether he can study further."

## AI

Detects:

- Job Security
- Degree Foreclosure

Then confirms.

## Evidence

Show a verified Evidence Card.

## Progression

Show the applicable verified pathway.

## Agreement

```text
Student:
Interest + practical work

Parent:
Stability + future education

Shared:
Employment + growth + future options
```

## Family Summary

Shows:

- agreement
- disagreement
- evidence
- next step

## Failure case

Ask an unsupported question.

AI responds:

> "I couldn't verify this from the approved sources, so I won't guess."

Then:

**Counsellor Handoff**

---

# 39. WHY THE FAILURE CASE MATTERS

Most AI demos show:

> Question → impressive answer.

SaarthiAI should demonstrate:

> Question → insufficient evidence → abstention → human escalation.

This proves that the system is designed around **trust and safety**, not just answer generation.

---

# 40. SCREEN DESIGN

## Screen 1 — Shared Session

Elements:

- language selector
- Student / Parent toggle
- conversation
- microphone
- keyboard
- detected concerns
- Open / Partly / Resolved status

## Screen 2 — Evidence + Progression

Left:

- claim
- figure
- source
- date
- geography

Right:

- progression ladder
- clickable transitions

## Screen 3 — Agreement

Two columns:

**Student wants**

**Parent wants**

Then:

**Shared ground**

Then:

**Compatible pathways**

Then:

- Download Family Summary
- Talk to counsellor

---

# 41. PILOT DESIGN

## Phase 1 — Usability

Proposed:

- 10–15 families
- 3–5 counsellors

Measure:

- task completion
- concern classification
- evidence trust
- handoff completeness
- user confusion

## Phase 2 — Pilot

Proposed:

- 2 districts
- 10–15 ITIs/skill centres
- 300–500 families
- one admission cycle
- counsellor partners

Where feasible:

### Group A
Existing counselling

### Group B
SaarthiAI-assisted counselling

Compare outcomes.

---

# 42. SUCCESS METRICS

| Metric | Measurement |
|---|---|
| Parent confidence | Pre/post 5-point survey |
| Concern resolution | % marked resolved |
| Family alignment | Aligned / Partly / Unresolved |
| Evidence trust | Post-session rating |
| Handoff quality | Counsellor 1–5 rating |
| Handoff completeness | Required fields present |
| Concern classifier | Precision / Recall / F1 |
| Retrieval | Retrieval accuracy |
| Source validity | Valid source rate |
| Data freshness | % records within review threshold |
| Session completion | % reaching summary |
| Escalation | % needing counsellor |
| Enrolment follow-through | Group comparison |

---

# 43. ROADMAP

## Phase 1 — MVP

Core counselling experience.

## Phase 2 — Retention Monitor

After enrolment:

- 30-day check-in
- attendance
- satisfaction
- financial barriers
- family concerns
- dropout-risk signals
- counsellor escalation

## Phase 3 — Policy Intelligence

Aggregated and anonymised:

- parent concerns by district
- accepted/rejected trades
- unresolved barriers
- local demand
- training capacity
- counselling outcomes

No individual family information should be exposed.

---

# 44. RISKS

## Risk 1 — Local data unavailable

### Solution

District → State → National → Counsellor → No answer.

---

## Risk 2 — Outdated policy

### Solution

Verified date + review threshold.

---

## Risk 3 — Hallucination

### Solution

RAG + source validation + abstention.

---

## Risk 4 — Incorrect concern classification

### Solution

Parent confirmation + correction log.

---

## Risk 5 — Regional-language errors

### Solution

Pilot limited languages + counsellor feedback.

---

## Risk 6 — Low digital literacy

### Solution

Voice + large buttons + kiosk assistance.

---

## Risk 7 — AI over-reliance

### Solution

Mandatory escalation rules.

---

## Risk 8 — Privacy breach

### Solution

Consent + minimisation + role-based access.

---

## Risk 9 — Bias

### Solution

Neutral comparison and no stereotyped recommendations.

---

## Risk 10 — False precision

### Solution

No opaque decision score.

---

## Risk 11 — Conflicting official information

### Solution

Flag conflict and route to human verification.

---

## Risk 12 — Scope creep

### Solution

Five core capabilities first.

---

# 45. MVP BOUNDARIES

SaarthiAI should NOT attempt to do everything.

It should not initially become:

- a complete job portal
- a complete LMS
- a government benefits portal
- a recruitment platform
- a general-purpose chatbot
- a psychological diagnosis system
- a replacement for counsellors

Its primary job is:

> **Help a student and parent make a better-informed vocational education decision.**

---

# 46. WHAT MAKES SAARTHIAI DIFFERENT?

| Existing approach | SaarthiAI |
|---|---|
| Learner-centric | Family-centric |
| Generic advice | Concern-specific |
| Unsourced AI response | Evidence-grounded |
| National information only | District → State → National |
| Hidden source | Source + date + geography |
| Vocational path as endpoint | Progression Ladder |
| Parent disagreement ignored | Agreement Mode |
| AI-only | AI + human handoff |
| Black-box score | Explainable checklist |
| Claims impact | Measures impact |

---

# 47. EXPECTED OUTCOMES

These are expected outcomes to be tested, not guaranteed.

Potential outcomes:

- better parental understanding
- greater trust in verified information
- more informed family discussion
- fewer unsupported career claims
- better identification of unresolved concerns
- better-targeted counsellor intervention
- evidence for improving vocational counselling

---

# 48. SCALABILITY

The architecture can scale:

```text
Pilot District
      ↓
Multiple Districts
      ↓
State
      ↓
National
```

The core architecture remains similar.

The knowledge base expands by:

- language
- district
- state
- trade
- institution
- labour-market evidence
- admission rules
- counselling partners

---

# 49. PRE-SUBMISSION VERIFICATION

Before the final SIH presentation, verify:

- Existing government career-platform capabilities
- ITI-to-Diploma rules
- Diploma-to-Degree rules
- NCrF credit-transfer rules
- NIOS equivalence rules
- National Career Service information
- Placement statistics
- Tracer-study statistics
- Labour-market information
- ITI dropout statistics
- District Skill Development Plan information
- Salary figures
- Placement figures
- Progression claims
- Government scheme claims
- Research sample/results

## Golden rule

If a claim cannot be verified:

> **Do not put it into a factual Evidence Card.**

Instead:

> "Current verified evidence unavailable."

Then offer a counsellor.

---

# 50. RESEARCH QUESTIONNAIRE

## Student

1. What career path are you considering?
2. Who influences your decision most?
3. What does your parent think about vocational education?
4. What information do you wish you had?
5. Would you consider vocational education if a clear route to higher education existed?

## Parent

1. What is your biggest concern?
2. How important is job stability?
3. How important is income?
4. How important is future degree eligibility?
5. How important is workplace safety?
6. How much does social perception matter?
7. Which information sources do you trust?
8. What evidence would make you more comfortable?

## Counsellor

1. Which questions do parents ask most?
2. Which questions are hardest to answer?
3. Which information is difficult to verify?
4. How much time is spent repeating basic information?
5. What information would make handoffs easier?

---

# 51. PROTOTYPE ACCEPTANCE CRITERIA

The MVP should demonstrate:

- [ ] Student and parent can join one session
- [ ] Speaker can be selected
- [ ] Concern can be classified
- [ ] Low confidence asks for confirmation
- [ ] Evidence Card shows source/date/geography
- [ ] Unsupported question produces abstention
- [ ] Progression route shows verified evidence
- [ ] Student and parent priorities are compared
- [ ] Family Summary is generated
- [ ] Counsellor receives context
- [ ] Consent is captured
- [ ] Sensitive information is access-controlled
- [ ] Demo data is clearly marked

---

# 52. SIH PRESENTATION STRUCTURE

A strong 10-slide structure:

## Slide 1 — Title

**SaarthiAI**

Tagline:

> When a student's career choice becomes a family decision, SaarthiAI gives both sides the evidence to decide together.

---

## Slide 2 — Problem

Show:

Student wants vocational path.

Parent worries about:

- job
- income
- safety
- future education
- social perception

Then state:

> Career decisions are family decisions.

---

## Slide 3 — Research

Show:

- research methodology
- actual interview/sample numbers
- actual concern patterns

Do not show invented percentages.

---

## Slide 4 — Gap

Show verified existing platforms and their capabilities.

Then:

> Information exists. Family-level decision support is the gap we address.

---

## Slide 5 — Solution

Show:

```text
Concern
 ↓
Evidence
 ↓
Progression
 ↓
Agreement
 ↓
Decision
 ↓
Counsellor
```

---

## Slide 6 — Evidence Engine

Show:

- RAG
- source
- date
- geography
- verification
- abstention

---

## Slide 7 — Progression + Agreement

Show:

ITI → further qualification → degree

Then:

Student priority vs Parent priority.

---

## Slide 8 — Demo

Run:

Parent concern → Evidence Card → Progression Ladder → Agreement → Summary → Failure case.

---

## Slide 9 — Technology + Safety

Show:

- Next.js
- FastAPI
- PostgreSQL/pgvector
- RAG
- classifier
- STT/TTS
- privacy
- human escalation

---

## Slide 10 — Validation + Impact

Show:

- usability test
- pilot
- comparison group
- metrics
- roadmap

---

# 53. THREE-MINUTE DEMO SCRIPT

## 0:00–0:20

Introduce the family.

> "A student wants Electrician. His parent wants Diploma. The disagreement is not about the student's ability. It is about security and future options."

## 0:20–0:50

Parent speaks.

> "I am worried about stable employment and whether he can study further."

AI identifies:

- Job Security
- Degree Foreclosure

Then confirms.

## 0:50–1:20

Show Evidence Card.

Explain:

> "SaarthiAI does not ask the LLM to invent this information. It retrieves an approved record and shows its source, date and geography."

## 1:20–1:50

Show Progression Ladder.

Click a transition.

Show:

- eligibility
- rule
- source
- date

## 1:50–2:20

Open Agreement Mode.

Show:

Student:
- practical work
- interest

Parent:
- stability
- future education

Shared:
- employment
- growth
- further education

## 2:20–2:40

Generate Family Summary.

## 2:40–3:00

Ask an unsupported question.

AI:

> "I couldn't verify this from the approved sources, so I won't guess."

Then show:

**Counsellor Handoff**

End with:

> "The AI does not make the decision. It makes the evidence easier for the family to use."

---

# 54. JUDGE QUESTIONS AND ANSWERS

## Q1. Isn't this just another AI chatbot?

**Answer:**

No. The core system is not based on open-ended chatbot answers. SaarthiAI combines family-session context, concern classification, verified retrieval, source/date/geography provenance, progression visualization, agreement logic and human escalation.

---

## Q2. What happens if the AI hallucinates?

**Answer:**

Factual answers are constrained by the verified knowledge base. If an approved source cannot be found or evidence conflicts, the system abstains and escalates instead of guessing.

---

## Q3. Why involve parents?

**Answer:**

The project treats the career decision as a multi-stakeholder decision. The system is specifically designed to surface and resolve the concerns that can influence the student's pathway.

---

## Q4. Why not simply use a counsellor?

**Answer:**

Human counsellors remain important. SaarthiAI is designed to handle repeatable evidence retrieval and structured family discussion at scale, then give counsellors a complete context for cases that require human judgement.

---

## Q5. Why is RAG necessary?

**Answer:**

Career and policy information changes by time, geography and eligibility. RAG allows the system to retrieve approved evidence instead of relying on the model's internal memory.

---

## Q6. What if district-level data is unavailable?

**Answer:**

The system falls back from district to state to national evidence, clearly labels the geography, and escalates when no reliable evidence exists.

---

## Q7. How do you avoid bias?

**Answer:**

SaarthiAI does not automatically recommend vocational education. It can also conclude that an academic route better fits the student's goals. Agreement Mode presents both sides' priorities without declaring a winner.

---

## Q8. How do you measure success?

**Answer:**

Parent confidence, concern resolution, student-parent alignment, evidence trust, counsellor handoff quality, retrieval quality, concern-classifier performance and, in a later pilot, enrolment follow-through.

---

## Q9. What is your strongest feature?

**Answer:**

The combination of **Concern Detection + Evidence Card + Progression Ladder + Human Handoff**. It turns a vague parental objection into a structured, verifiable decision process.

---

## Q10. What is your biggest limitation?

**Answer:**

The quality of the system depends on the quality and freshness of verified evidence. That is why provenance, review dates and human escalation are core parts of the architecture.

---

# 55. TEAM DEVELOPMENT PRIORITY

Development should follow this order.

## Priority 1

Build the shared family session.

## Priority 2

Build concern detection.

## Priority 3

Build verified knowledge base.

## Priority 4

Build RAG retrieval.

## Priority 5

Build Evidence Cards.

## Priority 6

Build Progression Ladder.

## Priority 7

Build Agreement Mode.

## Priority 8

Build Family Summary.

## Priority 9

Build counsellor handoff.

## Priority 10

Add voice/language enhancements.

Do not spend early development time polishing roadmap features before the core flow works.

---

# 56. CORE PRODUCT LOOP

The whole system can be reduced to:

```text
LISTEN
  ↓
CLASSIFY
  ↓
VERIFY
  ↓
EXPLAIN
  ↓
COMPARE
  ↓
SUMMARISE
  ↓
ESCALATE IF NECESSARY
  ↓
MEASURE
```

This should guide the entire implementation.

---

# 57. WHAT SAARTHIAI IS NOT

SaarthiAI is not:

- a generic chatbot
- a job guarantee system
- a salary predictor
- an admission authority
- a replacement for government notifications
- a replacement for professional counsellors
- a psychological diagnosis system
- a tool for forcing a student into vocational education

---

# 58. FINAL PRODUCT PRINCIPLES

## Principle 1 — Evidence over confidence

The AI should prefer:

> "I don't have verified evidence."

over:

> "Here is probably the answer."

## Principle 2 — Family over individual

The system considers both student and parent.

## Principle 3 — Transparency over black-box scoring

Show why the system reached a status.

## Principle 4 — Human judgement where necessary

Escalation is a designed feature.

## Principle 5 — Current evidence over memorised information

Every factual record has verification metadata.

## Principle 6 — Neutrality

The system supports the decision; it does not decide the family's future.

---

# 59. FINAL ONE-LINE PITCH

> **When a student's career choice becomes a family decision, SaarthiAI gives both sides the evidence to decide together.**

---

# 60. FINAL TECHNICAL PITCH

> **SaarthiAI converts parental career concerns into interpretable categories, retrieves current verified evidence through a provenance-aware RAG pipeline, visualizes applicable progression pathways, structures student-parent agreement, and escalates unsupported or sensitive cases to human counsellors.**

---

# 61. FINAL RESEARCH PITCH

> **Our research focuses on the gap between career information and family-level decision-making. We validate parental concerns, trusted information sources, disagreement patterns and counselling pain points, then directly map those findings to the product architecture and evaluate whether evidence-grounded counselling improves confidence, concern resolution and family alignment.**

---

# 62. FINAL DIFFERENTIATOR

The differentiator is **not the LLM**.

The differentiator is:

```text
Family Context
     +
Concern Detection
     +
Verified Evidence
     +
Source Provenance
     +
Progression Mapping
     +
Agreement Mode
     +
Human Escalation
```

Together, these create a **family decision-support workflow** rather than another conversational AI.

---

# 63. FINAL BOUNDARY

SaarthiAI is **decision support, not decision authority**.

It must never:

- guarantee employment
- guarantee salary
- guarantee admission
- make institutional eligibility decisions
- pressure families toward vocational education
- invent local data
- present outdated rules as current
- replace qualified human counselling for complex cases

Its most important capability is not that it always answers.

> **It knows when the evidence is insufficient and refuses to guess.**

---

# 64. FINAL A–Z SUMMARY

## A — Architecture
Family → Context → AI → RAG → Evidence → Decision → Counsellor.

## B — Bias
Neutral pathway comparison.

## C — Concern Detection
Five initial concern categories.

## D — Data
Verified, dated, geographically labelled records.

## E — Evidence
Every factual claim should have provenance.

## F — Family
Student + parent are the primary decision unit.

## G — Geography
District → State → National fallback.

## H — Human Handoff
AI escalates when necessary.

## I — Impact
Measured through pilot metrics.

## J — Journey
Understand → Explain → Prove → Compare → Decide → Hand off.

## K — Knowledge Base
Career, progression, policy and opportunity information.

## L — Language
Pilot languages first; expansion after validation.

## M — MVP
Five core capabilities plus lightweight supporting features.

## N — Neutrality
AI does not choose the pathway.

## O — Outcomes
Confidence, concern resolution, alignment and counselling efficiency.

## P — Progression
Visual pathway from vocational education to further opportunities where officially applicable.

## Q — Quality
Retrieval, grounding and classification metrics.

## R — RAG
Retrieval-Augmented Generation with source controls.

## S — Safety
Abstention, escalation, privacy and consent.

## T — Technology
Next.js, FastAPI, PostgreSQL/pgvector, Redis, LLM, embeddings, STT/TTS.

## U — Users
Student, parent, family, counsellor, future administrator.

## V — Verification
Current official sources before factual presentation.

## W — Why
Because career information alone does not solve family disagreement.

## X — eXplainability
Evidence Cards and readiness checklist show why.

## Y — Your MVP
Focus on one complete family decision journey.

## Z — Zero Guessing
When evidence is insufficient:

> **Do not guess. Escalate.**

---

# 65. FINAL PROJECT STATEMENT

**SaarthiAI is a family-centric, evidence-grounded AI counselling system for vocational education in India. It addresses a decision gap rather than simply an information gap. By identifying parental concerns, retrieving verified evidence, showing education and career progression, structuring student-parent agreement, and escalating unresolved cases to human counsellors, SaarthiAI aims to help families make more informed decisions without replacing human judgement.**

**The project succeeds when the family leaves not with an AI-generated answer, but with a clearer understanding of the evidence, the remaining uncertainty, and the next step.**
