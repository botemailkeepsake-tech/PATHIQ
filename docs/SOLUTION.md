# PATHIQ: From Parental Doubt to an Informed Family Decision

**Smart India Hackathon | Problem Statement 26241**
Family-centric, evidence-grounded AI counselling for vocational education in India

> **When a student's career choice becomes a family decision, PATHIQ gives both sides the evidence to decide together.**

---

## 1. Executive Summary

Vocational education decisions are rarely made by students alone. In many Indian families, parents influence, fund, approve or reject the pathway. Their concerns centre on job security, income, social perception, workplace safety, and whether vocational education keeps future degree options open.

Career-information tools typically serve the individual learner. The gap is **family-level**: student and parent may hold different priorities, and neither has a trusted way to resolve the difference using current, local, verifiable evidence.

**PATHIQ** is a shared counselling system for the student and parent. It:

1. identifies the parent's concerns,
2. answers each with a sourced Evidence Card from a verified knowledge base,
3. explains the evidence in the family's language,
4. shows education and career progression visually,
5. maps remaining disagreement between student and parent, and
6. hands unresolved or sensitive cases to a human counsellor with full context.

**Journey:** Understand → Explain → Prove → Compare → Decide → Hand off

PATHIQ does not choose a pathway for the family. It makes the decision better informed.

---

## 2. Problem Definition

A student may be drawn to vocational education while a parent prefers a conventional academic route. Typical parental questions:

- Will my child get a stable job?
- Is the income enough?
- What happens if the company closes?
- What will relatives say?
- Is the work safe, especially for a daughter?
- Can my child still study for a diploma or degree later?
- Are there opportunities locally?

**Root problem:** reliable career information may exist, but families lack a simple, shared, evidence-based way to turn it into a joint decision. This is a multi-stakeholder decision-support problem, not only an information shortage.

---

## 3. Research Plan and Hypotheses

PATHIQ's requirements come from a structured research plan. No finding is stated as fact until it has been collected and analysed.

### 3.1 Field validation (before the pilot)

A small, honestly reported validation round with students, parents/guardians, ITI or skill-centre instructors and career counsellors, covering at least two skill centres. The aim is to confirm which concerns occur most often, which sources families trust, and which questions counsellors find hardest. Results are reported as a small qualitative sample, not as population findings.

### 3.2 Research questions

1. What stops parents from supporting vocational pathways?
2. Which concerns are most frequent?
3. Which information sources do families trust today?
4. Where do families struggle to verify career claims?
5. Where do student and parent priorities differ?
6. Which information changes understanding or confidence?
7. Which questions need a human counsellor?

### 3.3 From research to product requirements

| Research observation to validate | Product requirement |
|---|---|
| Parents worry about employment | Job-security Evidence Card |
| Parents question income | Earnings Evidence Card |
| Parents doubt future education | Progression Ladder |
| Student and parent priorities differ | Agreement Mode |
| Local information is hard to verify | Geography-aware evidence retrieval |
| Families ask questions beyond verified data | Human escalation |
| Parents distrust unsourced claims | Source, date and geography on every figure |
| Low digital literacy | Voice and large-button UI |
| Regional language matters | Regional-language support |

### 3.4 Hypotheses to test

| ID | Hypothesis | Measurement |
|---|---|---|
| H1 | Source-backed counselling raises parent confidence | 5-point score before vs. after |
| H2 | Evidence Cards resolve a measurable share of concerns | Parent marks each concern unresolved / partly / resolved |
| H3 | Structured comparison raises aligned or partly aligned outcomes | Agreement Mode outcome |
| H4 | Handoff context cuts repeated questioning | Counsellor rating of completeness and time-to-understand |
| H5 | Visible source, date and geography raise trust | Post-session evidence-trust score |

---

## 4. Landscape and Differentiation

Learner-facing career portals and human counselling are the two existing routes. PATHIQ sits between them: it scales like a portal and engages the family like a counsellor, with evidence and escalation built in.

| Capability | Learner-facing career portals (typical) | Human counselling alone | PATHIQ |
|---|---|---|---|
| Primary user | Individual learner | Student and family | Student and parent together |
| Shared student-parent session | Not typical | Yes, manual | Yes |
| Concern-specific answers | Generic | Depends on counsellor | Yes, by classified concern |
| Source, date and geography on evidence | Varies | Depends on counsellor | Yes, on every factual card |
| Progression visualisation | Varies | Manual | Yes, with cited transitions |
| Family disagreement support | Not typical | Yes, manual | Yes (Agreement Mode) |
| Scales to many families | Yes | Limited by counsellor time | Yes |
| Human escalation with context | Varies | Native | Yes (warm handoff) |

