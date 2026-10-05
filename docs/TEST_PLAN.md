# TEST PLAN

## 1. Test layers

| Layer | Tool | Focus |
|---|---|---|
| Unit | pytest, vitest | Fallback logic, freshness filter, grounding validator, readiness rules, consent gate |
| Integration | pytest + test DB | Message flow, retrieval, handoff package |
| Eval (AI) | `evals/run_evals.py` | Concern classification, abstention, grounding, retrieval |
| End to end | Playwright | Demo scenario |
| Manual | Checklist | Usability with counsellors and families |

## 2. Must-pass tests (write first)

1. **Abstention:** a question with no matching record returns the ABSTAIN message and no number.
2. **Geography fallback:** with only a state record, the card shows state level and the label; with a district record, district is used; with only national, national label.
3. **Expired or conflicting records** are never returned.
4. **Needs review records** are never returned in family-facing responses; only `status = verified` records are used.
5. **Confirmation:** confidence below threshold returns `kind: confirm`; "no" stores a correction.
6. **Consent gate:** messages are rejected before session consent.
7. **Handoff consent:** a handoff without handoff consent fails.
8. **Distress:** distress phrases halt the normal flow and create a high-priority handoff when consent exists.
9. **Grounding:** an answer containing a number not in the cited record is rejected and regenerated, then abstained.
10. **Neutrality:** Agreement Mode output contains none of the banned phrases ("you should choose", "better option", "correct").
11. **Demo label:** `is_demo` records always carry the label in the API and UI.

## 3. Eval sets (`evals/`)

| File | Content | Metric |
|---|---|---|
| `concern_utterances.jsonl` | Labelled parent utterances (synthetic starter set; must be replaced or extended with real, reviewed utterances) | Precision, recall, F1 per label; confirmation rate |
| `abstention_cases.jsonl` | Questions that must abstain and questions that must be answered | Abstention accuracy |
| `retrieval_cases.jsonl` (create in M2) | Question → expected record ids | Recall@K, Precision@K |
| `grounding_cases.jsonl` (create in M2) | Generated answers with and without unsupported claims | Unsupported-claim detection rate |

Targets are set after a baseline run; do not publish numbers before measuring.

## 4. Acceptance checklist (MVP)

- [ ] Student and parent take part in one session
- [ ] Speaker identified with the toggle
- [ ] Parent concern classified; low confidence asks for confirmation
- [ ] Evidence Card shows source, date, geography
- [ ] Unsupported question produces abstention
- [ ] Progression route shows verified evidence
- [ ] Student and parent priorities compared
- [ ] Family Summary generated and downloadable
- [ ] Counsellor receives session context
- [ ] Parental consent captured; handoff consent separate
- [ ] Sensitive information access-controlled
- [ ] Demo data clearly marked
- [ ] 3-minute demo scenario runs end to end

## 5. Usability test protocol

10 to 15 families and 3 to 5 counsellors. Tasks: start a session and give consent; state a concern; read an Evidence Card and say where the figure comes from; open the ladder; reach a Family Summary; request a counsellor. Record task completion, errors, time, comprehension questions and a trust rating. Report as a small qualitative sample.

## 6. Regression rule

Any change to prompts, thresholds or the knowledge schema requires re-running `evals/run_evals.py` and the must-pass tests.
