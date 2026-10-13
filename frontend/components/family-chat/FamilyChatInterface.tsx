"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getApiBase, apiPost, apiGet } from "@/lib/api";
import { EvidenceCard } from "@/components/family-chat/EvidenceCard";
import { SuggestedQuestions } from "@/components/family-chat/SuggestedQuestions";
import { LanguageSelector } from "@/components/family-chat/LanguageSelector";
import { VoiceInput } from "@/components/family-chat/VoiceInput";
import { ConsentModal } from "@/components/family-chat/ConsentModal";
import { HandoffModal } from "@/components/family-chat/HandoffModal";

interface Message {
  id: string;
  role: "parent" | "assistant" | "system";
  text: string;
  language: string;
  timestamp: Date;
  evidenceCards?: EvidenceCardData[];
  concerns?: ConcernData[];
  escalation?: EscalationData;
  abstention?: AbstentionData | null;
  safety?: { distress: boolean };
  isRetrying?: boolean;
  error?: string | null;
}

interface EvidenceCardData {
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
}

interface ConcernData {
  id: string;
  label: string;
  confidence: number;
  needs_confirmation: boolean;
}

interface EscalationData {
  suggested: boolean;
  reason?: string;
}

interface AbstentionData {
  reason: string;
  details: string;
  next_action: string;
}

interface FamilyChatInterfaceProps {
  apiHealth?: { status: string } | null;
  apiError?: string | null;
}

const SUGGESTED_QUESTIONS = {
  en: [
    { id: "job_security", text: "Will my child get a stable job after ITI?", topic: "job_security" },
    { id: "income", text: "What is the starting salary for ITI graduates?", topic: "income" },
    { id: "safety", text: "Is the workplace safe for electrical trades?", topic: "safety" },
    { id: "social_perception", text: "What will relatives think about ITI vs degree?", topic: "social_perception" },
    { id: "degree_foreclosure", text: "Can my child still do a diploma/degree after ITI?", topic: "degree_foreclosure" },
  ],
  hi: [
    { id: "job_security", text: "ITI के बाद नौकरी मिलेगी क्या?", topic: "job_security" },
    { id: "income", text: "ITI के बाद सैलरी कितनी होती है?", topic: "income" },
    { id: "safety", text: "इलेक्ट्रिकल ट्रेड में सुरक्षा कैसी है?", topic: "safety" },
    { id: "social_perception", text: "लोग ITI के बारे में क्या कहेंगे?", topic: "social_perception" },
    { id: "degree_foreclosure", text: "ITI के बाद डिप्लोमा/डिग्री कर सकते हैं क्या?", topic: "degree_foreclosure" },
  ],
  mr: [
    { id: "job_security", text: "ITI नंतर नोकरी मिळेल का?", topic: "job_security" },
    { id: "income", text: "ITI नंतर पगार किती असेल?", topic: "income" },
    { id: "safety", text: "इलेक्ट्रिकल ट्रेडमध्ये सुरक्षा कशी आहे?", topic: "safety" },
    { id: "social_perception", text: "लोक ITI बद्दल काय म्हणतील?", topic: "social_perception" },
    { id: "degree_foreclosure", text: "ITI नंतर डिप्लोमा/पदवी शक्य आहे का?", topic: "degree_foreclosure" },
  ],
};

const WELCOME_MESSAGES = {
  en: "Hello! I'm PATHIQ, your AI career guidance assistant. I help parents like you explore verified information about ITI trades, job prospects, salaries, safety, and future education pathways. I only share information from official, verified sources. How can I help you today?",
  hi: "नमस्ते! मैं PATHIQ हूँ, आपका AI करियर मार्गदर्शन सहायक। मैं आप जैसे माता-पिता को ITI ट्रेड, नौकरी की संभावनाएं, वेतन, सुरक्षा और भविष्य के शिक्षा मार्गों के बारे में सत्यापित जानकारी खोजने में मदद करता हूँ। मैं केवल आधिकारिक, सत्यापित स्रोतों से जानकारी साझा करता हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
  mr: "नमस्कार! मी PATHIQ आहे, तुमचा AI करीयर मार्गदर्शन सहाय्यक. मी तुमच्यासारख्या पालकांना ITI ट्रेड, नोकरीच्या संधी, पगार, सुरक्षा आणि भविष्यातील शिक्षण मार्गबाबत सत्यापित माहिती शोधण्यात मदत करतो. मी फक्त अधिकृत, सत्यापित स्रोतांमधून माहिती शेअर करतो. आज मी तुमची कशी मदत करू शकतो?",
};

<style jsx global>{`
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spin-loader {
    border: 2px solid var(--border-strong);
    border-top-color: var(--accent-terracotta);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
`}</style>

