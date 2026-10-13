"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface VoiceInputProps {
  language: string;
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const LANGUAGE_CODES: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

<style jsx global>{`
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .pulse-animation {
    animation: pulse 1s infinite;
  }
`}</style>

// Extend Window interface for TypeScript
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
  }
}

export function VoiceInput({ language, onTranscript, disabled = false }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = LANGUAGE_CODES[language] || "en-IN";

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          setShowTranscript(true);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setShowTranscript(false);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const confirmTranscript = useCallback(() => {
    if (transcript.trim()) {
      onTranscript(transcript.trim());
      setTranscript("");
      setShowTranscript(false);
    }
  }, [transcript, onTranscript]);

  const discardTranscript = useCallback(() => {
    setTranscript("");
    setShowTranscript(false);
  }, []);

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled={disabled}
        title="Speech recognition not supported in this browser"
        style={{
          padding: "0.5rem 0.75rem",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-muted)",
          color: "var(--text-muted)",
          cursor: disabled ? "not-allowed" : "default",
          opacity: disabled ? 0.5 : 0.6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>🎤</span>
      </button>
    );
  }

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={`btn ${isListening ? "btn-primary" : "btn-secondary"} btn-sm`}
        style={{
          padding: "0.5rem 0.75rem",
          minWidth: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={isListening ? "Stop listening" : "Start voice input"}
        aria-pressed={isListening}
      >
        {isListening ? (
          <span className="pulse-animation" style={{ fontSize: "1.1rem" }}>🔴</span>
        ) : (
          <span style={{ fontSize: "1.1rem" }}>🎤</span>
        )}
      </button>

      {showTranscript && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            marginBottom: "0.5rem",
            padding: "0.75rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            maxHeight: "200px",
          }}
        >
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Edit transcript before sending..."
            style={{
              minHeight: "80px",
              maxHeight: "150px",
              padding: "0.5rem",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              background: "var(--bg-input)",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button
              onClick={discardTranscript}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.75rem" }}
            >
              Discard
            </button>
            <button
              onClick={confirmTranscript}
              className="btn btn-primary btn-sm"
              style={{ fontSize: "0.75rem" }}
              disabled={!transcript.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}