"use client";

import React from "react";
import { DEMO_PROGRESSION_STEPS, ProgressionStep } from "@/lib/demo-data";

interface Screen5ProgressionProps {
  onProceedToCompare: () => void;
  onBack: () => void;
}

export function Screen5Progression({ onProceedToCompare, onBack }: Screen5ProgressionProps) {
  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Screen Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-terracotta)" }}>
              Step 05 • Progression
            </span>
            <h1 style={{ fontSize: "1.95rem", fontWeight: 800, marginTop: "0.25rem" }}>
              Progression Pathway Visualizer
            </h1>
          </div>

          <span className="badge badge-demo">
            Prototype pathway demonstration
          </span>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "0.5rem" }}>
          Addressing the parent&apos;s second concern: Does taking ITI prevent future degrees?
        </p>
      </div>

      {/* CORE HIGHLIGHT CALLOUT */}
      <div
        className="card"
        style={{
          borderLeft: "5px solid var(--accent-terracotta)",
          background: "linear-gradient(90deg, var(--accent-terracotta-subtle) 0%, #FFFFFF 100%)",
          padding: "1.5rem 1.75rem",
          marginBottom: "2.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🎓</span>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent-terracotta)" }}>
            An ITI pathway does not have to be the end of education.
          </h2>
        </div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-main)", margin: 0, lineHeight: 1.6 }}>
          Under Maharashtra Board of Technical Education (MSBTE) and AICTE lateral entry guidelines, an ITI Electrician graduate (with 60%+ marks) can enter directly into the <strong>2nd year of Polytechnic Diploma</strong>, and subsequently into <strong>2nd year B.Tech / B.Voc</strong> engineering degrees.
        </p>
      </div>

      {/* THE VISUAL PROGRESSION TIMELINE */}
      <div
        className="card"
        style={{
          background: "#FFFFFF",
          padding: "2.5rem 2rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
          marginBottom: "2rem",
        }}
      >
        <div style={{ marginBottom: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
            Step-by-Step Educational &amp; Livelihood Ladder
          </h3>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            State: Maharashtra (MSBTE Alignment)
          </span>
        </div>

        <div style={{ paddingLeft: "0.5rem" }}>
          {DEMO_PROGRESSION_STEPS.map((s: ProgressionStep) => (
            <div key={s.step} className={`pathway-step ${s.isMilestone ? "milestone" : ""}`}>
              <div className="pathway-icon-circle">
                {s.step}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-subtle)", letterSpacing: "0.06em" }}>
                      Stage {s.step}: {s.stage}
                    </span>
                    <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)", marginTop: "0.15rem" }}>
                      {s.title}
                    </h4>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span className="badge badge-neutral" style={{ fontSize: "0.75rem" }}>
                      Duration: {s.duration}
                    </span>
                    {s.isMilestone && (
                      <span className="badge badge-terracotta" style={{ fontSize: "0.72rem" }}>
                        Key Milestone
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: "0.4rem 0 0.5rem", lineHeight: 1.5 }}>
                  {s.description}
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "var(--bg-canvas-alt)",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.82rem",
                    color: "var(--text-main)",
                    marginTop: "0.25rem",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "var(--accent-terracotta)" }}>Credential:</span>
                  <span>{s.credential}</span>
                </div>

                {s.keyRule && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.82rem",
                      color: "var(--accent-green)",
                      background: "var(--accent-green-bg)",
                      border: "1px solid var(--accent-green-border)",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: 600,
                    }}
                  >
                    ✓ Policy Mechanism: {s.keyRule}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav-bar">
        <button onClick={onBack} className="btn btn-ghost">
          ← Back to Evidence
        </button>
        <button onClick={onProceedToCompare} className="btn btn-primary btn-lg">
          Compare Family Priorities →
        </button>
      </div>
    </div>
  );
}