**Differentiation:** family-level, concern-specific, evidence-grounded decision support with a designed human handoff.

---

## 5. Solution Overview

PATHIQ runs a shared counselling session for a student and parent, identifies concerns, answers them with verified evidence, shows progression options, supports agreement, and escalates unresolved cases to a human counsellor.

### 5.1 Scope at a glance

| Tier | What | Status |
|---|---|---|
| **Core (5)** | Shared Family Session; Concern Detection; Verified Evidence Engine; Progression Ladder; Human Counsellor Handoff | Built in MVP |
| **Supporting (3)** | Agreement Mode; Family Summary and Readiness Checklist; Consent and privacy controls | Built in MVP, lightweight |
| **Phase 2** | Retention Monitor | Roadmap |
| **Phase 3** | Policy Intelligence Dashboard | Roadmap, shown in pitch |

---

## 6. Core Capabilities

### 6.1 Shared Family Session

One session, three views:

| View | Shows |
|---|---|
| Student | Interests, preferred trades, aptitude, aspirations |
| Parent | Concerns, evidence, income and employment information, safety information, progression options |
| Family | Side-by-side pathways, shared priorities, resolved and unresolved concerns, next action, Family Summary |

**Speaker identification:** the MVP uses an explicit "Who is speaking?" toggle (Student / Parent). Automatic speaker detection is a later enhancement, since noisy multilingual household audio makes it unreliable.

### 6.2 Parent Concern Detection

A lightweight, interpretable classifier tags parent input against five concerns:

| Concern | Example |
|---|---|
| Job security | "What if the company shuts down?" |
| Income adequacy | "Can this give a stable income?" |
| Social perception | "What will relatives say?" |
| Safety | "Is this work safe for her?" |
| Degree foreclosure | "Can he study further later?" |

**Low confidence:** the AI never silently assumes. It asks: "It sounds like your main concern is job security. Is that right?" A "no" corrects the label, and corrections are logged for evaluation.

### 6.3 Verified Evidence Engine

**Principle:** the language model does not invent career facts. It answers only from an approved knowledge base.

```
Family question → Intent + concern detection → Retrieval from verified KB
→ Source / date / geography validation → Grounded response → Evidence Card
```

**Why retrieval matters:** a plain chatbot may give a salary that is outdated, from another state or year, or fabricated. PATHIQ asks whether an approved source exists. If yes, it retrieves, cites and labels. If no, it does not answer; it escalates.

**Evidence Card fields:** claim, value, source, source type, published date, verified-on date, geography, applicability or eligibility, status.

```
CLAIM        [e.g., progression route from ITI to a further qualification]
SOURCE       Official notification / authority (document reference)
GEOGRAPHY    State / National
VERIFIED     DD-MM-YYYY
APPLICABILITY Depends on trade, institution and current admission rules
STATUS       Verified | Needs current confirmation
```

Generic rules are never shown as universal when eligibility depends on a specific notification or institution.

**Evidence hierarchy** (geography is always labelled, e.g., "State-level figure; district-level data unavailable"):

1. District-level verified data
2. State-level verified data
3. National-level verified data
4. Human counsellor
5. No answer, if reliable evidence cannot be established

**Knowledge base record:**

```
Record: Claim | Value | Source | Source URL/reference | Published date
        | Verified date | Geography | Applicability | Review status
```

**Contents:** trade profiles and NSQF levels; training providers; placement and earnings information where reliably available; government schemes; progression, lateral-entry, credit-transfer and academic-equivalence rules; local opportunity information; verified, consented success stories.

**Freshness:** each record carries created, published, verified and review-due dates and a status: Verified, Needs review, Expired, Conflicting or Withdrawn. An expired record never appears as current evidence.

### 6.4 Progression Ladder

Instead of asserting that vocational education has or lacks a future, the ladder shows the pathway and the evidence behind each step.

```
10th → ITI / Skill qualification ─┬─► Employment
                                  └─► Diploma / Further qualification
                                        → Degree / Higher education
                                          → Advanced career options
```

