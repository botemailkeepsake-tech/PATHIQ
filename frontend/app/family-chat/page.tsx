"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getApiBase } from "@/lib/api";
import { FamilyChatInterface } from "@/components/family-chat/FamilyChatInterface";

export default function FamilyChatPage() {
  const { t, i18n } = useTranslation();
  const [health, setHealth] = useState<{ status: string } | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, [i18n.language]);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setHealthError(null);
      const base = getApiBase();
      const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      } else {
        setHealthError("Backend unavailable - using demo mode");
      }
    } catch {
      setHealthError("Backend unavailable - using demo mode");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
        {t("common.loading")}
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-canvas)" }}>
      <header
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <a href="/" style={{ textDecoration: "none", color: "var(--text-main)" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 800 }}>{t("common.appName")}</span>
            </a>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0.2rem 0.5rem", background: "var(--bg-muted)", borderRadius: "var(--radius-sm)" }}>
              {t("familyChat.betaLabel")}
            </span>
          </div>
          <nav style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <a href="/" className="btn btn-secondary btn-sm">
              ← {t("navigation.home")}
            </a>
            <a href="/demo" className="btn btn-secondary btn-sm">
              {t("navigation.demo")}
            </a>
          </nav>
        </div>
        {healthError && (
          <div style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", background: "var(--accent-amber-bg)", border: "1px solid var(--accent-amber-border)", borderRadius: "var(--radius-sm)", color: "var(--accent-amber)", fontSize: "0.85rem", maxWidth: "980px", margin: "0.75rem auto 0" }}>
            ⚠ {healthError} <button onClick={checkHealth} className="btn btn-secondary btn-sm" style={{ marginLeft: "0.5rem", fontSize: "0.75rem" }}>{t("common.retry")}</button>
          </div>
        )}
      </header>

      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "1.5rem" }}>
        <FamilyChatInterface
          apiHealth={health}
          apiError={healthError}
        />
      </div>
    </main>
  );
}