"use client";

import React, { useState } from "react";
import { CANONICAL_CONCERNS, DEMO_STUDENT_PROFILE, DEMO_PARENT_PROFILE } from "@/lib/demo-data";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";

interface Screen2FamilySessionProps {
  onProceedToDetection: (selectedPathway: string, selectedConcernId: string, parentUtterance: string, studentUtterance: string) => void;
  onBack: () => void;
  currentLanguage: string;
}

const PATHWAYS = [
  {
    id: "iti",
    title: "ITI (Industrial Training)",
    subtitle: "2-Year Technical Trade (Electrician)",
    icon: "⚡",
    badge: "Selected",
  },
  {
    id: "diploma",
    title: "Polytechnic Diploma",
    subtitle: "3-Year Engineering Diploma (Post-10th)",
    icon: "📐",
    badge: "Alternative",
  },
  {
    id: "skill_course",
    title: "Short-term Skill Course",
    subtitle: "3-6 Month PMKVY / Sector Skill Council",
    icon: "🛠️",
    badge: "Modular",
  },
  {
    id: "other",
    title: "Other Pathway",
    subtitle: "Traditional 11th-12th (Arts / Science / Commerce)",
    icon: "📚",
    badge: "General",
  },
];

const SAMPLE_PARENT_QUESTIONS = [
  "ITI ke baad job milegi kya?",
  "ITI ke baad degree kar sakte hai kya?",
  "Will I get a job after ITI?",
  "ITI electrician ki salary kitni hoti hai?",
  "Is electrician work dangerous or safe?",
];

