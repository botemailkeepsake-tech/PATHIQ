/**
 * PATHIQ Central Demo Data
 * 
 * "When a career choice becomes a family decision,
 *  PATHIQ gives both sides the evidence to decide together."
 * 
 * All synthetic records are explicitly tagged with isDemo: true.
 */

export interface StudentProfile {
  name: string;
  age: number;
  education: string;
  interest: string;
  trade: string;
  quote: string;
  aspirations: string[];
}

export interface ParentProfile {
  name: string;
  role: string;
  language: string;
  primaryQuery: string;
  quote: string;
  concerns: string[];
}

export interface ConcernCategory {
  id: string;
  label: string;
  hindiLabel: string;
  description: string;
  icon: string;
}

export interface DetectedConcern {
  concernId: string;
  label: string;
  confidence: "High" | "Medium" | "Low";
  confidenceScore: number;
  triggerUtterance: string;
  speaker: "parent" | "student";
  explanation: string;
  isConfirmed: boolean;
  needsConfirmation: boolean;
}

export interface ValueObject {
  text: string;
  numeric?: number;
  unit?: string;
}

export interface SourceObject {
  title: string;
  authority: string;
  type: "official_notification" | "government_report" | "survey" | "institutional" | "other";
  publishedDate?: string;
  reference?: string;
  documentRef?: string;
  url?: string;
}

export interface GeographyObject {
  level: "district" | "state" | "national";
  code: string;
  label: string;
}

export interface EvidenceCardData {
  id: string;
  recordId: string;
  topic: string;
  topicLabel: string;
  trade: string;
  claim: string;
  hindiClaim?: string;
  value: ValueObject;
  source: SourceObject;
  geography: GeographyObject;
  applicability: string;
  whyThisMatters: string;
  verifiedDate: string;
  status: "verified" | "needs_review" | "expired";
  isDemo: boolean;
  isVerified: boolean;
}

export interface ProgressionStep {
  step: number;
  stage: string;
  title: string;
  duration: string;
  description: string;
  credential: string;
  keyRule?: string;
  isMilestone?: boolean;
}

export interface FamilyPrioritiesData {
  studentPriorities: {
    title: string;
    description: string;
  }[];
  parentPriorities: {
    title: string;
    description: string;
  }[];
  sharedPriorities: {
    title: string;
    description: string;
  }[];
  divergentPriorities: {
    dimension: string;
    studentView: string;
    parentView: string;
    dialoguePrompt: string;
  }[];
  synthesisNote: string;
}

export interface FamilySummaryData {
  studentPreference: string;
  studentQuote: string;
  parentConcerns: string[];
  parentQuote: string;
  evidenceCardsReviewed: number;
  sharedPriorities: string[];
  stillToVerify: string[];
  suggestedAction: string;
  counsellorReadinessScore: string;
}

export interface CounsellorHandoffData {
  packetId: string;
  studentName: string;
  familyLocation: string;
  chosenTrade: string;
  studentInterests: string[];
  parentConcerns: string[];
  evidenceAttached: {
    title: string;
    source: string;
    stat: string;
  }[];
  openQuestionsForCounsellor: string[];
  recommendedDiscussionPoints: string[];
  generatedAt: string;
  status: "ready_to_send" | "sent";
}

export interface AbstentionCaseData {
  question: string;
  topic: string;
  attemptedScope: string;
  abstentionReason: string;
  explanation: string;
  suggestedNextSteps: string[];
  counsellorPrompt: string;
}

