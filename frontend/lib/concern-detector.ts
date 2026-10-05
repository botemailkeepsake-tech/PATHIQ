/**
 * Client-side Concern Classifier
 * Strictly adheres to PATHIQ's 5 canonical concern categories:
 * - job_security
 * - income
 * - social_perception
 * - safety
 * - degree_foreclosure
 * 
 * Never persists 'none'.
 */

export interface DetectedConcernResult {
  concernId: "job_security" | "income" | "social_perception" | "safety" | "degree_foreclosure";
  label: string;
  hindiLabel: string;
  marathiLabel: string;
  confidence: "High" | "Medium" | "Low";
  confidenceScore: number;
  triggerUtterance: string;
  explanation: string;
  confirmationPrompt: string;
  isHighConfidence: boolean;
}

export const CONCERN_METADATA: Record<
  string,
  { label: string; hindiLabel: string; marathiLabel: string; defaultExpl: string }
> = {
  job_security: {
    label: "Job Security & Employment",
    hindiLabel: "रोज़गार व नौकरी की सुरक्षा",
    marathiLabel: "नोकरी व रोजगाराची सुरक्षा",
    defaultExpl:
      "Concern detected from question regarding employment availability, job placement rates, and long-term career stability.",
  },
  degree_foreclosure: {
    label: "Future Degree Progression",
    hindiLabel: "आगे की उच्च शिक्षा (डिप्लोमा / डिग्री)",
    marathiLabel: "पुढील उच्च शिक्षण (डिप्लोमा / पदवी)",
    defaultExpl:
      "Concern detected from question regarding higher education eligibility, polytechnic lateral entry, and engineering degree options.",
  },
  income: {
    label: "Income & Wage Growth",
    hindiLabel: "वेतन और आय वृद्धि",
    marathiLabel: "वेतन आणि उत्पन्न वाढ",
    defaultExpl:
      "Concern detected from inquiry into monthly earnings, apprentice stipends, and compensation growth over time.",
  },
  social_perception: {
    label: "Social Status & Perception",
    hindiLabel: "सामाजिक प्रतिष्ठा व सम्मान",
    marathiLabel: "सामाजिक प्रतिष्ठा व आदर",
    defaultExpl:
      "Concern detected from questions about community perception, prestige, and family/relative views on vocational trades.",
  },
  safety: {
    label: "Workplace Safety & Health",
    hindiLabel: "कार्यस्थल सुरक्षा व बचाव",
    marathiLabel: "कामाच्या ठिकाणची सुरक्षितता",
    defaultExpl:
      "Concern detected from inquiries about electrical hazards, physical risks, protective equipment, and insurance norms.",
  },
};

const KEYWORD_MAP: Record<string, string[]> = {
  job_security: [
    "job", "naukri", "nokari", "rozgar", "employment", "kaam", "kam", "work", "stable",
    "stability", "placement", "closure", "layoff", "layoffs", "unemployment", "jobless",
    "factory", "company", "career", "future", "milegi kya", "milel ka", "job milegi",
    "secure", "suraksha", "kachhi", "pakki", "chhutti", "berozgari",
  ],
  degree_foreclosure: [
    "degree", "diploma", "btech", "b.tech", "engineering", "graduation", "college",
    "university", "further study", "higher study", "higher education", "further education",
    "degree kar", "diploma kar", "btech kar", "engineering kar", "degree karta yete",
    "karta yete", "aage padhai", "polytechnic", "lateral entry", "shikshan", "padhai band",
    "door closed", "foreclosure",
  ],
  income: [
    "income", "salary", "pay", "wage", "wages", "earning", "earnings", "money", "rupees",
    "paisa", "paise", "stipend", "package", "kitna milega", "kamai", "vetan", "kharcha",
    "mehengai", "support", "afford", "salary kitni",
  ],
  social_perception: [
    "relative", "relatives", "family", "community", "society", "log kya", "kya kahenge",
    "rishtedar", "samaj", "izzat", "respect", "prestige", "status", "shame", "sharam",
    "apman", "heena", "lok kay mhanatil", "parivar",
  ],
  safety: [
    "safe", "safety", "danger", "dangerous", "risk", "risky", "hazard", "hazardous",
    "injury", "injured", "accident", "night shift", "shift", "electric", "electricity",
    "current", "shock", "ladki", "female", "women", "surakshit", "dhoka",
  ],
};

export function detectConcernFromUtterance(
  text: string,
  _lang: string = "hi"
): DetectedConcernResult {
  const lower = (text || "").toLowerCase().trim();

  // 1. Exact canonical matches for key hackathon demo prompts
  if (
    lower.includes("job milegi kya") ||
    lower.includes("job milegi") ||
    lower.includes("nokari milel ka") ||
    lower.includes("will i get a job") ||
    lower.includes("job security") ||
    lower.includes("naukri milegi")
  ) {
    return buildResult("job_security", 0.88, text, "High");
  }

  if (
    lower.includes("degree kar sakte") ||
    lower.includes("degree kar sakte hai") ||
    lower.includes("can i do a degree") ||
    lower.includes("diploma kar sakte") ||
    lower.includes("degree karta yete") ||
    lower.includes("higher education")
  ) {
    return buildResult("degree_foreclosure", 0.90, text, "High");
  }

  if (
    lower.includes("salary") ||
    lower.includes("income") ||
    lower.includes("paisa") ||
    lower.includes("vetan") ||
    lower.includes("kitna kama")
  ) {
    return buildResult("income", 0.86, text, "High");
  }

  if (
    lower.includes("log kya") ||
    lower.includes("rishtedar") ||
    lower.includes("samaj") ||
    lower.includes("izzat") ||
    lower.includes("prestige")
  ) {
    return buildResult("social_perception", 0.85, text, "High");
  }

  if (
    lower.includes("safe") ||
    lower.includes("danger") ||
    lower.includes("shock") ||
    lower.includes("current") ||
    lower.includes("accident")
  ) {
    return buildResult("safety", 0.85, text, "High");
  }

  // 2. Keyword scoring
  const scores: Record<string, number> = {
    job_security: 0,
    degree_foreclosure: 0,
    income: 0,
    social_perception: 0,
    safety: 0,
  };

  for (const [concernKey, keywords] of Object.entries(KEYWORD_MAP)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        scores[concernKey] += 1;
      }
    }
  }

  let bestConcern = "job_security";
  let maxScore = 0;
  for (const [key, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestConcern = key;
    }
  }

  if (maxScore >= 2) {
    return buildResult(bestConcern, 0.82, text, "High");
  } else if (maxScore === 1) {
    return buildResult(bestConcern, 0.68, text, "Medium");
  }

  // Fallback if no keywords matched: return default with low confidence
  return buildResult("job_security", 0.54, text, "Low");
}

function buildResult(
  concernKey: string,
  rawScore: number,
  utterance: string,
  confidence: "High" | "Medium" | "Low"
): DetectedConcernResult {
  const meta = CONCERN_METADATA[concernKey] || CONCERN_METADATA.job_security;
  const isHigh = confidence === "High";

  const confirmationPrompt = isHigh
    ? "Is this what you're concerned about?"
    : `It sounds like your main concern may be ${meta.label.toLowerCase()}. Is that right?`;

  return {
    concernId: concernKey as any,
    label: meta.label,
    hindiLabel: meta.hindiLabel,
    marathiLabel: meta.marathiLabel,
    confidence,
    confidenceScore: Math.round(rawScore * 100),
    triggerUtterance: utterance || "ITI ke baad job milegi kya?",
    explanation: meta.defaultExpl,
    confirmationPrompt,
    isHighConfidence: isHigh,
  };
}
