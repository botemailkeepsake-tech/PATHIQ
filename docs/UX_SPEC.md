# UX SPEC

## 1. Principles

- Designed for a parent with limited reading experience on a low-end phone.
- Large targets (minimum 48 px, preferred 56 px), high contrast, one primary action per screen.
- Voice-first where possible; text always available.
- Show the evidence and its source plainly; never hide a source behind a tap-only affordance on the first view.
- Neutral tone: no celebratory or pressuring language.
- Every screen works in the selected language; icons support text.

## 2. Flow

1. Language selection
2. Consent screen (plain language, read-aloud button)
3. Shared Session (Screen 1)
4. Evidence and Progression (Screen 2)
5. Agreement and Family Summary (Screen 3)
6. Counsellor handoff (any time)

## 3. Screens

### Consent
Short text, read-aloud, "I am the parent/guardian and I agree" button, separate optional toggles for counsellor sharing and anonymised research. No name required.

### Screen 1: Shared Session
- Top bar: language selector, large two-state toggle **Student | Parent** (always visible; the active speaker is clearly highlighted).
- Centre: conversation with bubbles labelled by speaker.
- Bottom: large mic button and text field.
- Side panel (collapsible on mobile, bottom sheet): "Concerns so far", each with a status chip (Open / Partly / Resolved) the parent can change.
- Confirmation prompts appear inline as two large buttons (Yes / No).

### Screen 2: Evidence and Progression
- Evidence Card: claim in large text; value; source line (authority, title, published date); "Verified on" date; geography badge; applicability note; "Demo / illustrative" badge when relevant.
- Progression Ladder: vertical on mobile; each step tappable to open eligibility, rule, source, date, geography, conditions.
- "Did this help?" thumbs on each card.

### Screen 3: Agreement and Summary
- Two columns (stacked on mobile): "Student wants" and "Parent wants".
- Shared-ground band: shared priorities as chips.
- Compatible pathways with the evidence that supports each match.
- Readiness Checklist with plain status words and one line of basis each.
- Buttons: Download Family Summary, Talk to a counsellor.

### Counsellor console (minimal)
List of pending handoffs; detail page with the package; accept and complete buttons.

## 4. Required states

| State | Behaviour |
|---|---|
| Loading | Skeleton plus short text; never a blank screen |
| Abstain | Fixed ABSTAIN message and a counsellor button; no figures |
| Fallback geography | Visible badge naming the level used |
| Confirmation | Two large buttons; "No" opens a short concern picker |
| Distress | Calm message, helpline, immediate counsellor option |
| Offline / slow | Retry with message; keep the typed text |
| Consent missing | Block the session and explain why |
| Voice failed | Fall back to text with a gentle message |

## 5. Accessibility and language

- Font size selectable (normal, large, extra large).
- Read-aloud (TTS) for consent, replies and cards where supported.
- Right-to-left not required for pilot languages; keep layout direction configurable.
- All strings in `frontend/i18n/<lang>.json`; no hard-coded UI text.

## 6. Visual guidance

Calm, trustworthy palette; avoid red except for distress and errors; use icons with labels; avoid dense tables on mobile; keep the Evidence Card readable at arm's length.
