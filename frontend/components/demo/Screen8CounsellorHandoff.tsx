"use client";

import React, { useState } from "react";
import { buildDynamicHandoff, CounsellorHandoffData } from "@/lib/demo-data";

interface Screen8CounsellorHandoffProps {
  selectedPathway: string;
  confirmedConcernId: string;
  parentUtterance?: string;
  studentUtterance?: string;
  currentLanguage: string;
  onRestartDemo: () => void;
  onBack: () => void;
}

export function Screen8CounsellorHandoff({
  selectedPathway,
  confirmedConcernId,
  parentUtterance,
  studentUtterance,
  currentLanguage,
  onRestartDemo,
  onBack,
}: Screen8CounsellorHandoffProps) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [hasPrepared, setHasPrepared] = useState(false);
  const [handoff, setHandoff] = useState<CounsellorHandoffData>(() =>
    buildDynamicHandoff(
      selectedPathway || "iti",
      confirmedConcernId || "job_security",
      parentUtterance,
      studentUtterance,
      currentLanguage
    )
  );

  const handlePreparePacket = () => {
    setIsPreparing(true);
    setTimeout(() => {
      const updated = buildDynamicHandoff(
        selectedPathway || "iti",
        confirmedConcernId || "job_security",
        parentUtterance,
        studentUtterance,
        currentLanguage
      );
      setHandoff(updated);
      setIsPreparing(false);
      setHasPrepared(true);
    }, 700);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(handoff, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PATHIQ-Counsellor-Packet-${handoff.packetId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Screen Header */}
      <div style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-terracotta)" }}>
          Step 08 • Counsellor Handoff
        </span>
        <h1 style={{ fontSize: "1.95rem", fontWeight: 800, marginTop: "0.25rem" }}>
          You&apos;re Ready for the Next Step
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Seamless transition from AI evidence synthesis to accredited human vocational guidance.
        </p>
      </div>

      {/* Preparation State Notification */}
      {hasPrepared ? (
        <div
          className="card"
          style={{
            background: "var(--accent-green-bg)",
            border: "2px solid var(--accent-green)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>✅</span>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent-green)" }}>
                Counsellor handoff packet prepared
              </h2>
              <div style={{ fontSize: "0.85rem", color: "var(--accent-green)" }}>
                Dossier ID: <strong>#{handoff.packetId}</strong> • Ready for human consultation
              </div>
            </div>
          </div>
          <p style={{ fontSize: "0.92rem", color: "var(--accent-green)", margin: 0, lineHeight: 1.5 }}>
            This packet compiles student interest, parent concerns, evidence viewed, questions asked, and unresolved items into a structured briefing docket for the counsellor.
          </p>
        </div>
      ) : (
        <div
          className="card"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            padding: "1.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              Ready to assemble counsellor dossier?
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: 0 }}>
              Generates pre-session packet so family and counsellor are aligned on verified facts and unresolved questions.
            </p>
          </div>

          <button
            onClick={handlePreparePacket}
            disabled={isPreparing}
            className="btn btn-primary btn-lg"
          >
            {isPreparing ? "Preparing counsellor handoff..." : "Prepare for Counsellor →"}
          </button>
        </div>
      )}

      {/* Structured What PATHIQ Prepares Box */}
      <div
        className="card"
        style={{
          background: "#FFFFFF",
          border: "1px solid var(--border-subtle)",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.75rem" }}>
          PATHIQ prepares a counsellor handoff containing:
        </h3>

        <div className="grid-2">
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <span style={{ color: "var(--accent-green)", fontWeight: 700, fontSize: "1.1rem" }}>✓</span>
            <div>
              <strong>Student Interest:</strong>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {handoff.studentInterests[0]}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <span style={{ color: "var(--accent-green)", fontWeight: 700, fontSize: "1.1rem" }}>✓</span>
            <div>
              <strong>Parent Concerns:</strong>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {handoff.parentConcerns[0]}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <span style={{ color: "var(--accent-green)", fontWeight: 700, fontSize: "1.1rem" }}>✓</span>
            <div>
              <strong>Evidence Viewed:</strong>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {handoff.evidenceAttached.length} verified evidence records attached
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <span style={{ color: "var(--accent-green)", fontWeight: 700, fontSize: "1.1rem" }}>✓</span>
            <div>
              <strong>Language &amp; Unresolved Questions:</strong>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Language: {currentLanguage.toUpperCase()} • Local seat cutoffs &amp; fees to verify
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COUNSELLOR DOSSIER PREVIEW */}
      <div
        className="card"
        style={{
          background: "#FAFAFA",
          border: "2px dashed var(--border-strong)",
          borderRadius: "var(--radius-md)",
          padding: "2rem",
          marginBottom: "2.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <span className="badge badge-neutral" style={{ fontSize: "0.75rem" }}>
              Handoff Dossier Preview
            </span>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", marginTop: "0.25rem" }}>
              Pre-Session Brief: #{handoff.packetId}
            </h3>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleDownloadJSON}
              className="btn btn-secondary btn-sm"
              title="Download handoff packet JSON"
            >
              📥 Download Dossier (JSON)
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(handoff, null, 2));
                alert("Dossier copied to clipboard!");
              }}
              className="btn btn-secondary btn-sm"
            >
              📋 Copy Brief
            </button>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase" }}>
              Family Profile
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, marginTop: "0.2rem" }}>
              {handoff.studentName} &amp; Family
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Location: {handoff.familyLocation}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Candidate Pathway: {handoff.chosenTrade}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase" }}>
              Evidence Attached for Counsellor
            </div>
            <ul style={{ paddingLeft: "1.2rem", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              {handoff.evidenceAttached.map((e, idx) => (
                <li key={idx} style={{ marginBottom: "0.25rem" }}>
                  <strong>{e.title}</strong> — {e.stat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Discussion Points for Counsellor */}
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-subtle)", textTransform: "uppercase", marginBottom: "0.3rem" }}>
            Recommended Counsellor Discussion Topics:
          </div>
          <ul style={{ paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text-main)" }}>
            {handoff.recommendedDiscussionPoints.map((pt, idx) => (
              <li key={idx} style={{ marginBottom: "0.25rem" }}>
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Primary CTAs */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <button onClick={onBack} className="btn btn-ghost">
          ← Back to Summary
        </button>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={onRestartDemo} className="btn btn-secondary">
            🔄 Restart Demo
          </button>

          {!hasPrepared && (
            <button
              onClick={handlePreparePacket}
              disabled={isPreparing}
              className="btn btn-primary btn-lg"
            >
              {isPreparing ? "Preparing counsellor handoff..." : "Prepare for Counsellor"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
