"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface SpeechRecognitionOptions {
  language?: "en" | "hi" | "mr" | string;
  onTranscriptChange?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  errorMessage: string | null;
  startListening: (overrideLang?: string) => void;
  stopListening: () => void;
  resetTranscript: () => void;
  localeCode: string;
}

const LANGUAGE_CODE_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const { language = "hi", onTranscriptChange, onFinalTranscript } = options;

  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef<boolean>(false);

  const localeCode = LANGUAGE_CODE_MAP[language] || "en-IN";

  // Check Web Speech API availability on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognitionClass));
    }
  }, []);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_e) {
        // Ignore stop errors if already stopped
      }
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
    setErrorMessage(null);
  }, []);

  const startListening = useCallback(
    (overrideLang?: string) => {
      setError(null);
      setErrorMessage(null);
      setTranscript("");
      setInterimTranscript("");

      if (typeof window === "undefined") return;

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        setIsSupported(false);
        setError("unsupported");
        setErrorMessage(
          "Voice input isn't supported in this browser. You can type your response instead."
        );
        return;
      }

      // Stop any existing session
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_e) {}
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;
        isManuallyStoppedRef.current = false;

        const langToUse = overrideLang
          ? LANGUAGE_CODE_MAP[overrideLang] || overrideLang
          : localeCode;

        recognition.lang = langToUse;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
          setErrorMessage(null);
        };

        recognition.onresult = (event: any) => {
          let currentInterim = "";
          let finalChunk = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const item = event.results[i];
            const text = item[0].transcript;
            if (item.isFinal) {
              finalChunk += text;
            } else {
              currentInterim += text;
            }
          }

          if (finalChunk) {
            setTranscript((prev) => {
              const updated = prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim();
              if (onTranscriptChange) onTranscriptChange(updated);
              if (onFinalTranscript) onFinalTranscript(updated);
              return updated;
            });
            setInterimTranscript("");
          } else {
            setInterimTranscript(currentInterim);
            if (onTranscriptChange && currentInterim) {
              onTranscriptChange(currentInterim);
            }
          }
        };

        recognition.onerror = (event: any) => {
          const errType = event.error || "unknown";
          setError(errType);

          if (errType === "not-allowed" || errType === "permission-denied") {
            setErrorMessage("Microphone access was denied. Please allow microphone permissions or type your question.");
          } else if (errType === "no-speech") {
            setErrorMessage("No speech detected. Please speak clearly into the microphone or type below.");
          } else if (errType === "network") {
            setErrorMessage("Speech network service unavailable. You can type your question directly.");
          } else {
            setErrorMessage("Voice recognition encountered an issue. Please retry or type below.");
          }

          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript("");
        };

        recognition.start();
      } catch (err: any) {
        setError("init-error");
        setErrorMessage("Could not initialize microphone. Please type your query.");
        setIsListening(false);
      }
    },
    [localeCode, onTranscriptChange, onFinalTranscript]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_e) {}
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    errorMessage,
    startListening,
    stopListening,
    resetTranscript,
    localeCode,
  };
}