// ---------------------------------------------------------------------------
// CANONICAL CONCERN TAXONOMY
// ---------------------------------------------------------------------------
export const CANONICAL_CONCERNS: ConcernCategory[] = [
  {
    id: "job_security",
    label: "Job Security & Employment",
    hindiLabel: "रोज़गार व नौकरी की सुरक्षा",
    description: "Whether graduating leads to steady, long-term formal or reliable employment.",
    icon: "briefcase",
  },
  {
    id: "income",
    label: "Income & Wage Growth",
    hindiLabel: "वेतन और आय वृद्धि",
    description: "Starting salary, stipend levels, and incremental earnings over 3-5 years.",
    icon: "currency",
  },
  {
    id: "social_perception",
    label: "Social Status & Perception",
    hindiLabel: "सामाजिक प्रतिष्ठा",
    description: "Respect in the community compared to traditional graduation paths.",
    icon: "users",
  },
  {
    id: "safety",
    label: "Workplace Safety & Health",
    hindiLabel: "कार्यस्थल सुरक्षा",
    description: "Physical working conditions, protective gear, hazard insurance, and risks.",
    icon: "shield",
  },
  {
    id: "degree_foreclosure",
    label: "Future Degree Progression",
    hindiLabel: "आगे की उच्च शिक्षा (डिप्लोमा / डिग्री)",
    description: "Whether taking a vocational route prevents lateral entry into Polytechnic or B.Tech.",
    icon: "graduation-cap",
  },
];

// ---------------------------------------------------------------------------
// DEMO ACTORS
// ---------------------------------------------------------------------------
export const DEMO_STUDENT_PROFILE: StudentProfile = {
  name: "Aakash Deshmukh",
  age: 17,
  education: "Completed 10th Standard (SSC - 68%)",
  interest: "Electrical Systems & Practical Equipment",
  trade: "Electrician (NCVT - 2 Years)",
  quote: "I'm interested in becoming an electrician. I want to learn hands-on technical skills and start earning early.",
  aspirations: [
    "Work on practical wiring, motors, and commercial automation",
    "Attain government-certified wireman licence",
    "Gain financial self-reliance by age 19",
  ],
};

export const DEMO_PARENT_PROFILE: ParentProfile = {
  name: "Suresh Deshmukh (Father)",
  role: "Parent / Primary Breadwinner",
  language: "Hindi / Marathi",
  primaryQuery: "ITI ke baad job milegi kya?",
  quote: "What concerns you most? We want to know if ITI leads to a secure job and if he can still study for a degree later.",
  concerns: [
    "Job security and steady monthly employment",
    "Whether he gets locked out of higher college education",
  ],
};

// ---------------------------------------------------------------------------
// DETECTED CONCERN
// ---------------------------------------------------------------------------
export const DEMO_DETECTED_CONCERN: DetectedConcern = {
  concernId: "job_security",
  label: "Job Security & Employment",
  confidence: "High",
  confidenceScore: 0.88,
  triggerUtterance: "ITI ke baad job milegi kya?",
  speaker: "parent",
  explanation: "Concern detected from parent's query regarding employment probability, stability, and whether ITI qualification guarantees reliable work.",
  isConfirmed: true,
  needsConfirmation: false,
};

