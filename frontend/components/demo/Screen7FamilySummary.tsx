"use client";

import React from "react";
import { buildDynamicSummary } from "@/lib/demo-data";

interface Screen7FamilySummaryProps {
  selectedPathway: string;
  confirmedConcernId: string;
  parentUtterance?: string;
  onTalkToCounsellor: () => void;
  onContinueDiscussion: () => void;
  onBack: () => void;
}

export function Screen7FamilySummary({
  selectedPathway,
  confirmedConcernId,
  parentUtterance,
  onTalkToCounsellor,
  onContinueDiscussion,
  onBack,
}: Screen7FamilySummaryProps) {
  const summary = buildDynamicSummary(
    selectedPathway || "iti",
    confirmedConcernId || "job_security",
    parentUtterance
  );

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Screen Header */}
      <div style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-terracotta)" }}>
          Step 07 • Family Summary
        </span>
        <h1 style={{ fontSize: "1.95rem", fontWeight: 800, marginTop: "0.25rem" }}>
          Family Decision Summary
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Consolidated brief capturing common ground, verified facts, and unresolved questions.
        </p>
      </div>

      {/* THE FAMILY SUMMARY CARD */}
      <div
        className="card"
        style={{
          background: "#FFFFFF",
          border: "2px solid var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          boxShadow: "var(--shadow-md)",
          marginBottom: "2rem",
        }}
      >
        {/* Card Header Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "1.25rem", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.08em", color: "var(--accent-terracotta)", textTransform: "uppercase" }}>
              PATHIQ Briefing Dossier
            </div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-main)" }}>
              FAMILY DECISION SUMMARY
            </h2>
          </div>

          <div style={{ textAlign: "right" }}>
            <span className="badge badge-verified">
              {summary.counsellorReadinessScore}
            </span>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Date: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>

        {/* Section 1: Preference & Concerns Row */}
        <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              padding: "1.25rem",
              background: "#F8FAFC",
              border: "1px solid #DCE6F5",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#1E40AF" }}>
              Student Preference
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.25rem" }}>
              {summary.studentPreference}
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem", fontStyle: "italic", margin: 0 }}>
              {summary.studentQuote}
            </p>
          </div>

          <div
            style={{
              padding: "1.25rem",
              background: "#FFF9F6",
              border: "1px solid var(--accent-terracotta-border)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-terracotta)" }}>
              Parent Concerns Addressed
            </div>
            <ul style={{ paddingLeft: "1.2rem", marginTop: "0.35rem", fontSize: "0.9rem", color: "var(--text-main)" }}>
              {summary.parentConcerns.map((c, i) => (
                <li key={i} style={{ marginBottom: "0.25rem", fontWeight: 600 }}>{c}</li>
              ))}
            </ul>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem", fontStyle: "italic", margin: 0 }}>
              {summary.parentQuote}
            </p>
          </div>
        </div>

        {/* Section 2: Evidence Reviewed & Shared Priorities */}
        <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              padding: "1.25rem",
              background: "var(--bg-canvas-alt)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-subtle)" }}>
              Evidence Cards Reviewed
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", marginTop: "0.2rem" }}>
              {summary.evidenceCardsReviewed} Verified Cards
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
              ✓ Grounded in cited Maharashtra institutional records<br />
              ✓ MSBTE Lateral Entry progression policies included
            </div>
          </div>

          <div
            style={{
              padding: "1.25rem",
              background: "var(--accent-green-bg)",
              border: "1px solid var(--accent-green-border)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-green)" }}>
              Shared Family Priorities
            </div>
            <ul style={{ paddingLeft: "1.2rem", marginTop: "0.35rem", fontSize: "0.88rem", color: "var(--accent-green)" }}>
              {summary.sharedPriorities.map((sp, i) => (
                <li key={i} style={{ marginBottom: "0.25rem", fontWeight: 600 }}>{sp}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3: Still To Verify */}
        <div
          style={{
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: "var(--radius-sm)",
            padding: "1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1.1rem" }}>📌</span>
            <span style={{ fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", color: "var(--accent-amber)" }}>
              Still to Verify (Remaining Questions for Counsellor):
            </span>
          </div>

          <ul style={{ paddingLeft: "1.4rem", fontSize: "0.88rem", color: "#78350F" }}>
            {summary.stillToVerify.map((item, idx) => (
              <li key={idx} style={{ marginBottom: "0.35rem" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4: Recommended Next Step */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-subtle)" }}>
              Recommended Next Step
            </div>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.15rem" }}>
              {summary.suggestedAction}
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={onContinueDiscussion} className="btn btn-secondary">
              Review Priorities
            </button>
            <button onClick={onTalkToCounsellor} className="btn btn-primary btn-lg">
              Prepare for Counsellor →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav-bar">
        <button onClick={onBack} className="btn btn-ghost">
          ← Back to Comparison
        </button>
        <button onClick={onTalkToCounsellor} className="btn btn-primary btn-lg">
          Prepare for Counsellor →
        </button>
      </div>
    </div>
  );
}