Every transition opens to show eligibility, current rule, source, date, geography and conditions. Routes such as ITI-to-Diploma, Diploma-to-Degree lateral entry, NCrF credit transfer and NIOS equivalence are shown as facts only after verification against the current official notification.

### 6.5 Human Counsellor Handoff

AI is not the final authority for uncertain, sensitive or unsupported cases.

**Escalation triggers:** question outside verified knowledge; repeated unresolved confusion; distress or safety concerns; unresolved student-parent disagreement; a request for a human; outdated or contradictory evidence; eligibility that depends on a case-specific official decision.

**Warm handoff:** family profile, student interests, parent concerns, evidence already shown, questions asked, unresolved issues and a conversation summary. The family does not restart.

---

## 7. Supporting Capabilities

### 7.1 Agreement Mode

When student and parent prefer different paths, PATHIQ does not pick a winner.

1. **State both preferences.** Student: Electrician, practical work. Parent: Diploma, long-term security.
2. **Identify priorities.** Student: interest, practical work, employment. Parent: stability, income, further education.
3. **Find shared priorities.** Employment, growth, local opportunities, future education.
4. **Compare compatible pathways** that satisfy the most shared priorities.

The AI never says "the student is right" or "the parent is right."

### 7.2 Family Summary and Readiness Checklist

A one-page take-home summary: student preference, parent concerns, evidence reviewed, areas of agreement, remaining disagreement, next verification step, counsellor contact.

There is no opaque "decision score." The checklist is rule-based and explainable. Allowed status values: **Yes**, **Partly**, **No**.

| Area | Status | Basis |
|---|---|---|
| Student interest clear | Yes / Partly / No | Student responses |
| Parent concerns addressed | Yes / Partly / No | Concern tracker |
| Local demand checked | Yes / No | Verified KB |
| Income discussed | Yes / No | Evidence Card |
| Progression checked | Yes / No | Progression Ladder |
| Final barrier | Open issue | Session context |
| Next action | Action | Rule-based |

It never labels a family as passing or failing. It shows what remains unresolved.

### 7.3 Consent and Privacy Controls

See Section 9.

---

## 8. Screens (Prototype Wireframes)

**Screen 1: Shared Session.** Top bar: language selector and a large Student | Parent toggle. Centre: conversation. Bottom: large mic and keyboard buttons. Side panel: concerns detected so far, each with a status chip (Open / Partly / Resolved).

**Screen 2: Evidence Card and Progression Ladder.** Left: a card with the claim, figure, a source line (name, date), and a geography badge ("State-level; district data unavailable"). Right: the ladder, with each step tappable to open eligibility, rule, source and date.

**Screen 3: Agreement Mode and Family Summary.** Two columns (Student wants / Parent wants), a "Shared ground" band below, compatible pathways beneath that, and a "Download Family Summary" button plus "Talk to a counsellor."

---

## 9. Responsible AI, Privacy and Safety

| Area | Approach |
|---|---|
| Hallucination | Retrieval-grounded factual answers; approved source registry; no verified source means no factual claim; stale records flagged; conflicts escalated |
| Bias | Neutral comparison across pathways; the AI can say an academic path may fit better; no gender-stereotyped recommendations |
| Minors' data and consent | **Verifiable parental consent** at session start, in plain regional language; separate consent for counsellor handoff and for anonymised research use |
| Data minimisation | No Aadhaar or name required for basic counselling |
| Security | Role-based access, encryption, defined retention period |
| Analytics | Aggregation and small-cell suppression; no individual family data exposed |
| Distress | Distress or crisis language triggers immediate human escalation and a verified helpline pointer |
| Compliance | Aligned with DPDP Act principles and institutional policies where applicable |

---

## 10. Technical Architecture

```
                  FAMILY (Student + Parent)
                            │
                  Family Session Layer
                            │
                  Family Context Engine
          ┌─────────────────┼─────────────────┐
     Intent detection  Concern detection  Session state
          └─────────────────┼─────────────────┘
                   AI Counselling Engine
                            │
                     Retrieval Layer
                            │
                 Verified Knowledge Base
          ┌─────────────────┼─────────────────┐
    Evidence Cards   Progression Ladder   Agreement Mode
          └─────────────────┼─────────────────┘
                      Family Summary
                   ┌────────┴────────┐
            Decision support    Human handoff → Counsellor
```