// ---------------------------------------------------------------------------
// EVIDENCE CARDS (Clearly marked as synthetic demo data from authoritative frameworks)
// ---------------------------------------------------------------------------
export const DEMO_EVIDENCE_CARDS: EvidenceCardData[] = [
  {
    id: "ev-card-01",
    recordId: "7f4c9c12-32a1-4328-98e2-b184f88e1001",
    topic: "job_security",
    topicLabel: "Job Security & Placement",
    trade: "Electrician",
    claim: "ITI Electrician graduates in Maharashtra have a verified placement rate of 72% within 6 months of course completion.",
    hindiClaim: "महाराष्ट्र में ITI इलेक्ट्रिशियन स्नातकों की 6 महीने के भीतर प्लेसमेंट दर 72% है।",
    value: {
      text: "72% placement within 6 months (Sample: 1,240 graduates)",
      numeric: 72,
      unit: "%",
    },
    source: {
      title: "Maharashtra State Skill Development Society Annual Report 2023-24",
      authority: "Directorate of Vocational Education & Training (DVET) / MSSDS",
      type: "government_report",
      documentRef: "MSSDS-AR-2023-24-Chapter4.pdf",
      url: "https://mssds.maharashtra.gov.in/annual-report",
      publishedDate: "2024-06-15",
    },
    geography: {
      level: "state",
      code: "MH",
      label: "Maharashtra (Statewide)",
    },
    applicability: "Based on official tracer study of NCVT-affiliated ITI Electrician batch across government & private ITIs in Maharashtra.",
    whyThisMatters: "Formal technical qualifications in electrical trade create direct access to state utility contractors, industrial manufacturing estates (MIDC), and licensed commercial electrical contractors.",
    verifiedDate: "2024-07-10",
    status: "verified",
    isDemo: true,
    isVerified: true,
  },
  {
    id: "ev-card-02",
    recordId: "8e5d0a23-43b2-5439-09f3-c295a99f2002",
    topic: "degree_foreclosure",
    topicLabel: "Degree Progression & Mobility",
    trade: "Electrician",
    claim: "ITI Electrician graduates are officially eligible for direct lateral entry into the 2nd year of Diploma in Electrical Engineering in polytechnics.",
    hindiClaim: "ITI इलेक्ट्रिशियन स्नातक महाराष्ट्र के पॉलिटेक्निक में इलेक्ट्रिकल इंजीनियरिंग डिप्लोमा के दूसरे वर्ष में लेटरल एंट्री के पात्र हैं।",
    value: {
      text: "Direct Lateral Entry into Year 2 Diploma (Credit Transfer Approved)",
      numeric: 2,
      unit: "Year",
    },
    source: {
      title: "Maharashtra State Board of Technical Education Lateral Entry Notification",
      authority: "Maharashtra State Board of Technical Education (MSBTE)",
      type: "official_notification",
      documentRef: "MSBTE-LE-2024-Electrical.pdf",
      url: "https://msbte.org.in/lateral-entry",
      publishedDate: "2024-04-01",
    },
    geography: {
      level: "state",
      code: "MH",
      label: "Maharashtra (Statewide)",
    },
    applicability: "Applicable to NCVT 2-year ITI Electrician certificate holders with minimum 60% aggregate marks through Centralized Admission Process (CAP).",
    whyThisMatters: "Choosing ITI is NOT an educational dead end. The student can work for a year, take up an apprenticeship, and still transition into Diploma engineering and subsequently a B.Tech / B.Voc degree.",
    verifiedDate: "2024-04-25",
    status: "verified",
    isDemo: true,
    isVerified: true,
  },
  {
    id: "ev-card-03",
    recordId: "9f6e1b34-54c3-6540-10a4-d306b11a3003",
    topic: "income",
    topicLabel: "Income & Wage Structure",
    trade: "Electrician",
    claim: "ITI Electrician apprentices in Maharashtra receive a mandated monthly stipend of ₹9,800 to ₹12,500 under NAPS, transitioning to ₹16,500 - ₹22,000 monthly starting salary.",
    hindiClaim: "महाराष्ट्र में ITI इलेक्ट्रिशियन प्रशिक्षुओं को NAPS के तहत ₹9,800 से ₹12,500 का मासिक वजीफा और ₹16,500 - ₹22,000 प्रारंभिक वेतन मिलता है।",
    value: {
      text: "₹16,500 - ₹22,000/month initial entry wages (Skilled Category)",
      numeric: 16500,
      unit: "₹",
    },
    source: {
      title: "Maharashtra State Apprenticeship & Skilled Wages Notification",
      authority: "Labour & Employment Department, Government of Maharashtra",
      type: "government_report",
      documentRef: "MAH-LAB-2024-WAGES-SEC4.pdf",
      url: "https://mahakamgar.maharashtra.gov.in",
      publishedDate: "2024-05-10",
    },
    geography: {
      level: "state",
      code: "MH",
      label: "Maharashtra (Statewide)",
    },
    applicability: "Applicable to certified wiremen and electrical trade apprentices in MIDC industrial corridors.",
    whyThisMatters: "Provides guaranteed legal wage protections and apprentice stipends so candidates earn while completing industrial training.",
    verifiedDate: "2024-06-01",
    status: "verified",
    isDemo: true,
    isVerified: true,
  },
  {
    id: "ev-card-04",
    recordId: "af7f2c45-65d4-7651-21b5-e417c22b4004",
    topic: "social_perception",
    topicLabel: "Social Status & Recognition",
    trade: "Electrician",
    claim: "84% of surveyed families of NCVT-certified electricians report improved economic self-reliance and formal community standing within 3 years of trade qualification.",
    hindiClaim: "NCVT-प्रमाणित इलेक्ट्रिशियनों के 84% परिवारों ने 3 वर्षों के भीतर आर्थिक आत्मनिर्भरता और सम्मानजनक सामाजिक स्थिति की पुष्टि की।",
    value: {
      text: "84% positive community standing after 3 years",
      numeric: 84,
      unit: "%",
    },
    source: {
      title: "Directorate General of Training Socio-Economic Tracer Survey 2023",
      authority: "Ministry of Skill Development and Entrepreneurship (MSDE)",
      type: "survey",
      documentRef: "MSDE-TRACER-2023-VOL2.pdf",
      url: "https://dgt.gov.in/tracer-study",
      publishedDate: "2023-11-20",
    },
    geography: {
      level: "state",
      code: "MH",
      label: "Maharashtra (Statewide)",
    },
    applicability: "Cross-sectional survey of 2,400 technical trade graduates across western India.",
    whyThisMatters: "Licensed electrical trade is an essential engineering service that commands community respect and dependable livelihoods.",
    verifiedDate: "2024-03-15",
    status: "verified",
    isDemo: true,
    isVerified: true,
  },
  {
    id: "ev-card-05",
    recordId: "bf803d56-76e5-8762-32c6-f528d33c5005",
    topic: "safety",
    topicLabel: "Workplace Safety & Standards",
    trade: "Electrician",
    claim: "Government-accredited ITI electrical programs mandate Central Electricity Authority (CEA 2023) certified safety protocols, PPE equipment training, and covered medical insurance.",
    hindiClaim: "सरकारी मान्यता प्राप्त ITI इलेक्ट्रिकल कार्यक्रम केंद्रीय विद्युत प्राधिकरण (CEA 2023) सुरक्षा प्रोटोकॉल और पीपीई प्रशिक्षण अनिवार्य करते हैं।",
    value: {
      text: "100% compliance with CEA Electrical Safety Standards",
      numeric: 100,
      unit: "%",
    },
    source: {
      title: "Central Electricity Authority Safety & Health Regulations 2023",
      authority: "Central Electricity Authority (CEA), Ministry of Power",
      type: "official_notification",
      documentRef: "CEA-SAFETY-REG-2023.pdf",
      url: "https://cea.nic.in/safety-regulations",
      publishedDate: "2023-08-14",
    },
    geography: {
      level: "national",
      code: "IN",
      label: "National / Maharashtra Adopted",
    },
    applicability: "Mandatory standard for all NCVT electrical training institutes and industrial apprentice sites.",
    whyThisMatters: "Strict institutional compliance with electrical isolation and high-voltage safety mitigates physical workplace hazards.",
    verifiedDate: "2024-01-20",
    status: "verified",
    isDemo: true,
    isVerified: true,
  },
];

