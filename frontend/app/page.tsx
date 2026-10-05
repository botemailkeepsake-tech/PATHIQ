"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getApiBase } from "@/lib/api";

interface HealthResponse {
  status: string;
  database: string;
  redis: string;
  environment: string;
}

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main style={{ padding: "2.5rem 1.5rem", maxWidth: "980px", margin: "0 auto" }}>
      {/* Hero Banner with Demo Callout */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #FAF6F0 100%)",
          border: "2px solid var(--accent-terracotta-border)",
          padding: "2.5rem 2rem",
          borderRadius: "var(--radius-lg)",
          marginBottom: "2.5rem",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <span className="badge badge-terracotta" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
            HACKATHON DEMO READY
          </span>
          <span className="badge badge-demo" style={{ fontSize: "0.8rem" }}>
            Evidence-Grounded AI
          </span>
        </div>

        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.75rem", lineHeight: 1.2 }}>
          {t("common.appName")}
        </h1>

        <p style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--accent-terracotta)", marginBottom: "0.75rem" }}>
          &ldquo;When a student&apos;s career choice becomes a family decision, PATHIQ gives both sides the evidence to decide together.&rdquo;
        </p>

        <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", maxWidth: "760px", marginBottom: "1.75rem", lineHeight: 1.6 }}>
          Explore the vertical slice prototype featuring bilingual intent detection, speech-to-text recognition, verified evidence cards, educational progression pathways, mutual priority comparison, family summaries, and counsellor handoff.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <a
            href="/demo"
            className="btn btn-primary btn-lg"
            style={{ textDecoration: "none" }}
          >
            Launch Interactive Demo (/demo) →
          </a>
          <a
            href="/demo"
            className="btn btn-secondary btn-lg"
            style={{ textDecoration: "none" }}
          >
            Explore 8-Step Journey
          </a>
        </div>
      </div>

      {/* System Health Overview */}
      <section style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{t("health.title")}</h2>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Backend Connection Status</span>
        </div>
        <HealthStatus />
      </section>

      {/* Direct Navigation Links */}
      <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.75rem", textTransform: "uppercase" }}>
          Direct Navigation Links
        </h3>
        <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a href="/demo" className="btn btn-primary btn-sm">
            Interactive Demo
          </a>
          <a href="/session" className="btn btn-secondary btn-sm">
            {t("navigation.session")}
          </a>
          <a href="/evidence" className="btn btn-secondary btn-sm">
            {t("navigation.evidence")}
          </a>
          <a href="/agreement" className="btn btn-secondary btn-sm">
            {t("navigation.agreement")}
          </a>
          <a href="/summary" className="btn btn-secondary btn-sm">
            {t("navigation.summary")}
          </a>
        </nav>
      </div>
    </main>
  );
}

function HealthStatus() {
  const { t } = useTranslation();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth();
  }, []);

  async function fetchHealth() {
    try {
      setLoading(true);
      setError(null);
      let data: HealthResponse | null = null;

      // Primary attempt via getApiBase()
      try {
        const primaryUrl = `${getApiBase()}/health`;
        const res = await fetch(primaryUrl);
        if (res.ok) data = await res.json();
      } catch (_e) {
        // Fallback 1: try Next.js rewritten proxy route
        try {
          const res2 = await fetch("/api/health");
          if (res2.ok) data = await res2.json();
        } catch (_e2) {
          // Fallback 2: try explicit localhost
          try {
            const res3 = await fetch("http://localhost:8000/api/v1/health");
            if (res3.ok) data = await res3.json();
          } catch (_e3) {
            // All attempts failed
          }
        }
      }

      if (data) {
        setHealth(data);
      } else {
        throw new Error("Unable to establish connection to the backend service");
      }
    } catch (_err) {
      setError("We couldn't reach the backend service. The prototype is showing validated demonstration data.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p style={{ color: "var(--text-muted)" }}>{t("common.loading")}</p>;
  if (error) {
    return (
      <div style={{ padding: "1rem", background: "var(--accent-amber-bg)", border: "1px solid var(--accent-amber-border)", borderRadius: "var(--radius-sm)", color: "var(--accent-amber)" }}>
        {error} <button onClick={fetchHealth} className="btn btn-secondary btn-sm" style={{ marginLeft: "0.5rem" }}>{t("common.retry")}</button>
      </div>
    );
  }
  if (!health) return <p>{t("common.loading")}</p>;

  const statusColor = health.status === "ok" ? "var(--accent-green)" : health.status === "degraded" ? "var(--accent-amber)" : "red";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
      <StatusCard label={t("health.apiStatus")} value={health.status} color={statusColor} />
      <StatusCard label={t("health.databaseStatus")} value={health.database} color={health.database === "ok" ? "var(--accent-green)" : "red"} />
      <StatusCard label={t("health.redisStatus")} value={health.redis} color={health.redis === "ok" ? "var(--accent-green)" : "red"} />
      <StatusCard label={t("health.environment")} value={health.environment} color="var(--accent-blue)" />
    </div>
  );
}

function StatusCard({ label, value, color }: { label: string; value: string; color: string }) {
  const { t } = useTranslation();
  const displayValue = t(`health.${value}`) || value;
  return (
    <div style={{ padding: "1rem", border: `1px solid var(--border-subtle)`, borderRadius: "var(--radius-sm)", background: "var(--bg-card)" }}>
      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: "1.25rem", fontWeight: "bold", color }}>{displayValue}</div>
    </div>
  );
}