**Stack:** Next.js (TypeScript, PWA, low-literacy UI); FastAPI (Python); PostgreSQL with pgvector; Redis; LLM with grounding constraints, embedding model, lightweight concern classifier, regional-language speech-to-text and text-to-speech; JWT with role-based access; containerised deployment. **Channels:** web/PWA, WhatsApp where feasible, counsellor-assisted kiosk mode.

**Languages for the pilot:** Hindi, English, and the dominant regional language of the pilot state, chosen per pilot district because that is where speech and classification quality can be validated with local counsellors.

---

## 11. AI Evaluation

| Level | Question | Metrics |
|---|---|---|
| Retrieval | Is the correct source retrieved? | Recall@K, Precision@K, source validity |
| Grounding | Is the answer supported by the evidence? | Claim-support rate, unsupported-claim rate, citation correctness |
| Concern classification | Is the parent's concern identified correctly? | Precision, recall, F1, low-confidence confirmation rate |

---

## 12. Demo Scenario (3 minutes)

**Seeded demo data:** one trade (Electrician) and one state, loaded with a small set of records. **Any data that is not verified against a real source is marked `is_demo: true` and shown as "Demo / illustrative" on screen.** Verified records each have a real source and date. The demo demonstrates the system behaviour with a mix of verified and clearly labelled illustrative records.

1. **Family enters.** Student wants Electrician; parent prefers Diploma.
2. **Parent explains.** "I am worried about stable employment and whether he can study further."
3. **Concerns identified.** Job security and degree foreclosure; the AI confirms them.
4. **Evidence Card.** Verified employment information with source, date and geography (or clearly labelled demo data).
5. **Progression Ladder.** The applicable verified routes (or clearly labelled demo data).
6. **Agreement Mode.** Student: practical work and interest. Parent: stability and future education. Shared: employment, growth, further education.
7. **Family Summary.** What was agreed, what remains open, evidence reviewed, next action.
8. **Failure case.** A question outside the knowledge base: "I couldn't verify this from the approved sources, so I won't guess." Then handoff to a counsellor.

---

## 13. Roadmap

### Phase 2: Retention Monitor
After enrolment, a 30-day check-in covering attendance, satisfaction, financial barriers, family concerns and dropout-risk signals, with counsellor or training-provider escalation.

### Phase 3: Policy Intelligence Dashboard
Aggregated, anonymised insights for scheme administrators: parent concerns by district, trades accepted or rejected and why, common unresolved barriers, local demand against training capacity, and counselling outcomes. This turns family-level counselling data into demand-side evidence that can complement district skill planning. No individual family data is exposed, and small cells are suppressed.

---

## 14. Validation and Pilot

### 14.1 Near term: usability test
10 to 15 families and 3 to 5 counsellors on the prototype. Measures: task completion, concern-classification accuracy on real utterances, evidence trust, handoff completeness, and what confuses users.

### 14.2 Phase 2: pilot
Proposed parameters, not completed results: 2 districts, 10 to 15 ITIs or skill centres, 300 to 500 families, one admission cycle, with counsellor partners. Where feasible, compare existing counselling (Group A) with PATHIQ-assisted counselling (Group B).

### 14.3 Success metrics

| Metric | Measurement |
|---|---|
| Parent confidence | Pre/post 5-point survey |
| Concern resolution | % of concerns marked resolved |
| Student-parent alignment | Aligned / Partly / Unresolved |
| Evidence trust | Post-session rating |
| Handoff quality and completeness | Counsellor 1-5 rating; required fields present |
| Concern classifier | Precision / Recall / F1 |
| Evidence retrieval | Retrieval accuracy; source validity |
| Data freshness | % records within review threshold |
| Session completion | % sessions reaching a summary |
| Escalation rate | % sessions needing a counsellor |
| Enrolment follow-through | Comparison between groups |

---

## 15. Risks and Mitigation

| Risk | Mitigation |
|---|---|
| Local data unavailable | District → state → national fallback, labelled |
| Outdated policy | Verified-on date and review threshold |
| Hallucinated answer | Retrieval grounding, source validation, abstention |
| Wrong concern classification | Parent confirmation, correction log |
| Regional-language errors | Pilot language coverage, counsellor correction loop |
| Low digital literacy | Voice, large buttons, assisted kiosk |
| AI over-reliance | Mandatory escalation rules |
| Privacy breach | Data minimisation, access control, consent |
| Bias | Neutral pathway comparison |
| False precision | No opaque decision score |
| Conflicting official sources | Flag and route to human verification |
| Scope too large | Five core capabilities; the rest phased |

