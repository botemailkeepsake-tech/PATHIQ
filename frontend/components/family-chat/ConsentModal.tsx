"use client";

import React from "react";

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrant: () => void;
  consentText: string;
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
    maxHeight: "85vh",
    overflowY: "auto" as const,
    boxShadow: "var(--shadow-xl)",
    animation: "slideUp 0.2s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  textArea: {
    padding: "1rem",
    background: "var(--bg-muted)",
    borderRadius: "var(--radius-md)",
    marginBottom: "1rem",
    fontSize: "0.85rem",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap" as const,
    color: "var(--text-main)",
    maxHeight: "300px",
    overflowY: "auto" as const,
  },
  buttons: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end",
  },
};

export function ConsentModal({ isOpen, onClose, onGrant, consentText, t }: ConsentModalProps) {
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
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{t("familyChat.consentTitle")}</h2>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.25rem", lineHeight: 1 }}
              aria-label={t("common.close")}
            >
              ✕
            </button>
          </div>

          <div style={modalStyles.textArea}>
            {consentText}
          </div>

          <div style={modalStyles.buttons}>
            <button onClick={onClose} className="btn btn-secondary">
              {t("common.cancel")}
            </button>
            <button onClick={onGrant} className="btn btn-primary">
              {t("familyChat.consentAgree")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}