import {
  CANONICAL_CONCERNS,
  DEMO_STUDENT_PROFILE,
  DEMO_PARENT_PROFILE,
  DEMO_DETECTED_CONCERN,
  DEMO_EVIDENCE_CARDS,
  DEMO_PROGRESSION_STEPS,
  DEMO_FAMILY_PRIORITIES,
  DEMO_FAMILY_SUMMARY,
  DEMO_COUNSELLOR_HANDOFF,
  DEMO_ABSTENTION_CASE,
  getEvidenceCardsForConcern,
  buildDynamicSummary,
  buildDynamicHandoff,
} from "./demo-data";
import { fetchEvidenceWithFallback } from "./api";
import { detectConcernFromUtterance } from "./concern-detector";

describe("Demo Data & Architecture", () => {
  it("contains exactly 5 canonical concern categories and none is not included", () => {
    expect(CANONICAL_CONCERNS.length).toBe(5);
    const ids = CANONICAL_CONCERNS.map((c) => c.id);
    expect(ids).toContain("job_security");
    expect(ids).toContain("income");
    expect(ids).toContain("social_perception");
    expect(ids).toContain("safety");
    expect(ids).toContain("degree_foreclosure");
    expect(ids).not.toContain("none");
  });

  it("defines student and parent profiles with quotes and aspirations", () => {
    expect(DEMO_STUDENT_PROFILE.trade).toContain("Electrician");
    expect(DEMO_STUDENT_PROFILE.quote).toBeDefined();
    expect(DEMO_STUDENT_PROFILE.aspirations.length).toBeGreaterThan(0);

    expect(DEMO_PARENT_PROFILE.primaryQuery).toBe("ITI ke baad job milegi kya?");
    expect(DEMO_PARENT_PROFILE.concerns.length).toBeGreaterThan(0);
  });

  it("configures detected concern for job_security with high confidence", () => {
    expect(DEMO_DETECTED_CONCERN.concernId).toBe("job_security");
    expect(DEMO_DETECTED_CONCERN.confidence).toBe("High");
    expect(DEMO_DETECTED_CONCERN.triggerUtterance).toBe("ITI ke baad job milegi kya?");
  });

  it("marks all synthetic evidence cards explicitly as isDemo: true across all 5 canonical categories", () => {
    expect(DEMO_EVIDENCE_CARDS.length).toBeGreaterThanOrEqual(5);
    for (const card of DEMO_EVIDENCE_CARDS) {
      expect(card.isDemo).toBe(true);
      expect(card.source.title).toBeDefined();
      expect(card.source.authority).toBeDefined();
      expect(card.whyThisMatters).toBeDefined();
      expect(card.applicability).toBeDefined();
    }
  });

  it("retrieves targeted evidence for each canonical concern", () => {
    const jobCards = getEvidenceCardsForConcern("job_security");
    expect(jobCards[0].topic).toBe("job_security");

    const degreeCards = getEvidenceCardsForConcern("degree_foreclosure");
    expect(degreeCards[0].topic).toBe("degree_foreclosure");

    const incomeCards = getEvidenceCardsForConcern("income");
    expect(incomeCards[0].topic).toBe("income");

    const safetyCards = getEvidenceCardsForConcern("safety");
    expect(safetyCards[0].topic).toBe("safety");

    const socialCards = getEvidenceCardsForConcern("social_perception");
    expect(socialCards[0].topic).toBe("social_perception");
  });

  it("outlines the 5-stage educational progression ladder", () => {
    expect(DEMO_PROGRESSION_STEPS.length).toBe(5);
    expect(DEMO_PROGRESSION_STEPS[0].title).toContain("10th");
    expect(DEMO_PROGRESSION_STEPS[1].title).toContain("ITI");
    expect(DEMO_PROGRESSION_STEPS[3].title).toContain("Diploma");
    expect(DEMO_PROGRESSION_STEPS[4].title).toContain("Degree");
  });

  it("structures family priorities without declaring a winner", () => {
    expect(DEMO_FAMILY_PRIORITIES.sharedPriorities.length).toBeGreaterThanOrEqual(2);
    expect(DEMO_FAMILY_PRIORITIES.divergentPriorities.length).toBeGreaterThanOrEqual(2);
    expect(DEMO_FAMILY_PRIORITIES.synthesisNote).toContain("PATHIQ does not choose");
  });

  it("dynamically generates summary and counsellor handoff based on user input", () => {
    const summary = buildDynamicSummary("iti", "degree_foreclosure", "ITI ke baad degree kar sakte hai kya?");
    expect(summary.parentConcerns[0]).toContain("Degree");
    expect(summary.parentQuote).toContain("degree kar sakte");

    const handoff = buildDynamicHandoff("iti", "degree_foreclosure", "ITI ke baad degree kar sakte hai kya?", "I want hands on work");
    expect(handoff.packetId).toBeDefined();
    expect(handoff.evidenceAttached.length).toBeGreaterThan(0);
    expect(handoff.openQuestionsForCounsellor.length).toBeGreaterThan(0);
  });

  it("supports safe abstention on hyper-local questions", () => {
    expect(DEMO_ABSTENTION_CASE.question).toBe("ITI electrician salary in my exact village?");
    expect(DEMO_ABSTENTION_CASE.abstentionReason).toBe("INSUFFICIENT_GROUNDED_EVIDENCE");
    expect(DEMO_ABSTENTION_CASE.suggestedNextSteps.length).toBeGreaterThan(0);
  });

  it("fetches evidence with fallback safely", async () => {
    const result = await fetchEvidenceWithFallback("job_security", "electrician");
    expect(result.cards.length).toBeGreaterThan(0);
    expect(["api", "demo_fallback"]).toContain(result.sourceMode);
  });
});

