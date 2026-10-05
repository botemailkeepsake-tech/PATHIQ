# AI SPEC

## 1. Principles

1. The model never supplies career facts. Facts come only from retrieved knowledge records.
2. If there is no valid record, abstain and offer a counsellor.
3. Low confidence means ask, not assume.
4. Output stays neutral: no winner, no push toward vocational education.
5. **The knowledge base architecture supports verified evidence. Production factual claims require records that have been verified against cited source documents. Placeholder/demo records (`is_demo: true`) must never be presented as verified facts.**

## 2. Concern taxonomy

| Label | Meaning | Typical evidence topic |
|---|---|---|
| job_security | Worry about stable employment, company closure | job_security, local_opportunity |
| income | Worry about adequacy or growth of earnings | income |
| social_perception | Worry about what relatives or community think | social_perception, progression |
| safety | Worry about workplace safety, travel, shifts, especially for daughters | safety |
| degree_foreclosure | Worry that the path closes off further study | progression |
| none | No concern expressed (classifier output only) | n/a |

**Important:** The label `none` is a **classifier output only**. It is **NOT persisted as a concern record**. If no concern is detected:
- Do not create a persisted concern row
- Continue the conversation normally
- Do not manufacture a parent concern

A message may carry more than one label. Student messages are not classified as concerns; they feed `preferences`.

## 3. Concern classification

- Input: parent message text (after STT if voice), language code, short conversation context.
- Output: list of (label, confidence).
- Thresholds (configurable): `CONCERN_CONFIRM_THRESHOLD = 0.70`. Below it, ask a confirmation question. At or above, proceed but display the detected concern so the parent can correct it.
- Confirmation question template (localised): "It sounds like your main concern is {concern_name}. Is that right?" If the parent says no, ask which concern fits best from the list; store the correction.
- Implementation options (choose in M3): (a) embeddings plus a small classifier trained on labelled utterances; (b) a prompted LLM that returns label and calibrated confidence with few-shot examples. Either must be evaluated on `evals/concern_utterances.jsonl`.

## 4. Retrieval

1. Build a query from (concern topic, trade, language-independent keywords).
2. Filter: `status = verified` **for family-facing production answers**. Records with `status = needs_review` are only used for internal evaluation, admin workflows, testing, or explicitly labelled environments and must be clearly labelled as such. Filter by `review_due` not passed, topic and trade match.
3. Geography fallback: try `district` for the session's district; then `state`; then `national`. Return the first level that has usable records and record which level was used.
4. Rank by vector similarity within the level; return top K (default 3).
5. If nothing usable: abstain.

**Production evidence rule:** For answers shown to families, only records with `status = verified` may be used as factual evidence. Records with `status = needs_review`, `expired`, `conflicting`, or `withdrawn` must NOT appear as verified evidence to families. If evidence is missing, expired, conflicting, withdrawn, or not sufficiently verified, the AI must abstain and offer a counsellor.

## 5. Answer generation

The generation step receives: the user question, the concern label, and the retrieved records (claim, value, applicability, geography level, source title, dates). It must:

- Phrase the answer in the family's language and plain words.
- Use only numbers and claims present in the records.
- State the geography level in the answer when it is not district.
- Mention applicability limits where the record has them.
- Never add facts, comparisons or predictions not in the records.
- Never guarantee jobs, salaries or admissions.

### System prompt (v1, to live in `backend/app/rag/prompts/answer_v1.md`)

```
You are a counselling assistant for a student and a parent considering vocational education in India.
You may ONLY use the records provided under RECORDS. Do not use any other knowledge for facts.
If RECORDS is empty or does not answer the question, reply with the ABSTAIN message and stop.
Write in {language}, in short, simple sentences suitable for a family with limited reading experience.
Every number or rule you state must come from a record; cite the record id in brackets, like [rec:ID].
If the geography level of a record is not district, say so in plain words (for example: "This is a state-level figure").
Mention any conditions in the record's applicability field.
Do not promise employment, salary, or admission. Do not tell the family which path to choose.
If the family seems distressed or mentions harm to themselves or others, reply with the DISTRESS message instead.
```

### Fixed messages (localised in `i18n/`)

- ABSTAIN: "I couldn't verify this from the approved sources, so I won't guess. Would you like to talk to a counsellor?"
- DISTRESS: "I'm concerned about what you shared. I'm connecting you with a person who can help, and here is a helpline you can contact now."
- CONFIRM: see section 3.

## 6. Grounding validator

After generation, `grounding.py` must check:

- Every `[rec:ID]` exists in the retrieved set.
- Every numeric value in the text appears in a cited record's value.
- No sentence makes a factual claim without a citation (heuristic: sentences containing numbers, "%", currency, "eligible", "can", "rule", "scheme" need a citation).
- No forbidden promises (regex list: "guarantee", "will definitely get", "100%", and localised equivalents).

If validation fails: regenerate once with a stricter prompt; if it fails again, return ABSTAIN and log the failure.

## 7. Agreement Mode logic

Inputs: student preference and priorities, parent preference and priorities, available pathways with attributes.

Steps:
1. Restate both preferences neutrally.
2. List each side's priorities (from structured capture, not guessed).
3. Compute shared priorities (set intersection after mapping synonyms to a fixed priority vocabulary: employment, income, growth, stability, interest, practical_work, further_education, local_opportunities, safety, status).
4. For each pathway, count how many of the combined priorities it satisfies, based on knowledge records; show pathways ranked by shared-priority coverage with the satisfying evidence.
5. Never output "better", "correct" or "should choose". Use "this pathway matches these shared priorities".

## 8. Readiness Checklist rules

Allowed status values: **Yes**, **Partly**, **No**. No other values are permitted.

| Item | Rule |
|---|---|
| Student interest clear | Yes if at least one preference stated with a reason; Partly if stated without a reason; No otherwise |
| Parent concerns addressed | Yes if all concerns resolved; Partly if some resolved; No if none resolved |
| Local demand checked | Yes if a local_opportunity record was shown; No otherwise |
| Income discussed | Yes if an income record was shown; No otherwise |
| Progression checked | Yes if the ladder was viewed; No otherwise |
| Final barrier | Highest-priority open concern, else the first unresolved item |
| Next action | Lookup table from barrier to action, for example open job_security leads to "Review employment evidence or talk to a counsellor" |

## 9. Escalation rules

Escalate and create a handoff when any holds: abstained twice in a row; the same concern asked three times without a resolved status; distress flagged; disagreement unresolved after Agreement Mode; user requests a human; retrieved records conflict; the question needs a case-specific eligibility decision.

## 10. Distress detection

Rules (keyword and phrase lists per language, reviewed by a native speaker) plus an optional classifier. On trigger: stop normal flow, show DISTRESS message with a verified helpline, create a high-priority handoff if consent allows, otherwise show contact guidance only.

## 11. Evaluation

See `docs/TEST_PLAN.md`. Targets are set after the first baseline run; do not claim numbers before measuring.
