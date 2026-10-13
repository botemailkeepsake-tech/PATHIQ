"use client";

import React from "react";

interface LanguageSelectorProps {
  currentLanguage: string;
  onChange: (language: string) => void;
}

const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
];

export function LanguageSelector({ currentLanguage, onChange }: LanguageSelectorProps) {
  return (
    <select
      value={currentLanguage}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "0.35rem 2rem 0.35rem 0.75rem",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        background: "var(--bg-input)",
        color: "var(--text-main)",
        fontSize: "0.85rem",
        fontFamily: "inherit",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.5rem center",
      }}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName} ({lang.name})
        </option>
      ))}
    </select>
  );
}