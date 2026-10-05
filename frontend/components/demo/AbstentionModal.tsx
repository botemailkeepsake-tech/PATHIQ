"use client";

import React, { useState } from "react";
import { DEMO_ABSTENTION_CASE } from "@/lib/demo-data";

interface AbstentionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AbstentionModal({ isOpen, onClose }: AbstentionModalProps) {
  const [query, setQuery] = useState(DEMO_ABSTENTION_CASE.question);
  const [hasEvaluated, setHasEvaluated] = useState(true);

  if (!isOpen) return null;

  const handleTestPreset = () => {
    setQuery(DEMO_ABSTENTION_CASE.question);
    setHasEvaluated(true);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(29, 35, 33, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      <div
        className="card"
        style={{
          background: "#FFFFFF",
          maxWidth: "680px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
        }}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            fontSize: "1.4rem",
            color: "var(--text-muted)",
            lineHeight: 1,
            padding: "0.25rem 0.5rem",
          }}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span className="badge badge-demo">Safety &amp; Grounding Architecture</span>
          </div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800 }}>
            Demonstrating AI Abstention
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            A core PATHIQ differentiator: refusing to fabricate hyper-local numbers when verified data does not exist.
          </p>
        </div>

        {/* Question Input / Presets */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-subtle)", display: "block", marginBottom: "0.35rem" }}>
            Test a Hyper-Local / Unverified Query:
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. ITI electrician salary in my exact village?"
              style={{
                flex: 1,
                padding: "0.65rem 0.85rem",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.95rem",
              }}
            />
            <button onClick={() => setHasEvaluated(true)} className="btn btn-primary btn-sm">
              Evaluate
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              onClick={handleTestPreset}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.78rem" }}
            >
              Preset: &ldquo;ITI electrician salary in my exact village?&rdquo;
            </button>
          </div>
        </div>

        {/* Abstention Evaluation Box */}
        {hasEvaluated && (
          <div
            style={{
              background: "#FFFBEB",
              border: "2px solid #F59E0B",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Abstention Banner */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>⚠️</span>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#B45309" }}>
                  Status: Abstention Triggered
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#92400E" }}>
                  NOT ENOUGH VERIFIED EVIDENCE
                </h3>
              </div>
            </div>

            <p style={{ fontSize: "0.95rem", color: "#78350F", marginBottom: "1rem", lineHeight: 1.5 }}>
              <strong>PATHIQ couldn&apos;t find reliable evidence for this specific question.</strong> {DEMO_ABSTENTION_CASE.explanation}
            </p>

            {/* What you can do section */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #FDE68A",
                borderRadius: "var(--radius-sm)",
                padding: "1rem 1.25rem",
              }}
            >
              <div style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", color: "#92400E", marginBottom: "0.5rem" }}>
                What you can do:
              </div>

              <ul style={{ paddingLeft: "1.25rem", fontSize: "0.88rem", color: "#78350F" }}>
                {DEMO_ABSTENTION_CASE.suggestedNextSteps.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: "0.35rem" }}>
                    → {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Differentiator Note */}
        <div style={{ background: "var(--bg-canvas-alt)", padding: "1rem", borderRadius: "var(--radius-sm)", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          <strong>Why this matters to judges:</strong> Standard LLMs hallucinate plausible-sounding village wage numbers (e.g. &quot;₹12,000 in your village&quot;) without statistical grounding. PATHIQ enforces strict abstention whenever records fail geography-level validation.
        </div>

        {/* Close Button */}
        <div style={{ textAlign: "right" }}>
          <button onClick={onClose} className="btn btn-secondary">
            Close Safety Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