export function getEvidenceCardsForConcern(concernId: string): EvidenceCardData[] {
  const match = DEMO_EVIDENCE_CARDS.find((c) => c.topic === concernId);
  if (match) {
    // Return matching card first, then other cards
    const others = DEMO_EVIDENCE_CARDS.filter((c) => c.topic !== concernId);
    return [match, ...others];
  }
  return DEMO_EVIDENCE_CARDS;
}

// ---------------------------------------------------------------------------
// PROGRESSION PATHWAY
// ---------------------------------------------------------------------------
export const DEMO_PROGRESSION_STEPS: ProgressionStep[] = [
  {
    step: 1,
    stage: "Foundation",
    title: "10th Standard (SSC)",
    duration: "Baseline",
    description: "Completion of Secondary School Certificate with Science and Mathematics fundamentals.",
    credential: "State Board SSC Certificate",
  },
  {
    step: 2,
    stage: "Vocational Certification",
    title: "ITI Electrician Trade",
    duration: "2 Years",
    description: "Hands-on electrical wiring, DC/AC machines, industrial transformers, wiring diagrams, and national safety codes.",
    credential: "National Trade Certificate (NTC / NCVT)",
    keyRule: "Provides Class-C Electrical Supervisor/Wireman licence eligibility.",
    isMilestone: true,
  },
  {
    step: 3,
    stage: "Industry Transition",
    title: "Apprenticeship & Employment",
    duration: "1 Year",
    description: "Dual system industrial training under National Apprenticeship Promotion Scheme (NAPS) with guaranteed stipend.",
    credential: "National Apprenticeship Certificate (NAC)",
    keyRule: "Earn while learning; builds 1 year formal industrial work history.",
  },
  {
    step: 4,
    stage: "Higher Technical Qualification",
    title: "Diploma in Electrical Engineering",
    duration: "2 Years (Direct Lateral Entry)",
    description: "Direct entry into 2nd year of Polytechnic via MSBTE Centralized Admission Process. Bypasses 1st year.",
    credential: "State Diploma in Engineering",
    keyRule: "Government quota reserved specifically for ITI certificate holders.",
    isMilestone: true,
  },
  {
    step: 5,
    stage: "Degree & Advanced Management",
    title: "B.Tech / B.Voc Degree",
    duration: "3 Years (Direct 2nd Year Lateral Entry)",
    description: "Eligible for lateral entry into 2nd year Bachelor of Technology (B.Tech) or B.Voc in Electrical/Power Systems.",
    credential: "University Bachelor's Degree",
    keyRule: "Preserves complete pathway from shop floor to chartered engineering.",
  },
];

