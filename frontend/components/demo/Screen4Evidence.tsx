"use client";

import React, { useState, useEffect } from "react";
import { EvidenceCardData, getEvidenceCardsForConcern } from "@/lib/demo-data";

interface Screen4EvidenceProps {
  confirmedConcernId: string;
  onProceedToProgression: () => void;
  onOpenAbstentionModal: () => void;
  onBack: () => void;
  sourceMode?: "api" | "demo_fallback";
}

export function Screen4Evidence({
  confirmedConcernId,
  onProceedToProgression,
  onOpenAbstentionModal,
  onBack,
  sourceMode = "demo_fallback",
}: Screen4EvidenceProps) {
  const cards = getEvidenceCardsForConcern(confirmedConcernId || "job_security");
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Reset to first card if concern changes
  useEffect(() => {
    setActiveCardIndex(0);
  }, [confirmedConcernId]);

  const card: EvidenceCardData = cards[activeCardIndex] || cards[0];

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Screen Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-terracotta)" }}>
              Step 04 • Evidence
            </span>
            <h1 style={{ fontSize: "1.95rem", fontWeight: 800, marginTop: "0.25rem" }}>
              Evidence for Your Decision
            </h1>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span className="badge badge-demo" style={{ fontWeight: 800 }}>
              SYNTHETIC DEMONSTRATION RECORD
            </span>
            {sourceMode === "api" && <span className="badge badge-verified">API Connected</span>}
          </div>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "0.5rem" }}>
          PATHIQ grounds answers in verified datasets instead of conversational opinions.
        </p>
      </div>

      {/* Card Selector Tabs */}
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {cards.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => setActiveCardIndex(idx)}
            className={`btn ${activeCardIndex === idx ? "btn-primary" : "btn-secondary"}`}
            style={{
              fontSize: "0.86rem",
              padding: "0.45rem 0.95rem",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {c.topic === confirmedConcernId ? "⭐ Primary: " : "Card: "}
            {c.topicLabel}
          </button>
        ))}

        <button
          onClick={onOpenAbstentionModal}
          className="btn btn-secondary"
          style={{
            marginLeft: "auto",
            fontSize: "0.85rem",
            borderColor: "var(--accent-amber-border)",
            background: "var(--accent-amber-bg)",
            color: "var(--accent-amber)",
          }}
          title="Demonstrate abstention on unverified hyper-local query"
        >
          🔍 Try Another Question (Abstention Demo)
        </button>
      </div>

      {/* THE EVIDENCE CARD */}
      <div
        className="card"
        style={{
          background: "#FFFFFF",
          border: "2px solid var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          boxShadow: "var(--shadow-md)",
          marginBottom: "2rem",
          position: "relative",
        }}
      >
        {/* Synthetic Demo Record Notice Banner */}
        <div
          style={{
            background: "var(--accent-amber-bg)",
            border: "1px solid var(--accent-amber-border)",
            borderRadius: "var(--radius-sm)",
            padding: "0.6rem 1rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 800, color: "var(--accent-amber)", fontSize: "0.85rem" }}>
              DEMO DATA
            </span>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Synthetic demonstration record modeled on Maharashtra institutional surveys. Not live official production records.
            </span>
          </div>
          <span className="badge badge-neutral" style={{ fontSize: "0.7rem" }}>
            ID: {card.recordId.substring(0, 8)}...
          </span>
        </div>

        {/* Card Header & Topic */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span className="badge badge-terracotta" style={{ marginBottom: "0.4rem" }}>
              Concern Dimension: {card.topic.toUpperCase().replace("_", " ")}
            </span>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Pathway: <strong>{card.trade} Trade</strong>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <span className="badge badge-verified" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
              ✓ Status: {card.status.toUpperCase()}
            </span>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
              Verified On: <strong>{card.verifiedDate}</strong>
            </div>
          </div>
        </div>

        {/* The Claim */}
        <div
          style={{
            borderLeft: "4px solid var(--accent-terracotta)",
            paddingLeft: "1.25rem",
            margin: "1.25rem 0 1.5rem",
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
            Verified Claim:
          </div>
          <p style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.25rem", lineHeight: 1.4 }}>
            &ldquo;{card.claim}&rdquo;
          </p>
          {card.hindiClaim && (
            <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", marginTop: "0.35rem", fontStyle: "italic" }}>
              &ldquo;{card.hindiClaim}&rdquo;
            </p>
          )}
        </div>

        {/* Quantitative Value Highlight Box */}
        {card.value && (
          <div
            style={{
              background: "var(--bg-canvas-alt)",
              borderRadius: "var(--radius-sm)",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            {card.value.numeric !== undefined && (
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 900,
                  color: "var(--accent-terracotta)",
                  lineHeight: 1,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                {card.value.unit === "₹" ? `₹${card.value.numeric.toLocaleString()}` : `${card.value.numeric}${card.value.unit || ""}`}
              </div>
            )}
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-subtle)" }}>
                Quantified Fact
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>
                {card.value.text}
              </div>
            </div>
          </div>
        )}

        {/* Structured Metadata Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            padding: "1.25rem",
            background: "#FFFFFF",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-subtle)" }}>
              Geography Level
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.15rem" }}>
              📍 {card.geography.label}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Code: {card.geography.code} ({card.geography.level})
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-subtle)" }}>
              Primary Source
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.15rem" }}>
              🏛️ {card.source.authority}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Type: {card.source.type.replace("_", " ")}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-subtle)" }}>
              Source Document
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)", marginTop: "0.15rem" }}>
              📄 {card.source.title}
            </div>
            {card.source.publishedDate && (
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Published: {card.source.publishedDate}
              </div>
            )}
          </div>
        </div>

        {/* Applicability Condition */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-subtle)" }}>
            Applicability &amp; Cohort:
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            {card.applicability}
          </p>
        </div>

        {/* Why this matters (Family-friendly translation) */}
        <div
          style={{
            background: "var(--accent-green-bg)",
            border: "1px solid var(--accent-green-border)",
            borderRadius: "var(--radius-sm)",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
            <span style={{ fontSize: "1rem" }}>💡</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-green)" }}>
              Why This Matters for the Family
            </span>
          </div>
          <p style={{ fontSize: "0.95rem", color: "var(--accent-green)", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            {card.whyThisMatters}
          </p>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav-bar">
        <button onClick={onBack} className="btn btn-ghost">
          ← Back to Concern
        </button>
        <button onClick={onProceedToProgression} className="btn btn-primary btn-lg">
          View Progression Pathway →
        </button>
      </div>
    </div>
  );
}
