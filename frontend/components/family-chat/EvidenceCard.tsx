"use client";

import React from "react";

interface EvidenceCardProps {
  card: {
    record_id: string;
    claim: string;
    value: { text: string; unit?: string };
    source: {
      title: string;
      authority: string;
      type: string;
      published_date?: string;
    };
    geography: {
      level: string;
      code: string;
      label: string;
    };
    applicability: string;
    verified_date: string;
    status: string;
    is_demo: boolean;
  };
  t: (key: string) => string;
}

export function EvidenceCard({ card, t }: EvidenceCardProps) {
  const isDemo = card.is_demo;
  const isVerified = card.status === "verified";

  const getSourceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      official_notification: t("familyChat.sourceTypes.official_notification"),
      government_report: t("familyChat.sourceTypes.government_report"),
      survey: t("familyChat.sourceTypes.survey"),
      institutional: t("familyChat.sourceTypes.institutional"),
      other: t("familyChat.sourceTypes.other"),
    };
    return labels[type] || type;
  };

  const getGeographyLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      district: t("familyChat.geography.district"),
      state: t("familyChat.geography.state"),
      national: t("familyChat.geography.national"),
    };
    return labels[level] || level;
  };

  return (
    <div
      style={{
        padding: "0.75rem",
        background: "var(--bg-muted)",
        border: `1px solid ${isDemo ? "var(--accent-amber-border)" : "var(--border-subtle)"}`,
        borderRadius: "var(--radius-md)",
        borderLeft: `3px solid ${isDemo ? "var(--accent-amber)" : (isVerified ? "var(--accent-green)" : "var(--accent-blue)")}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", gap: "0.5rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.25rem", color: "var(--text-main)" }}>
            {card.claim}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {card.value.text} {card.value.unit || ""}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.15rem", flexShrink: 0 }}>
          {isDemo && (
            <span style={{ padding: "0.1rem 0.4rem", fontSize: "0.6rem", background: "var(--accent-amber-bg)", color: "var(--accent-amber)", borderRadius: "var(--radius-full)", border: "1px solid var(--accent-amber-border)" }}>
              {t("familyChat.demoLabel")}
            </span>
          )}
          {isVerified && (
            <span style={{ padding: "0.1rem 0.4rem", fontSize: "0.6rem", background: "var(--accent-green-bg)", color: "var(--accent-green)", borderRadius: "var(--radius-full)", border: "1px solid var(--accent-green-border)" }}>
              ✓ {t("familyChat.verified")}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <strong>{t("familyChat.source")}:</strong> {card.source.title}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <strong>{t("familyChat.authority")}:</strong> {card.source.authority}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <strong>{t("familyChat.type")}:</strong> {getSourceTypeLabel(card.source.type)}
        </span>
        {card.source.published_date && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <strong>{t("familyChat.published")}:</strong> {new Date(card.source.published_date).toLocaleDateString()}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.15rem 0.4rem", background: "var(--bg-card)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
          <strong>{t("familyChat.geography")}:</strong> {getGeographyLevelLabel(card.geography.level)} ({card.geography.code})
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <strong>{t("familyChat.verifiedDate")}:</strong> {new Date(card.verified_date).toLocaleDateString()}
        </span>
      </div>

      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.5 }}>
        <strong>{t("familyChat.applicability")}:</strong> {card.applicability}
      </div>
    </div>
  );
}