"use client";

import React, { useState, useEffect } from "react";
import { DemoNavbar } from "@/components/demo/DemoNavbar";
import { Screen1Welcome } from "@/components/demo/Screen1Welcome";
import { Screen2FamilySession } from "@/components/demo/Screen2FamilySession";
import { Screen3ConcernDetection } from "@/components/demo/Screen3ConcernDetection";
import { Screen4Evidence } from "@/components/demo/Screen4Evidence";
import { Screen5Progression } from "@/components/demo/Screen5Progression";
import { Screen6ComparePriorities } from "@/components/demo/Screen6ComparePriorities";
import { Screen7FamilySummary } from "@/components/demo/Screen7FamilySummary";
import { Screen8CounsellorHandoff } from "@/components/demo/Screen8CounsellorHandoff";
import { AbstentionModal } from "@/components/demo/AbstentionModal";
import { fetchEvidenceWithFallback } from "@/lib/api";

const INITIAL_PARENT_UTTERANCE = "ITI ke baad job milegi kya?";
const INITIAL_STUDENT_UTTERANCE = "I'm interested in becoming an electrician. I want to learn hands-on technical skills.";

export default function DemoPage() {
  // 1: Understand (Welcome)
  // 2: Family Session (Roles & Voice Input)
  // 3: Concern Detection (Intent & Confidence)
  // 4: Evidence (Grounded Records)
  // 5: Progression (Pathway Ladder)
  // 6: Compare (Mutual Priorities)
  // 7: Family Summary (Decision Dossier)
  // 8: Counsellor Handoff (Packet Prepared)
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [selectedPathway, setSelectedPathway] = useState<string>("iti");
  const [parentUtterance, setParentUtterance] = useState<string>(INITIAL_PARENT_UTTERANCE);
  const [studentUtterance, setStudentUtterance] = useState<string>(INITIAL_STUDENT_UTTERANCE);
  const [confirmedConcernId, setConfirmedConcernId] = useState<string>("job_security");
  const [currentLanguage, setCurrentLanguage] = useState<string>("hi");
  const [isAbstentionOpen, setIsAbstentionOpen] = useState<boolean>(false);
  const [sourceMode, setSourceMode] = useState<"api" | "demo_fallback">("demo_fallback");
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  // Check live API health safely
  useEffect(() => {
    async function checkApi() {
      try {
        const result = await fetchEvidenceWithFallback("job_security", "electrician");
        setSourceMode(result.sourceMode);
      } catch (_e) {
        setSourceMode("demo_fallback");
      }
    }
    checkApi();
  }, []);

  // Smooth stage transition with brief loading feedback
  const transitionToStage = (nextStage: number, message?: string) => {
    if (message) {
      setLoadingMessage(message);
      setTimeout(() => {
        setLoadingMessage(null);
        setCurrentStage(nextStage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 450);
    } else {
      setCurrentStage(nextStage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestartDemo = () => {
    setSelectedPathway("iti");
    setParentUtterance(INITIAL_PARENT_UTTERANCE);
    setStudentUtterance(INITIAL_STUDENT_UTTERANCE);
    setConfirmedConcernId("job_security");
    setCurrentLanguage("hi");
    setCurrentStage(1);
    setLoadingMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-canvas)", position: "relative" }}>
      {/* Loading Overlay */}
      {loadingMessage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(250, 248, 245, 0.82)",
            backdropFilter: "blur(3px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9998,
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              border: "3px solid var(--border-strong)",
              borderTopColor: "var(--accent-terracotta)",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
              marginBottom: "1rem",
            }}
          />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
            {loadingMessage}
          </div>
        </div>
      )}

      <main className="container-demo">
        {/* Navigation Bar & 8-Step Stepper */}
        <DemoNavbar
          currentStage={currentStage}
          onSelectStage={(stage) => transitionToStage(stage)}
          onOpenAbstentionModal={() => setIsAbstentionOpen(true)}
          onRestartDemo={handleRestartDemo}
          currentLanguage={currentLanguage}
          onLanguageChange={(lang) => setCurrentLanguage(lang)}
          sourceMode={sourceMode}
        />

        {/* 01 Understand (Welcome) */}
        {currentStage === 1 && (
          <Screen1Welcome
            onStartSession={() => transitionToStage(2)}
            onExploreDemo={() => transitionToStage(2)}
          />
        )}

        {/* 02 Family Session (Roles & Voice Input) */}
        {currentStage === 2 && (
          <Screen2FamilySession
            currentLanguage={currentLanguage}
            onProceedToDetection={(pathway, _concern, pUtterance, sUtterance) => {
              setSelectedPathway(pathway);
              if (pUtterance) setParentUtterance(pUtterance);
              if (sUtterance) setStudentUtterance(sUtterance);
              transitionToStage(3, "Analyzing concern from family input...");
            }}
            onBack={() => transitionToStage(1)}
          />
        )}

        {/* 03 Concern Detection */}
        {currentStage === 3 && (
          <Screen3ConcernDetection
            parentUtterance={parentUtterance}
            initialConcernId={confirmedConcernId}
            currentLanguage={currentLanguage}
            onConfirmConcern={(confirmedId) => {
              setConfirmedConcernId(confirmedId);
              transitionToStage(4, "Retrieving evidence records...");
            }}
            onBack={() => transitionToStage(2)}
          />
        )}

        {/* 04 Evidence */}
        {currentStage === 4 && (
          <Screen4Evidence
            confirmedConcernId={confirmedConcernId}
            onProceedToProgression={() => transitionToStage(5)}
            onOpenAbstentionModal={() => setIsAbstentionOpen(true)}
            onBack={() => transitionToStage(3)}
            sourceMode={sourceMode}
          />
        )}

        {/* 05 Progression */}
        {currentStage === 5 && (
          <Screen5Progression
            onProceedToCompare={() => transitionToStage(6)}
            onBack={() => transitionToStage(4)}
          />
        )}

        {/* 06 Compare */}
        {currentStage === 6 && (
          <Screen6ComparePriorities
            onProceedToSummary={() => transitionToStage(7, "Preparing family summary...")}
            onBack={() => transitionToStage(5)}
          />
        )}

        {/* 07 Family Summary */}
        {currentStage === 7 && (
          <Screen7FamilySummary
            selectedPathway={selectedPathway}
            confirmedConcernId={confirmedConcernId}
            parentUtterance={parentUtterance}
            onTalkToCounsellor={() => transitionToStage(8, "Preparing counsellor handoff...")}
            onContinueDiscussion={() => transitionToStage(6)}
            onBack={() => transitionToStage(6)}
          />
        )}

        {/* 08 Counsellor Handoff */}
        {currentStage === 8 && (
          <Screen8CounsellorHandoff
            selectedPathway={selectedPathway}
            confirmedConcernId={confirmedConcernId}
            parentUtterance={parentUtterance}
            studentUtterance={studentUtterance}
            currentLanguage={currentLanguage}
            onRestartDemo={handleRestartDemo}
            onBack={() => transitionToStage(7)}
          />
        )}

        {/* Abstention Modal */}
        <AbstentionModal
          isOpen={isAbstentionOpen}
          onClose={() => setIsAbstentionOpen(false)}
        />
      </main>
    </div>
  );
}
