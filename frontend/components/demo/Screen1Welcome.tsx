"use client";

import React from "react";
import { DEMO_STUDENT_PROFILE, DEMO_PARENT_PROFILE } from "@/lib/demo-data";

interface Screen1WelcomeProps {
  onStartSession: () => void;
  onExploreDemo: () => void;
}

export function Screen1Welcome({ onStartSession, onExploreDemo }: Screen1WelcomeProps) {
  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Editorial Hero Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem", paddingTop: "1rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <span className="badge badge-terracotta" style={{ padding: "0.35rem 0.85rem", fontSize: "0.82rem" }}>
            Civic-Tech • Vocational Education • India
          </span>
        </div>

        <h1
          style={{
            fontSize: "2.75rem",
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
            color: "var(--text-main)",
            fontWeight: 800,
          }}
        >
          When a career choice becomes a <span style={{ color: "var(--accent-terracotta)" }}>family decision</span>.
        </h1>

        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--text-muted)",
            maxWidth: "680px",
            margin: "0 auto 2rem",
            lineHeight: 1.6,
          }}
        >
          Understand the concern. See the evidence. Decide together.
        </p>

        {/* Action CTAs */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
          <button onClick={onStartSession} className="btn btn-primary btn-lg">
            Start Family Session →
          </button>
          <button onClick={onExploreDemo} className="btn btn-secondary btn-lg">
            Explore Demo Flow
          </button>
        </div>
      </div>

      {/* Visual Relationship: Student + Parent Perspectives */}
      <div
        className="card"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
          borderColor: "var(--border-strong)",
          padding: "2rem",
          marginBottom: "2.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-subtle)" }}>
            The Family Decision Dynamic
          </span>
          <h2 style={{ fontSize: "1.35rem", marginTop: "0.25rem" }}>
            Two Perspectives. One Mutual Future.
          </h2>
        </div>

        <div className="grid-2">
          {/* Student Perspective Card */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #DCE6F5",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "#EFF6FF",
                  color: "#1E40AF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                }}
              >
                🎓
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Student: {DEMO_STUDENT_PROFILE.name}</h3>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{DEMO_STUDENT_PROFILE.education}</span>
              </div>
            </div>

            <div className="bubble-student" style={{ fontSize: "0.95rem", fontStyle: "italic", color: "var(--text-main)" }}>
              &ldquo;{DEMO_STUDENT_PROFILE.quote}&rdquo;
            </div>

            <div style={{ marginTop: "1rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Aspirations:
              </span>
              <ul style={{ paddingLeft: "1.2rem", marginTop: "0.4rem", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                {DEMO_STUDENT_PROFILE.aspirations.map((a, i) => (
                  <li key={i} style={{ marginBottom: "0.3rem" }}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Parent Perspective Card */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--accent-terracotta-border)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "var(--accent-terracotta-subtle)",
                  color: "var(--accent-terracotta)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                }}
              >
                👨‍👧
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Parent: {DEMO_PARENT_PROFILE.name}</h3>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{DEMO_PARENT_PROFILE.role}</span>
              </div>
            </div>

            <div className="bubble-parent" style={{ fontSize: "0.95rem", fontStyle: "italic", color: "var(--text-main)" }}>
              &ldquo;{DEMO_PARENT_PROFILE.primaryQuery}&rdquo;
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem", fontStyle: "normal" }}>
                (Will he get a stable job after ITI? What about future degrees?)
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Core Protective Concerns:
              </span>
              <ul style={{ paddingLeft: "1.2rem", marginTop: "0.4rem", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                {DEMO_PARENT_PROFILE.concerns.map((c, i) => (
                  <li key={i} style={{ marginBottom: "0.3rem" }}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Core Principle Callout */}
      <div
        style={{
          borderLeft: "4px solid var(--accent-terracotta)",
          background: "#FFFFFF",
          padding: "1.25rem 1.5rem",
          borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
          borderTop: "1px solid var(--border-subtle)",
          borderRight: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--accent-terracotta)", marginBottom: "0.2rem" }}>
            CRITICAL DEMO PRINCIPLE
          </h4>
          <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", margin: 0 }}>
            The AI does <strong>not</strong> decide the career. PATHIQ provides verified evidence so the family can decide together.
          </p>
        </div>
        <button onClick={onStartSession} className="btn btn-primary btn-sm" style={{ whiteSpace: "nowrap" }}>
          Launch Demo →
        </button>
      </div>
    </div>
  );
}
