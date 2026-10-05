import { detectConcernFromUtterance, CONCERN_METADATA } from "./concern-detector";

describe("Concern Detector & Classifier", () => {
  test("detects job_security from primary parent question 'ITI ke baad job milegi kya?'", () => {
    const result = detectConcernFromUtterance("ITI ke baad job milegi kya?", "hi");
    expect(result.concernId).toBe("job_security");
    expect(result.confidence).toBe("High");
    expect(result.confidenceScore).toBeGreaterThanOrEqual(80);
    expect(result.label).toContain("Job Security");
  });

  test("detects degree_foreclosure from question 'ITI ke baad degree kar sakte hai kya?'", () => {
    const result = detectConcernFromUtterance("ITI ke baad degree kar sakte hai kya?", "hi");
    expect(result.concernId).toBe("degree_foreclosure");
    expect(result.confidence).toBe("High");
    expect(result.confidenceScore).toBeGreaterThanOrEqual(80);
    expect(result.label).toContain("Degree");
  });

  test("detects job_security from English question 'Will I get a job after ITI?'", () => {
    const result = detectConcernFromUtterance("Will I get a job after ITI?", "en");
    expect(result.concernId).toBe("job_security");
    expect(result.confidence).toBe("High");
    expect(result.label).toContain("Job Security");
  });

  test("detects income from question 'ITI electrician ki salary kitni hoti hai?'", () => {
    const result = detectConcernFromUtterance("ITI electrician ki salary kitni hoti hai?", "hi");
    expect(result.concernId).toBe("income");
    expect(result.confidence).toBe("High");
    expect(result.label).toContain("Income");
  });

  test("detects safety from question 'Is electrician work dangerous or safe?'", () => {
    const result = detectConcernFromUtterance("Is electrician work dangerous or safe?", "en");
    expect(result.concernId).toBe("safety");
    expect(result.confidence).toBe("High");
    expect(result.label).toContain("Safety");
  });

  test("detects social_perception from question 'Log kya kahenge vocational trade ko dekhkar?'", () => {
    const result = detectConcernFromUtterance("Log kya kahenge vocational trade ko dekhkar?", "hi");
    expect(result.concernId).toBe("social_perception");
    expect(result.label).toContain("Social");
  });

  test("never returns 'none' even on random or empty utterance", () => {
    const emptyResult = detectConcernFromUtterance("", "hi");
    expect(emptyResult.concernId).not.toBe("none");
    expect(["job_security", "income", "social_perception", "safety", "degree_foreclosure"]).toContain(
      emptyResult.concernId
    );

    const randomResult = detectConcernFromUtterance("random gibberish phrase 12345", "en");
    expect(randomResult.concernId).not.toBe("none");
    expect(["job_security", "income", "social_perception", "safety", "degree_foreclosure"]).toContain(
      randomResult.concernId
    );
  });

  test("exports metadata for all 5 canonical categories", () => {
    const keys = Object.keys(CONCERN_METADATA);
    expect(keys).toContain("job_security");
    expect(keys).toContain("degree_foreclosure");
    expect(keys).toContain("income");
    expect(keys).toContain("social_perception");
    expect(keys).toContain("safety");
    expect(keys).toHaveLength(5);
  });
});