// ---------------------------------------------------------------------------
// FAMILY PRIORITIES COMPARISON
// ---------------------------------------------------------------------------
export const DEMO_FAMILY_PRIORITIES: FamilyPrioritiesData = {
  studentPriorities: [
    {
      title: "Practical Technical Training",
      description: "Desires hands-on applied workshop experience instead of abstract 4-year classroom theory.",
    },
    {
      title: "Early Financial Independence",
      description: "Wants to earn an apprenticeship stipend by age 18 and support own expenses.",
    },
    {
      title: "Active Equipment Engagement",
      description: "Strong personal affinity for electrical machinery, wiring circuits, and field operations.",
    },
  ],
  parentPriorities: [
    {
      title: "Guaranteed Job Security",
      description: "Wants reassurance of steady, licensed employment with minimal risk of long-term joblessness.",
    },
    {
      title: "Future Degree Progression",
      description: "Wants certainty that taking ITI does not permanently lock the door to becoming an engineer.",
    },
    {
      title: "Social Standing & Dignity",
      description: "Seeks social respect in the family network comparable to general degree graduates.",
    },
  ],
  sharedPriorities: [
    {
      title: "Long-term Career Stability",
      description: "Both student and parent prioritize dependable employment in a resilient industry that cannot be automated away.",
    },
    {
      title: "Continuous Upward Growth",
      description: "Both want the option to advance from technician roles to supervisory and managerial responsibilities.",
    },
  ],
  divergentPriorities: [
    {
      dimension: "Learning Style & Time Horizon",
      studentView: "Urgent focus on immediate hands-on skills and working early (2-year horizon).",
      parentView: "Concern about formal institutional pedigree and long-term societal credibility (5-10 year horizon).",
      dialoguePrompt: "How can the 2-year ITI route serve as step 1 of the parent's desired 5-year degree plan?",
    },
    {
      dimension: "Workplace Perception",
      studentView: "Views technical trade as modern, licensed, in-demand technical craft.",
      parentView: "Wonders if relatives will view ITI as inferior to standard BA/B.Sc/B.Com degree.",
      dialoguePrompt: "Examine placement and salary data comparing ITI technicians vs. non-technical general graduates.",
    },
  ],
  synthesisNote: "PATHIQ found areas of strong alignment around long-term stability. The difference is primarily chronological sequence, not destination. PATHIQ does not choose between student and parent; it provides the map for both to decide together.",
};

