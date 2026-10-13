"use client";

import React from "react";

interface HandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (granted: boolean) => void;
  t: (key: string) => string;
}

const modalStyles = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(2px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease-out",
  },
  content: {
    background: "var(--bg-card)",
    borderRadius: "var(--radius-lg)",
    padding: "1.5rem",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "var(--shadow-xl)",
    animation: "slideUp 0.2s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  body: {
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
    lineHeight: 1.7,
    color: "var(--text-main)",
  },
  note: {
    padding: "0.75rem",
    background: "var(--accent-blue-bg)",
    border: "1px solid var(--accent-blue-border)",
    borderRadius: "var(--radius-md)",
    marginBottom: "1rem",
    fontSize: "0.8rem",
    color: "var(--accent-blue)",
  },
  buttons: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end",
  },
};

export function HandoffModal({ isOpen, onClose, onConfirm, t }: HandoffModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={modalStyles.overlay}>
        <div style={modalStyles.content}>
          <div style={modalStyles.header}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-blue)" }}>
              🤝 {t("familyChat.handoffTitle")}
            </h2>
            <button
              onClick={() => onConfirm(false)}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.25rem", lineHeight: 1 }}
              aria-label={t("common.close")}
            >
              ✕
            </button>
          </div>

          <div style={modalStyles.body}>
            <p style={{ marginBottom: "0.75rem" }}>{t("familyChat.handoffDescription")}</p>
            <p style={{ marginBottom: "0.75rem", fontWeight: 600 }}>{t("familyChat.handoffNote")}</p>
            <ul style={{ marginLeft: "1.5rem", fontSize: "0.85rem" }}>
              <li style={{ marginBottom: "0.35rem" }}>{t("familyChat.handoffItem1")}</li>
              <li style={{ marginBottom: "0.35rem" }}>{t("familyChat.handoffItem2")}</li>
              <li style={{ marginBottom: "0.35rem" }}>{t("familyChat.handoffItem3")}</li>
              <li style={{ marginBottom: "0.35rem" }}>{t("familyChat.handoffItem4")}</li>
            </ul>
          </div>

          <div style={modalStyles.note}>
            <strong>{t("familyChat.handoffConsentNote")}</strong>
          </div>

          <div style={modalStyles.buttons}>
            <button onClick={() => onConfirm(false)} className="btn btn-secondary">
              {t("familyChat.handoffDecline")}
            </button>
            <button onClick={() => onConfirm(true)} className="btn btn-primary" style={{ background: "var(--accent-blue)", borderColor: "var(--accent-blue)" }}>
              {t("familyChat.handoffAccept")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}