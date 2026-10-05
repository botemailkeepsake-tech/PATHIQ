"use client";

import React from "react";
import { DEMO_FAMILY_PRIORITIES, DEMO_STUDENT_PROFILE, DEMO_PARENT_PROFILE } from "@/lib/demo-data";

interface Screen6ComparePrioritiesProps {
  onProceedToSummary: () => void;
  onBack: () => void;
}

export function Screen6ComparePriorities({ onProceedToSummary, onBack }: Screen6ComparePrioritiesProps) {
  const { studentPriorities, parentPriorities, sharedPriorities, divergentPriorities } =
    DEMO_FAMILY_PRIORITIES;

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Screen Header */}
      <div style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-terracotta)" }}>
          Step 06 • Compare
        </span>
        <h1 style={{ fontSize: "1.95rem", fontWeight: 800, marginTop: "0.25rem" }}>
          Family Priorities Comparison
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Balancing individual aspirations with household stability. PATHIQ helps the family decide together.
        </p>
      </div>

      {/* CORE PHILOSOPHY BANNER: DO NOT DECLARE A WINNER */}
      <div
        className="card"
        style={{
          border: "2px solid var(--accent-terracotta-border)",
          background: "var(--accent-terracotta-subtle)",
          padding: "1.25rem 1.5rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ fontSize: "1.6rem" }}>⚖️</div>
        <div>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--accent-terracotta)", marginBottom: "0.2rem" }}>
            PATHIQ found areas to discuss.
          </h2>
          <p style={{ fontSize: "0.92rem", color: "var(--text-main)", margin: 0, lineHeight: 1.5 }}>
            PATHIQ never decrees: <em>&ldquo;Student is right&rdquo;</em> or <em>&ldquo;Parent is right&rdquo;</em>. We map where priorities match and surface constructive questions for the family dinner table.
          </p>
        </div>
      </div>

      {/* TWO COLUMNS: STUDENT WANTS vs. PARENT WANTS */}
      <div className="grid-2" style={{ marginBottom: "2rem" }}>
        {/* Student Column */}
        <div
          className="card"
          style={{
            background: "#FFFFFF",
            border: "1px solid #DCE6F5",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.25rem" }}>🎓</span>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Student Wants</h3>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{DEMO_STUDENT_PROFILE.name}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {studentPriorities.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: "0.85rem",
                  background: "#F8FAFC",
                  borderRadius: "var(--radius-sm)",
                  borderLeft: "3px solid #3B82F6",
                }}
              >
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-main)" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parent Column */}
        <div
          className="card"
          style={{
            background: "#FFFFFF",
            border: "1px solid var(--accent-terracotta-border)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.25rem" }}>👨‍👦</span>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Parent Wants</h3>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{DEMO_PARENT_PROFILE.name}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {parentPriorities.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: "0.85rem",
                  background: "#FFF9F6",
                  borderRadius: "var(--radius-sm)",
                  borderLeft: "3px solid var(--accent-terracotta)",
                }}
              >
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-main)" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SHARED PRIORITIES SECTION */}
      <div
        className="card"
        style={{
          background: "var(--accent-green-bg)",
          border: "1px solid var(--accent-green-border)",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <span style={{ fontSize: "1.2rem", color: "var(--accent-green)" }}>✓</span>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-green)" }}>
            Shared Family Priorities (Common Ground)
          </h3>
        </div>

        <div className="grid-2">
          {sharedPriorities.map((p, idx) => (
            <div
              key={idx}
              style={{
                background: "#FFFFFF",
                padding: "1rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--accent-green-border)",
              }}
            >
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--accent-green)" }}>
                ✓ {p.title}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                {p.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DIVERGENT PRIORITIES & DISCUSSION PROMPTS */}
      <div
        className="card"
        style={{
          background: "#FFFFFF",
          border: "1px solid var(--border-subtle)",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "1rem" }}>
          Different Priorities • Areas to Discuss
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {divergentPriorities.map((d, idx) => (
            <div
              key={idx}
              style={{
                padding: "1rem",
                background: "var(--bg-canvas-alt)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>
                {d.dimension}
              </div>

              <div className="grid-2" style={{ marginBottom: "0.75rem", fontSize: "0.85rem" }}>
                <div>
                  <strong style={{ color: "#1E40AF" }}>Student View: </strong>
                  <span style={{ color: "var(--text-muted)" }}>{d.studentView}</span>
                </div>
                <div>
                  <strong style={{ color: "var(--accent-terracotta)" }}>Parent View: </strong>
                  <span style={{ color: "var(--text-muted)" }}>{d.parentView}</span>
                </div>
              </div>

              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px dashed var(--border-strong)",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.85rem",
                  color: "var(--text-main)",
                }}
              >
                💬 <strong>Family Discussion Prompt: </strong>
                {d.dialoguePrompt}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav-bar">
        <button onClick={onBack} className="btn btn-ghost">
          ← Back to Pathway
        </button>
        <button onClick={onProceedToSummary} className="btn btn-primary btn-lg">
          Generate Family Summary →
        </button>
      </div>
    </div>
  );
}