export function FamilyChatInterface({ apiHealth, apiError }: FamilyChatInterfaceProps) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [language, setLanguage] = useState("en");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [consentGranted, setConsentGranted] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const [handoffConsent, setHandoffConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryMessageId, setRetryMessageId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startSession = async () => {
    try {
      setError(null);
      const response = await apiPost<{
        session_id: string;
        consent_text: { version: string; language: string; text: string; retention_days: number };
        suggested_questions: typeof SUGGESTED_QUESTIONS.en;
      }>("/family-chat/consents/start", {
        language,
        pilot_region: "Maharashtra",
        trade_of_interest: "electrician",
      });
      setSessionId(response.session_id);
      setShowConsent(true);
    } catch (err) {
      setError(t("familyChat.errors.sessionFailed"));
      console.error("Session start failed:", err);
    }
  };

  const grantConsent = async () => {
    if (!sessionId) return;
    try {
      setError(null);
      const response = await apiPost<{ session_token: string; expires_at: string }>(
        `/family-chat/consents/${sessionId}/grant`,
        { kind: "session", consenter_role: "parent", method: "typed_confirmation" }
      );
      setSessionToken(response.session_token);
      setConsentGranted(true);
      setShowConsent(false);
      addWelcomeMessage();
    } catch (err) {
      setError(t("familyChat.errors.consentFailed"));
      console.error("Consent failed:", err);
    }
  };

  const addWelcomeMessage = () => {
    const welcomeText = WELCOME_MESSAGES[language as keyof typeof WELCOME_MESSAGES] || WELCOME_MESSAGES.en;
    setMessages([{
      id: "welcome",
      role: "assistant",
      text: welcomeText,
      language,
      timestamp: new Date(),
    }]);
  };

  const sendMessage = async (text: string, isRetry = false) => {
    if (!text.trim() || !sessionId || !consentGranted) return;

    const messageId = isRetry ? (retryMessageId as string) : `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
    if (isRetry) {
      setMessages((prev: Message[]) => prev.map(m => 
        m.id === messageId ? { ...m, isRetrying: true, error: null as string | null } : m
      ));
      setRetryMessageId(null);
    } else {
      const userMessage: Message = {
        id: messageId,
        role: "parent",
        text: text.trim(),
        language,
        timestamp: new Date(),
        error: undefined,
      };
      setMessages((prev: Message[]) => [...prev, userMessage]);
    }
    setInputText("");
    setShowSuggestions(false);
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiPost<{
        message_id: string;
        safety: { distress: boolean };
        concerns: ConcernData[];
        reply: { kind: string; text: string; evidence_cards: EvidenceCardData[] };
        evidence_cards: EvidenceCardData[];
        escalation: EscalationData;
        abstention: AbstentionData | null;
      }>(`/family-chat/sessions/${sessionId}/messages`, {
        text: text.trim(),
        language,
        speaker_role: "parent",
      });

      const assistantMessage: Message = {
        id: response.message_id,
        role: "assistant",
        text: response.reply.text,
        language,
        timestamp: new Date(),
        evidenceCards: response.reply.evidence_cards,
        concerns: response.concerns,
        escalation: response.escalation,
        abstention: response.abstention,
        safety: response.safety,
      };

      setMessages(prev => prev.map(m => 
        m.id === messageId && isRetry ? assistantMessage : m
      ).filter(m => !(m.id === messageId && isRetry)).concat(
        isRetry ? [] : assistantMessage
      ));

      if (response.escalation?.suggested && !showHandoff) {
        setShowHandoff(true);
      }
    } catch (err: any) {
      const errorMsg = err.message || t("familyChat.errors.messageFailed");
      if (isRetry) {
        setMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, isRetrying: false, error: errorMsg } : m
        ));
      } else {
        setMessages(prev => [...prev, {
          id: `error_${Date.now()}`,
          role: "system",
          text: errorMsg,
          language,
          timestamp: new Date(),
          error: errorMsg,
        }]);
        setRetryMessageId(messageId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (messageId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (msg && msg.role === "parent") {
      setRetryMessageId(messageId);
      sendMessage(msg.text, true);
    }
  };

  const handleSuggestedQuestion = (question: { text: string; topic: string }) => {
    sendMessage(question.text);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setMessages([]);
    setSessionId(null);
    setSessionToken(null);
    setConsentGranted(false);
    setShowConsent(false);
    setShowSuggestions(true);
    startSession();
  };

  const handleHandoffConsent = async (granted: boolean) => {
    if (!sessionId) return;
    try {
      await apiPost(`/family-chat/consents/${sessionId}/handoff-consent`, { granted });
      setHandoffConsent(granted);
      setShowHandoff(false);
      if (granted) {
        setMessages(prev => [...prev, {
          id: `handoff_${Date.now()}`,
          role: "system",
          text: t("familyChat.handoffConfirmed"),
          language,
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      console.error("Handoff consent failed:", err);
    }
  };

  const handleEndSession = async () => {
    if (!sessionId) return;
    try {
      await apiPost(`/family-chat/sessions/${sessionId}/end`, { reason: "user_ended" });
      setMessages(prev => [...prev, {
        id: `end_${Date.now()}`,
        role: "system",
        text: t("familyChat.sessionEnded"),
        language,
        timestamp: new Date(),
      }]);
    } catch (err) {
      console.error("End session failed:", err);
    }
  };

  useEffect(() => {
    if (!sessionId && !consentGranted && !showConsent) {
      startSession();
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", minHeight: "500px" }}>
      {/* Chat Header */}
      <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-card)", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-terracotta), var(--accent-terracotta-hover))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1.25rem" }}>
              P
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{t("familyChat.title")}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {t("familyChat.subtitle")}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <LanguageSelector
              currentLanguage={language}
              onChange={handleLanguageChange}
            />
            {consentGranted && sessionId && (
              <button
                onClick={handleEndSession}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "0.75rem" }}
              >
                {t("familyChat.endSession")}
              </button>
            )}
          </div>
        </div>
        {/* AI Disclaimer */}
        <div style={{ marginTop: "0.75rem", padding: "0.5rem 0.75rem", background: "var(--bg-muted)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          🤖 {t("familyChat.aiDisclaimer")}
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {messages.length === 0 && !isLoading && showSuggestions && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
            <h3 style={{ marginBottom: "0.5rem" }}>{t("familyChat.startConversation")}</h3>
            <p style={{ maxWidth: "400px", margin: "0 auto 1.5rem" }}>{t("familyChat.startHint")}</p>
            <button onClick={startSession} className="btn btn-primary" disabled={isLoading}>
              {isLoading ? t("common.loading") : t("familyChat.startButton")}
            </button>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onRetry={handleRetry}
            t={t}
          />
        ))}

        {isLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", padding: "0.5rem" }}>
            <div className="spin-loader" style={{ width: "16px", height: "16px" }} />
            <span>{t("familyChat.thinking")}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {showSuggestions && messages.length > 0 && consentGranted && (
        <SuggestedQuestions
          questions={SUGGESTED_QUESTIONS[language as keyof typeof SUGGESTED_QUESTIONS] || SUGGESTED_QUESTIONS.en}
          onSelect={handleSuggestedQuestion}
          t={t}
        />
      )}

      {/* Input Area */}
      <div style={{ padding: "1rem", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-card)", borderRadius: "0 0 var(--radius-lg) var(--radius-lg)" }}>
        {error && (
          <div style={{ marginBottom: "0.75rem", padding: "0.75rem", background: "var(--accent-red-bg)", border: "1px solid var(--accent-red-border)", borderRadius: "var(--radius-sm)", color: "var(--accent-red)", fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem" }}>
              {t("common.dismiss")}
            </button>
          </div>
        )}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
          <VoiceInput
            language={language}
            onTranscript={setInputText}
            disabled={isLoading}
          />
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputText);
              }
            }}
            placeholder={consentGranted ? t("familyChat.placeholder") : t("familyChat.consentFirst")}
            disabled={isLoading || !consentGranted}
            style={{
              flex: 1,
              minHeight: "44px",
              maxHeight: "150px",
              padding: "0.75rem 1rem",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-input)",
              color: "var(--text-main)",
              fontSize: "1rem",
              fontFamily: "inherit",
              resize: "none",
              outline: "none",
            }}
          />
          <button
            onClick={() => sendMessage(inputText)}
            disabled={isLoading || !inputText.trim() || !consentGranted}
            className="btn btn-primary"
            style={{ height: "44px", padding: "0 1.25rem", whiteSpace: "nowrap" }}
          >
            {t("common.send")}
          </button>
        </div>
        <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center" }}>
          {t("familyChat.footerHint")}
        </div>
      </div>

      {/* Modals */}
      {showConsent && sessionId && (
        <ConsentModal
          isOpen={showConsent}
          onClose={() => setShowConsent(false)}
          onGrant={grantConsent}
          consentText={WELCOME_MESSAGES[language as keyof typeof WELCOME_MESSAGES] || WELCOME_MESSAGES.en}
          t={t}
        />
      )}

      {showHandoff && (
        <HandoffModal
          isOpen={showHandoff}
          onClose={() => setShowHandoff(false)}
          onConfirm={handleHandoffConsent}
          t={t}
        />
      )}
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  onRetry: (id: string) => void;
  t: (key: string) => string;
}

function MessageBubble({ message, onRetry, t }: MessageBubbleProps) {
  const isParent = message.role === "parent";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div style={{ textAlign: "center", padding: "0.5rem", color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic" }}>
        {message.text}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: isParent ? "row-reverse" : "row", gap: "0.5rem", alignItems: "flex-start" }}>
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: isParent ? "var(--accent-blue-bg)" : "linear-gradient(135deg, var(--accent-terracotta), var(--accent-terracotta-hover))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isParent ? "var(--accent-blue)" : "white",
          fontWeight: 700,
          fontSize: "0.85rem",
          flexShrink: 0,
          marginTop: "2px",
        }}
      >
        {isParent ? "👤" : "P"}
      </div>
      <div style={{ flex: 1, maxWidth: "75%", display: "flex", flexDirection: isParent ? "row-reverse" : "row", gap: "0.5rem" }}>
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: isParent ? "var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)" : "var(--radius-lg) var(--radius-lg) var(--radius-lg) 0",
            background: isParent ? "var(--accent-blue-bg)" : "var(--bg-card)",
            border: isParent ? "none" : "1px solid var(--border-subtle)",
            boxShadow: isParent ? "none" : "var(--shadow-sm)",
            position: "relative",
          }}
        >
          <div style={{ marginBottom: "0.25rem", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {isParent ? t("familyChat.you") : t("familyChat.assistant")}
          </div>
          <div style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {message.text}
          </div>
          {message.error && (
            <div style={{ marginTop: "0.5rem", padding: "0.5rem", background: "var(--accent-red-bg)", border: "1px solid var(--accent-red-border)", borderRadius: "var(--radius-sm)", color: "var(--accent-red)", fontSize: "0.8rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span>⚠ {message.error}</span>
              <button onClick={() => onRetry(message.id)} className="btn btn-secondary btn-sm" style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}>
                {t("common.retry")}
              </button>
            </div>
          )}
          {message.isRetrying && (
            <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-terracotta)", fontSize: "0.8rem" }}>
              <div className="spin-loader" style={{ width: "14px", height: "14px" }} />
              <span>{t("familyChat.retrying")}</span>
            </div>
          )}
          {message.concerns && message.concerns.length > 0 && (
            <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {message.concerns.map((c) => (
                <span
                  key={c.id}
                  style={{
                    padding: "0.2rem 0.5rem",
                    fontSize: "0.65rem",
                    borderRadius: "var(--radius-full)",
                    background: c.needs_confirmation ? "var(--accent-amber-bg)" : "var(--accent-green-bg)",
                    color: c.needs_confirmation ? "var(--accent-amber)" : "var(--accent-green)",
                    border: c.needs_confirmation ? "1px solid var(--accent-amber-border)" : "1px solid var(--accent-green-border)",
                  }}
                >
                  {c.label.replace("_", " ")} {c.needs_confirmation ? "?" : `(${Math.round(c.confidence * 100)}%)`}
                </span>
              ))}
            </div>
          )}
          {message.evidenceCards && message.evidenceCards.length > 0 && (
            <div style={{ marginTop: "0.75rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                {t("familyChat.evidenceSources")}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {message.evidenceCards.map((card) => (
                  <EvidenceCard key={card.record_id} card={card} t={t} />
                ))}
              </div>
            </div>
          )}
          {message.abstention && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "var(--accent-amber-bg)", border: "1px solid var(--accent-amber-border)", borderRadius: "var(--radius-md)", color: "var(--accent-amber)" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>🤷 {t("familyChat.abstentionTitle")}</div>
              <div style={{ fontSize: "0.85rem" }}>{message.abstention.details || message.abstention.reason}</div>
              {message.abstention.next_action && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", fontStyle: "italic" }}>
                  {t("familyChat.nextAction")}: {message.abstention.next_action}
                </div>
              )}
            </div>
          )}
          {message.escalation?.suggested && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "var(--accent-blue-bg)", border: "1px solid var(--accent-blue-border)", borderRadius: "var(--radius-md)", color: "var(--accent-blue)" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>🤝 {t("familyChat.escalationTitle")}</div>
              <div style={{ fontSize: "0.85rem" }}>
                {message.escalation.reason === "distress" ? t("familyChat.escalationDistress") : t("familyChat.escalationOther")}
              </div>
            </div>
          )}
          {message.safety?.distress && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "var(--accent-red-bg)", border: "1px solid var(--accent-red-border)", borderRadius: "var(--radius-md)", color: "var(--accent-red)" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>🆘 {t("familyChat.distressTitle")}</div>
              <div style={{ fontSize: "0.85rem" }}>{t("familyChat.distressMessage")}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}