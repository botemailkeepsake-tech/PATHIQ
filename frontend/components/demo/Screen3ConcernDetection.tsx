"use client";

import React, { useState, useEffect } from "react";
import { CANONICAL_CONCERNS, ConcernCategory } from "@/lib/demo-data";
import { detectConcernFromUtterance, DetectedConcernResult } from "@/lib/concern-detector";

interface Screen3ConcernDetectionProps {
  parentUtterance: string;
  initialConcernId?: string;
  onConfirmConcern: (confirmedConcernId: string) => void;
  onBack: () => void;
  currentLanguage: string;
}

export function Screen3ConcernDetection({
  parentUtterance,
  initialConcernId = "job_security",
  onConfirmConcern,
  onBack,
  currentLanguage,
}: Screen3ConcernDetectionProps) {
  const [detection, setDetection] = useState<DetectedConcernResult>(() =>
    detectConcernFromUtterance(parentUtterance || "ITI ke baad job milegi kya?", currentLanguage)
  );
  const [activeConcernId, setActiveConcernId] = useState<string>(
    initialConcernId || detection.concernId
  );
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(false);

  // Recalculate detection when parentUtterance changes
  useEffect(() => {
    if (parentUtterance) {
      const res = detectConcernFromUtterance(parentUtterance, currentLanguage);
      setDetection(res);
      setActiveConcernId(res.concernId);
    }
  }, [parentUtterance, currentLanguage]);

  const selectedCategory: ConcernCategory =
    CANONICAL_CONCERNS.find((c) => c.id === activeConcernId) || CANONICAL_CONCERNS[0];

  const handleSelectChangedConcern = (concernId: string) => {
    // Strictly forbid 'none'
    if (concernId === "none") return;
    setActiveConcernId(concernId);
    setIsChanging(false);
  };

  const handleConfirm = () => {
    setHasConfirmed(true);
    setTimeout(() => {
      onConfirmConcern(activeConcernId);
    }, 350);
  };

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Step Header */}
      <div style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-terracotta)" }}>
          Step 03 • Concern Detection
        </span>
        <h1 style={{ fontSize: "1.95rem", fontWeight: 800, marginTop: "0.25rem" }}>
          Concern Classification &amp; Confidence
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          PATHIQ maps colloquial voice or typed questions to structured, verifiable policy dimensions.
        </p>
      </div>

      {/* Main Detection Card: PATHIQ UNDERSTOOD THE CONCERN */}
      <div
        className="card"
        style={{
          border: "2px solid var(--accent-terracotta)",
          background: "linear-gradient(180deg, #FFFDFB 0%, #FAF6F0 100%)",
          padding: "2rem",
          marginBottom: "2rem",
          boxShadow: "var(--shadow-md)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: "var(--accent-terracotta)" }}></div>

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--accent-terracotta)",
                color: "#FFFFFF",
                fontSize: "1.2rem",
                fontWeight: 700,
              }}
            >
              ✓
            </span>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.08em", color: "var(--accent-terracotta)", textTransform: "uppercase" }}>
                Classification Engine Result
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)" }}>
                PATHIQ UNDERSTOOD THE CONCERN
              </h2>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <span
              className={`badge ${detection.confidence === "High" ? "badge-verified" : "badge-demo"}`}
              style={{ fontSize: "0.85rem", padding: "0.35rem 0.75rem" }}
            >
              Confidence: {detection.confidenceScore}% • {detection.confidence} confidence
            </span>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Speaker: <strong>Parent (Father)</strong>
            </div>
          </div>
        </div>

        {/* Input Message Container */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            padding: "1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
              Parent Query (Voice / Text Transcript):
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Input Received</span>
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)" }}>
            &ldquo;{parentUtterance || detection.triggerUtterance}&rdquo;
          </div>
        </div>

        {/* Classification Result Box */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            padding: "1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <div className="grid-2" style={{ alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                Detected Concern Dimension
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--accent-terracotta)", marginTop: "0.15rem" }}>
                {selectedCategory.label}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                {selectedCategory.hindiLabel}
              </div>
            </div>

            <div style={{ borderLeft: "2px solid var(--border-subtle)", paddingLeft: "1.25rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                Reasoning &amp; Scope
              </div>
              <p style={{ fontSize: "0.92rem", color: "var(--text-main)", marginTop: "0.25rem", lineHeight: 1.5 }}>
                {detection.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Question Prompt */}
        <div
          style={{
            background: "var(--bg-canvas-alt)",
            padding: "1rem 1.25rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-main)" }}>
            💬 {detection.confirmationPrompt}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleConfirm}
              className={`btn ${hasConfirmed ? "btn-success" : "btn-primary"} btn-sm`}
            >
              {hasConfirmed ? "✓ Confirmed" : "Yes, that's right"}
            </button>
            <button
              onClick={() => setIsChanging(!isChanging)}
              className="btn btn-secondary btn-sm"
            >
              Change concern
            </button>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleConfirm}
            className={`btn ${hasConfirmed ? "btn-success" : "btn-primary"} btn-lg`}
            style={{ minWidth: "220px" }}
          >
            {hasConfirmed ? "✓ Concern Confirmed!" : "Confirm & Retrieve Evidence →"}
          </button>

          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginLeft: "auto" }}>
            Queries verified knowledge graph for &quot;{selectedCategory.label}&quot;
          </span>
        </div>
      </div>

      {/* Canonical Category Selector (Modal/Drawer when Change Concern is clicked) */}
      {isChanging && (
        <div
          className="card"
          style={{
            background: "#FFFFFF",
            border: "2px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)" }}>
              Select from the 5 Canonical Concern Categories:
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Choose the exact dimension you want verified evidence for. <em>(Note: &quot;None&quot; is never persisted in PATHIQ.)</em>
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {CANONICAL_CONCERNS.map((cat) => {
              const isCurrent = activeConcernId === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectChangedConcern(cat.id)}
                  className={`card card-interactive ${isCurrent ? "card-selected" : ""}`}
                  style={{
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderWidth: isCurrent ? "2px" : "1px",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "1rem" }}>{cat.label}</span>
                      <span className="badge badge-neutral" style={{ fontSize: "0.72rem" }}>{cat.hindiLabel}</span>
                      {isCurrent && <span className="badge badge-terracotta">Selected</span>}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      {cat.description}
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm">
                    {isCurrent ? "Active" : "Select"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="bottom-nav-bar">
        <button onClick={onBack} className="btn btn-ghost">
          ← Back to Session
        </button>
        <button onClick={handleConfirm} className="btn btn-primary btn-lg">
          Retrieve Evidence →
        </button>
      </div>
    </div>
  );
}
