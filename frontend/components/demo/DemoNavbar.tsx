"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface DemoNavbarProps {
  currentStage: number; // 1 to 8
  onSelectStage: (stage: number) => void;
  onOpenAbstentionModal: () => void;
  onRestartDemo: () => void;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  sourceMode?: "api" | "demo_fallback";
}

export const DEMO_STAGES = [
  { id: 1, label: "01 Understand", short: "Intro", description: "Family Context" },
  { id: 2, label: "02 Family Session", short: "Session", description: "Roles & Input" },
  { id: 3, label: "03 Concern Detection", short: "Detection", description: "Intent & Confidence" },
  { id: 4, label: "04 Evidence", short: "Evidence", description: "Grounded Records" },
  { id: 5, label: "05 Progression", short: "Progression", description: "Pathway Ladder" },
  { id: 6, label: "06 Compare", short: "Compare", description: "Mutual Priorities" },
  { id: 7, label: "07 Family Summary", short: "Summary", description: "Decision Dossier" },
  { id: 8, label: "08 Counsellor Handoff", short: "Handoff", description: "Packet Prepared" },
];

export function DemoNavbar({
  currentStage,
  onSelectStage,
  onOpenAbstentionModal,
  onRestartDemo,
  currentLanguage,
  onLanguageChange,
  sourceMode = "demo_fallback",
}: DemoNavbarProps) {
  const { i18n } = useTranslation();

  const handleLangSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    onLanguageChange(newLang);
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(newLang);
    }
  };

  return (
    <header style={{ marginBottom: "1.5rem" }}>
      {/* Top Header Bar */}
      <div className="demo-header-bar" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => onSelectStage(1)}
            className="brand-badge"
            style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
          >
            <span className="brand-mark"></span>
            <span>PATHIQ</span>
          </button>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "inline-block" }}>
            Family-Centric Vocational Career Decision Platform
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          {/* Persistent Demo Mode Badge */}
          <span
            className="badge badge-demo"
            title="Evidence is grounded in verified synthetic test datasets"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent-amber)",
                display: "inline-block",
              }}
            ></span>
            DEMO MODE • Prototype • Synthetic Evidence
          </span>

          {/* Language Selector */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem" }}>🌐</span>
            <select
              value={currentLanguage}
              onChange={handleLangSelect}
              style={{
                padding: "0.3rem 0.6rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-strong)",
                background: "var(--bg-card)",
                fontSize: "0.85rem",
                color: "var(--text-main)",
                fontWeight: 600,
                cursor: "pointer",
              }}
              aria-label="Select language"
            >
              <option value="en">English (en-IN)</option>
              <option value="hi">हिन्दी (hi-IN)</option>
              <option value="mr">मराठी (mr-IN)</option>
            </select>
          </div>

          {/* Abstention Safety Button */}
          <button
            onClick={onOpenAbstentionModal}
            className="btn btn-secondary btn-sm"
            title="Demonstrate AI safety: Abstaining when local data is unavailable"
            style={{ borderColor: "var(--border-strong)", fontSize: "0.82rem" }}
          >
            <span style={{ color: "var(--accent-terracotta)", fontWeight: 700 }}>⚠️</span>
            Test Abstention
          </button>

          {/* Restart Demo Button */}
          <button
            onClick={onRestartDemo}
            className="btn btn-secondary btn-sm"
            title="Reset demo inputs and start fresh"
            style={{ fontSize: "0.82rem" }}
          >
            🔄 Restart Demo
          </button>
        </div>
      </div>

      {/* Stepper (01 Understand -> 08 Counsellor Handoff) */}
      <nav className="stepper-nav" aria-label="Demo Steps" style={{ overflowX: "auto" }}>
        {DEMO_STAGES.map((s) => {
          const isActive = currentStage === s.id;
          const isCompleted = currentStage > s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectStage(s.id)}
              className={`step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.15rem",
                textAlign: "left",
                minWidth: "115px",
                flexShrink: 0,
              }}
            >
              <span className="step-num" style={{ fontWeight: 700, fontSize: "0.78rem" }}>
                {isCompleted ? "✓ " : ""}
                {s.label}
              </span>
              <span
                style={{
                  fontSize: "0.72rem",
                  color: isActive ? "var(--accent-terracotta)" : "var(--text-subtle)",
                }}
              >
                {s.description}
              </span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