// ---------------------------------------------------------------------------
// FAMILY DECISION SUMMARY
// ---------------------------------------------------------------------------
export const DEMO_FAMILY_SUMMARY: FamilySummaryData = {
  studentPreference: "Electrician Trade (NCVT 2-Year ITI) at Government ITI",
  studentQuote: "\"I want to work with real machines and get certified quickly.\"",
  parentConcerns: [
    "Job security and initial employment guarantee",
    "Preserving higher diploma & degree mobility",
  ],
  parentQuote: "\"If the government recognizes lateral entry into engineering, I feel much safer supporting his choice.\"",
  evidenceCardsReviewed: 2,
  sharedPriorities: [
    "Long-term livelihood stability in Maharashtra",
    "Continuous educational progression through MSBTE lateral entry",
  ],
  stillToVerify: [
    "Available seats in nearby Government ITI (e.g. Pune / Nagpur / Nashik)",
    "Local industrial apprenticeship placement rates for 2024-25 cycle",
    "Hostel accommodation and wireman licence exam timelines",
  ],
  suggestedAction: "Schedule a 20-minute discussion with an authorized district vocational counsellor to verify local ITI seat quotas.",
  counsellorReadinessScore: "94% Prepared (Structured Evidence Packet Assembled)",
};

// ---------------------------------------------------------------------------
// COUNSELLOR HANDOFF PACKET
// ---------------------------------------------------------------------------
export const DEMO_COUNSELLOR_HANDOFF: CounsellorHandoffData = {
  packetId: "PQ-MH-2024-8842",
  studentName: "Aakash Deshmukh",
  familyLocation: "Maharashtra, India",
  chosenTrade: "Electrician (NCVT Craftsman Training Scheme)",
  studentInterests: [
    "Electrical circuits & residential wiring",
    "Hands-on workshop training",
    "Early earning via apprenticeships",
  ],
  parentConcerns: [
    "Job security within 6-12 months of course completion",
    "Eligibility for 2nd-year Diploma Lateral Entry (MSBTE)",
  ],
  evidenceAttached: [
    {
      title: "DVET/MSSDS Tracer Report",
      source: "Directorate of Vocational Education & Training, Maharashtra",
      stat: "72% placement within 6 months",
    },
    {
      title: "MSBTE Lateral Entry Regulation",
      source: "Maharashtra State Board of Technical Education",
      stat: "Direct admission to 2nd Year Diploma (60%+ marks)",
    },
  ],
  openQuestionsForCounsellor: [
    "Which local ITIs in the district offer the best industry apprenticeship tie-ups?",
    "What is the current intake cutoff for Government ITI Electrician seats?",
    "What are the specific steps for CAP admission under MSBTE lateral entry?",
  ],
  recommendedDiscussionPoints: [
    "Explain the apprenticeship stipend structure under NAPS to reassure the parent on initial earnings.",
    "Show the physical list of polytechnic colleges accepting lateral entry diploma candidates.",
    "Help the student identify whether Government ITI or Private ITI is optimal for their location.",
  ],
  generatedAt: new Date().toISOString(),
  status: "ready_to_send",
};

// ---------------------------------------------------------------------------
// ABSTENTION CASE (Safety & Grounding Proof)
// ---------------------------------------------------------------------------
export const DEMO_ABSTENTION_CASE: AbstentionCaseData = {
  question: "ITI electrician salary in my exact village?",
  topic: "income",
  attemptedScope: "Village / Gram Panchayat level",
  abstentionReason: "INSUFFICIENT_GROUNDED_EVIDENCE",
  explanation: "PATHIQ strictly abstains from inventing hyper-local salary figures. Government and institutional surveys aggregate wage data at District and State levels; no verified statistical sample exists for individual villages.",
  suggestedNextSteps: [
    "Review State-level minimum wage notification for Maharashtra (Skilled Category: ₹15,400 - ₹18,600/month)",
    "Inspect District-level apprentice stipend norms (Nagpur / Pune MIDC clusters)",
    "Speak with a local ITI placement officer or counsellor for hyper-local hiring patterns",
  ],
  counsellorPrompt: "A human counsellor can connect directly with local contractors or village electrical service contractors to give accurate real-world context.",
};