describe("Client-Side Concern Classifier", () => {
  it("detects job_security from 'ITI ke baad job milegi kya?' with High confidence", () => {
    const res = detectConcernFromUtterance("ITI ke baad job milegi kya?", "hi");
    expect(res.concernId).toBe("job_security");
    expect(res.confidence).toBe("High");
    expect(res.confidenceScore).toBeGreaterThanOrEqual(80);
    expect(res.confirmationPrompt).toBe("Is this what you're concerned about?");
  });

  it("detects degree_foreclosure from 'ITI ke baad degree kar sakte hai kya?' with High confidence", () => {
    const res = detectConcernFromUtterance("ITI ke baad degree kar sakte hai kya?", "hi");
    expect(res.concernId).toBe("degree_foreclosure");
    expect(res.confidence).toBe("High");
    expect(res.confidenceScore).toBeGreaterThanOrEqual(80);
  });

  it("detects job_security from English 'Will I get a job after ITI?' with High confidence", () => {
    const res = detectConcernFromUtterance("Will I get a job after ITI?", "en");
    expect(res.concernId).toBe("job_security");
    expect(res.confidence).toBe("High");
  });

  it("detects degree_foreclosure from English 'Can I do a degree after ITI?' with High confidence", () => {
    const res = detectConcernFromUtterance("Can I do a degree after ITI?", "en");
    expect(res.concernId).toBe("degree_foreclosure");
    expect(res.confidence).toBe("High");
  });

  it("detects job_security from Marathi 'ITI nantar nokari milel ka?' with High confidence", () => {
    const res = detectConcernFromUtterance("ITI nantar nokari milel ka?", "mr");
    expect(res.concernId).toBe("job_security");
    expect(res.confidence).toBe("High");
  });

  it("detects income concern from 'salary kitni hogi?'", () => {
    const res = detectConcernFromUtterance("ITI electrician ki salary kitni hogi?", "hi");
    expect(res.concernId).toBe("income");
    expect(res.confidence).toBe("High");
  });

  it("detects safety concern from 'Is electrician work safe or dangerous?'", () => {
    const res = detectConcernFromUtterance("Is electrician work safe or dangerous?", "en");
    expect(res.concernId).toBe("safety");
    expect(res.confidence).toBe("High");
  });

  it("detects social_perception from 'samaj aur rishtedar kya kahenge?'", () => {
    const res = detectConcernFromUtterance("samaj aur rishtedar kya kahenge?", "hi");
    expect(res.concernId).toBe("social_perception");
    expect(res.confidence).toBe("High");
  });

  it("never outputs 'none' as persisted concern", () => {
    const res = detectConcernFromUtterance("all good okay fine", "en");
    expect(res.concernId).not.toBe("none");
    expect(["job_security", "income", "social_perception", "safety", "degree_foreclosure"]).toContain(res.concernId);
  });
});