export function Screen2FamilySession({
  onProceedToDetection,
  onBack,
  currentLanguage,
}: Screen2FamilySessionProps) {
  const [selectedPathway, setSelectedPathway] = useState("iti");
  const [selectedConcern, setSelectedConcern] = useState("job_security");
  const [studentUtterance, setStudentUtterance] = useState("I'm interested in becoming an electrician. I want to learn hands-on technical skills.");
  const [parentUtterance, setParentUtterance] = useState("ITI ke baad job milegi kya?");
  const [activeVoiceTarget, setActiveVoiceTarget] = useState<"parent" | "student" | null>(null);

  // Parent Voice Recognition
  const parentSpeech = useSpeechRecognition({
    language: currentLanguage,
    onTranscriptChange: (text) => {
      setParentUtterance(text);
    },
  });

  // Student Voice Recognition
  const studentSpeech = useSpeechRecognition({
    language: currentLanguage,
    onTranscriptChange: (text) => {
      setStudentUtterance(text);
    },
  });

  const handleToggleParentMic = () => {
    if (parentSpeech.isListening) {
      parentSpeech.stopListening();
      setActiveVoiceTarget(null);
    } else {
      if (studentSpeech.isListening) studentSpeech.stopListening();
      setActiveVoiceTarget("parent");
      parentSpeech.startListening();
    }
  };

  const handleToggleStudentMic = () => {
    if (studentSpeech.isListening) {
      studentSpeech.stopListening();
      setActiveVoiceTarget(null);
    } else {
      if (parentSpeech.isListening) parentSpeech.stopListening();
      setActiveVoiceTarget("student");
      studentSpeech.startListening();
    }
  };

  const handleSelectSample = (sample: string) => {
    setParentUtterance(sample);
  };

  const handleAdvance = () => {
    if (parentSpeech.isListening) parentSpeech.stopListening();
    if (studentSpeech.isListening) studentSpeech.stopListening();
    onProceedToDetection(selectedPathway, selectedConcern, parentUtterance.trim(), studentUtterance.trim());
  };

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Session Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-terracotta)" }}>
              Step 02 • Family Session
            </span>
            <h1 style={{ fontSize: "1.95rem", fontWeight: 800 }}>Family Career Session</h1>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span className="badge badge-neutral">Participants: Student + Parent</span>
            <span className="badge badge-verified">Voice &amp; Text Ready</span>
          </div>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Both sides state their thoughts. Student expresses vocational aspiration; Parent articulates their protective question.
        </p>
      </div>

      {/* Pathway Selection */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            1. What pathway are you considering?
          </h2>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Select trade or qualification track
          </span>
        </div>

        <div className="grid-4">
          {PATHWAYS.map((p) => {
            const isSelected = selectedPathway === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPathway(p.id)}
                className={`card card-interactive ${isSelected ? "card-selected" : ""}`}
                style={{
                  padding: "1.15rem",
                  borderWidth: isSelected ? "2px" : "1px",
                  borderRadius: "var(--radius-md)",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.6rem" }}>{p.icon}</span>
                  {isSelected && (
                    <span className="badge badge-terracotta" style={{ fontSize: "0.7rem" }}>
                      Active
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.25rem" }}>{p.title}</h3>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{p.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Roles Interactive Workspace */}
      <div className="grid-2" style={{ marginBottom: "2.5rem" }}>
        {/* STUDENT ROLE WORKSPACE */}
        <div
          className="card"
          style={{
            background: "#FFFFFF",
            border: "2px solid #DCE6F5",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>🎓</span>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1E40AF" }}>
                  STUDENT ROLE
                </h3>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  {DEMO_STUDENT_PROFILE.name} (Age 17, 10th Pass)
                </span>
              </div>
            </div>
            <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>Aspiration</span>
          </div>

          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.4rem" }}>
            Student Interest / Question:
          </label>
          <textarea
            value={studentUtterance}
            onChange={(e) => setStudentUtterance(e.target.value)}
            rows={3}
            placeholder="e.g. I want to become an electrician..."
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-strong)",
              fontSize: "0.92rem",
              marginBottom: "0.75rem",
              resize: "vertical",
            }}
          />

          {/* Student Mic Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginTop: "auto" }}>
            <button
              onClick={handleToggleStudentMic}
              className={`btn btn-sm ${studentSpeech.isListening ? "btn-primary" : "btn-secondary"}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                borderRadius: "var(--radius-sm)",
                background: studentSpeech.isListening ? "#DC2626" : undefined,
                color: studentSpeech.isListening ? "#FFFFFF" : undefined,
                borderColor: studentSpeech.isListening ? "#DC2626" : undefined,
              }}
              title="Click to speak student's interest using Web Speech API"
            >
              <span>{studentSpeech.isListening ? "⏹️" : "🎙️"}</span>
              <span>{studentSpeech.isListening ? "Listening..." : "Speak via Mic"}</span>
            </button>

            <span style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>
              Lang: {studentSpeech.localeCode}
            </span>
          </div>

          {studentSpeech.isListening && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.82rem", color: "#DC2626", fontWeight: 600 }}>
              🔴 Listening to student... Speak now.
            </div>
          )}

          {studentSpeech.errorMessage && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--accent-amber)" }}>
              ⚠️ {studentSpeech.errorMessage}
            </div>
          )}
        </div>

        {/* PARENT ROLE WORKSPACE */}
        <div
          className="card"
          style={{
            background: "#FFFFFF",
            border: "2px solid var(--accent-terracotta-border)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>👨‍👦</span>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--accent-terracotta)" }}>
                  PARENT ROLE
                </h3>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  {DEMO_PARENT_PROFILE.name} (Father)
                </span>
              </div>
            </div>
            <span className="badge badge-terracotta" style={{ fontSize: "0.7rem" }}>Active Focus</span>
          </div>

          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.4rem" }}>
            Parent Question / Concern:
          </label>
          <textarea
            value={parentUtterance}
            onChange={(e) => setParentUtterance(e.target.value)}
            rows={3}
            placeholder="e.g. ITI ke baad job milegi kya? / Will I get a job after ITI?"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--accent-terracotta-border)",
              fontSize: "0.95rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              resize: "vertical",
            }}
          />

          {/* Parent Mic Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              onClick={handleToggleParentMic}
              className={`btn btn-sm ${parentSpeech.isListening ? "btn-primary" : "btn-secondary"}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                borderRadius: "var(--radius-sm)",
                background: parentSpeech.isListening ? "#DC2626" : undefined,
                color: parentSpeech.isListening ? "#FFFFFF" : undefined,
                borderColor: parentSpeech.isListening ? "#DC2626" : undefined,
              }}
              title="Click to speak parent query using Web Speech API"
            >
              <span>{parentSpeech.isListening ? "⏹️" : "🎙️"}</span>
              <span>{parentSpeech.isListening ? "Listening..." : "Speak via Mic"}</span>
            </button>

            <span style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>
              Lang: {parentSpeech.localeCode}
            </span>
          </div>

          {parentSpeech.isListening && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.82rem", color: "#DC2626", fontWeight: 600 }}>
              🔴 Listening to parent... Say &ldquo;ITI ke baad job milegi kya?&rdquo;
            </div>
          )}

          {parentSpeech.errorMessage && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--accent-amber)" }}>
              ⚠️ {parentSpeech.errorMessage}
            </div>
          )}

          {/* Preset Sample Utterances for Hackathon Demo Quick Access */}
          <div style={{ marginTop: "1rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase" }}>
              Quick Presets (or Speak via Mic):
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.35rem" }}>
              {SAMPLE_PARENT_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(q)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: "0.76rem",
                    padding: "0.25rem 0.55rem",
                    background: parentUtterance === q ? "var(--accent-terracotta-subtle)" : undefined,
                    borderColor: parentUtterance === q ? "var(--accent-terracotta)" : undefined,
                  }}
                >
                  &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Concern Category Quick Activator */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}>
          Target Concern Dimension (Canonical Category):
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
          Select or confirm the primary area requiring evidence verification:
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          {CANONICAL_CONCERNS.map((c) => {
            const isSelected = selectedConcern === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedConcern(c.id)}
                className={`btn ${isSelected ? "btn-primary" : "btn-secondary"}`}
                style={{
                  padding: "0.55rem 1rem",
                  fontSize: "0.88rem",
                  borderWidth: isSelected ? "2px" : "1px",
                }}
              >
                {isSelected && <span>✓ </span>}
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav-bar">
        <button onClick={onBack} className="btn btn-ghost">
          ← Back
        </button>
        <button onClick={handleAdvance} className="btn btn-primary btn-lg">
          Analyze Concern →
        </button>
      </div>
    </div>
  );
}