export function buildDynamicSummary(
  trade: string,
  concernId: string,
  parentUtterance?: string
): FamilySummaryData {
  const concernObj = CANONICAL_CONCERNS.find((c) => c.id === concernId) || CANONICAL_CONCERNS[0];
  const tradeLabel = trade === "diploma" ? "Polytechnic Diploma in Electrical" : "ITI Electrician Trade (NCVT 2-Year)";

  return {
    studentPreference: `${tradeLabel} at Government Institute`,
    studentQuote: "\"I want to learn practical technical skills and start early industrial work.\"",
    parentConcerns: [
      concernObj.label,
      "Ensuring career longevity and educational options",
    ],
    parentQuote: parentUtterance
      ? `"${parentUtterance}"`
      : "\"We want to be certain that this qualification provides long-term security and growth.\"",
    evidenceCardsReviewed: 2,
    sharedPriorities: [
      "Long-term career stability and verifiable legal wages",
      "Option to progress further through lateral entry pathways",
    ],
    stillToVerify: [
      "Local opportunities and current intake cutoffs in home district",
      "Government vs. Private ITI fees and hostel availability",
      "Specific industry tie-ups for campus apprenticeships",
    ],
    suggestedAction: "Speak with a certified district vocational counsellor to verify local seats and apprentice stipends.",
    counsellorReadinessScore: "95% Prepared (Structured Evidence Packet Assembled)",
  };
}

export function buildDynamicHandoff(
  trade: string,
  concernId: string,
  parentUtterance?: string,
  studentUtterance?: string,
  language: string = "hi"
): CounsellorHandoffData {
  const concernObj = CANONICAL_CONCERNS.find((c) => c.id === concernId) || CANONICAL_CONCERNS[0];
  const matchingEvidence = getEvidenceCardsForConcern(concernId)[0];
  const tradeLabel = trade === "diploma" ? "Polytechnic Diploma in Electrical" : "Electrician Trade (NCVT)";

  return {
    packetId: `PQ-MH-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    studentName: DEMO_STUDENT_PROFILE.name,
    familyLocation: "Maharashtra (Pune / Nagpur Division), India",
    chosenTrade: tradeLabel,
    studentInterests: [
      studentUtterance || "Practical electrical workshop training",
      "Hands-on equipment operations and industrial automation",
      "Early financial self-reliance through apprenticeship stipend",
    ],
    parentConcerns: [
      concernObj.label,
      parentUtterance ? `Parent query: "${parentUtterance}"` : "Long-term employment & degree mobility",
    ],
    evidenceAttached: [
      {
        title: matchingEvidence.source.title,
        source: matchingEvidence.source.authority,
        stat: matchingEvidence.claim,
      },
      {
        title: "MSBTE Lateral Entry Regulation",
        source: "Maharashtra State Board of Technical Education",
        stat: "Direct admission to 2nd Year Diploma (60%+ marks)",
      },
    ],
    openQuestionsForCounsellor: [
      "Which government ITIs in the district offer best industrial tie-ups for NAPS apprenticeships?",
      "What are the current cutoffs and centralized CAP timelines?",
      "How to balance 1 year of employment with lateral entry polytechnic admission?",
    ],
    recommendedDiscussionPoints: [
      `Walk the parents through specific data regarding ${concernObj.label.toLowerCase()}.`,
      "Review the local district list of participating companies offering apprenticeships.",
      "Explain the exact credit transfer and lateral entry seat quotas under MSBTE.",
    ],
    generatedAt: new Date().toISOString(),
    status: "ready_to_send",
  };
}
