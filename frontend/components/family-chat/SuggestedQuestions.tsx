"use client";

import React from "react";

interface SuggestedQuestionsProps {
  questions: { id: string; text: string; topic: string }[];
  onSelect: (question: { text: string; topic: string }) => void;
  t: (key: string) => string;
}

export function SuggestedQuestions({ questions, onSelect, t }: SuggestedQuestionsProps) {
  return (
    <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-card)" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        {t("familyChat.suggestedQuestions")}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {questions.map((q) => (
          <button
            key={q.id}
            onClick={() => onSelect(q)}
            className="btn btn-secondary btn-sm"
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.75rem",
              textAlign: "left",
              whiteSpace: "normal",
              maxWidth: "100%",
              flex: "1 1 calc(50% - 0.25rem)",
              minWidth: "140px",
            }}
          >
            {q.text}
          </button>
        ))}
      </div>
    </div>
  );
}