---

## 16. Scalability and Outcomes

**Scalability:** pilot district → multiple districts → state → national coverage. The architecture stays the same while the knowledge base expands; localisation covers language, geography, training providers, labour-market evidence, state admission rules and counselling partners.

**Expected outcomes (to be tested, not guaranteed):** better parental understanding of vocational pathways; greater trust in verified information; more informed student-parent discussions; fewer unsupported career claims; better identification of unresolved concerns; better-targeted counsellor time; evidence for improving vocational counselling.

---

## 17. Positioning

**One-line pitch:** *When a student's career choice becomes a family decision, PATHIQ gives both sides the evidence to decide together.*

**Positioning:** PATHIQ is a family decision-support system that turns parental concerns about vocational education into verifiable evidence, visible progression pathways, structured discussion and human-supported decisions.

**Boundary:** PATHIQ is decision support, not decision authority. It never guarantees employment, salary or admission; never makes eligibility decisions for institutions; never pressures a family toward vocational education; never invents missing local data; never presents outdated rules as current; and never replaces qualified human counselling for complex cases.

*Its most important capability is not that it always answers. It is that it knows when the evidence is insufficient and refuses to guess.*

---

## 18. Suggested 10-Slide Deck

1. **Title and pitch line.**
2. **Problem:** vocational choice is a family decision; the parent questions.
3. **Gap:** portals serve learners, counsellors don't scale; the comparison table.
4. **Solution:** the journey (Understand → Hand off) and the five core capabilities.
5. **Live demo or screens:** Shared Session, concern detection.
6. **Evidence Card and Progression Ladder:** source, date, geography; fallback hierarchy.
7. **Agreement Mode, Family Summary and counsellor handoff.**
8. **Trust and safety:** abstention, bias neutrality, parental consent, privacy.
9. **Policy angle and roadmap:** Retention Monitor, anonymised district insights.
10. **Validation plan and ask:** usability test, pilot metrics, expected outcomes.

---

## Appendix A: Pre-Submission Verification Checklist

Complete each item against the current official source before presenting. Anything unverified stays out of the Evidence Cards and slides.

- [ ] Exact scope of the existing government career platforms (then replace the generic column in Section 4 with named tools)
- [ ] ITI-to-Diploma rules
- [ ] Diploma-to-Degree lateral-entry rules
- [ ] Current NCrF credit-transfer rules
- [ ] Current NIOS equivalence rules
- [ ] National Career Service counsellor information
- [ ] Placement and tracer-study statistics
- [ ] Labour-market data
- [ ] ITI dropout statistics
- [ ] District Skill Development Plan data
- [ ] Every salary, placement, progression and scheme claim used in the demo
- [ ] Field-validation results (Section 3.1), reported with true sample sizes

**Evidence rule:** if a claim cannot be verified, it does not go in a factual Evidence Card. The system shows "Current verified evidence unavailable" and offers a counsellor.

## Appendix B: Research Questionnaire

**Student:** What career path are you considering? Who influences your decision most? What does your parent think about vocational education? What information do you wish you had? Would you consider it if a clear route to higher education existed?

**Parent:** What is your biggest concern? How important are job stability, income, future degree eligibility, workplace safety and what others think? Which sources do you trust? What evidence would make you more comfortable?

**Counsellor:** Which questions do parents ask most? Which are hardest to answer? Which information is hard to verify? How much time goes on repeating basics? What would make handoffs easier?

## Appendix C: Prototype Acceptance Criteria

- [ ] Student and parent take part in one session
- [ ] Speaker is identified with the toggle
- [ ] Parent concern is classified; low confidence asks for confirmation
- [ ] Evidence Card shows source, date and geography
- [ ] An unsupported question produces an abstention
- [ ] Progression route shows verified evidence
- [ ] Student and parent priorities are compared
- [ ] Family Summary is generated
- [ ] Counsellor receives session context
- [ ] Parental consent is captured
- [ ] Sensitive information is access-controlled
- [ ] Demo data is clearly marked
