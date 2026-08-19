"use client";

import React, { useState, useEffect, useCallback } from "react";
import TranscriptPanel from "./TranscriptPanel";
import MicrophoneButton from "./MicrophoneButton";
import VoiceControls from "./VoiceControls";
import SuggestionChips from "./SuggestionChips";
import ChatHeader from "./ChatHeader";
import useChatWindowSize from "../hooks/useChatWindowSize";
import { useChat } from "@/context/ChatContext";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

export const VoiceChat = ({
  isMobile = false,
  onClose,
  onBack,
  onSwitchMode
}) => {
  const { isExpanded, toggleExpand } = useChatWindowSize();
  const { messages, sendMessage, clearChat, isLoading } = useChat();
  const { speak, stop, isSpeaking: isSynthesisSpeaking } = useSpeechSynthesis();

  // Required State Management
  const [isMuted, setIsMuted] = useState(false);

  // Microphone and flow state representation ('idle' | 'listening' | 'processing' | 'speaking')
  const [currentState, setCurrentState] = useState("idle");

  // ⚠️ FIX: handleUserQuery must be defined BEFORE handleSpeechResult
  // (since handleSpeechResult depends on it), and wrapped in useCallback
  // so it's not recreated with stale `isMuted`/`sendMessage` closures on every render.
const handleUserQuery = useCallback(
  async (queryText) => {
    if (!queryText.trim()) return;

    stop();
    stopListening();
    setCurrentState("processing");

    sendMessage(
      queryText,
      (fullText) => {
        setCurrentState("idle");
        if (!isMuted) {
          speak(fullText);
        }
      },
      { isVoiceInput: true }
    );
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [sendMessage, isMuted, speak, stop]
);

  const handleSpeechResult = useCallback(
    (text) => {
      if (text && text.trim()) {
        handleUserQuery(text);
      }
    },
    [handleUserQuery]
  );

  const {
    isListening,
    startListening,
    stopListening,
    error: speechError
  } = useSpeechRecognition(handleSpeechResult, {
    continuous: true,
    silenceTimeoutMs: 3500,
    submitOnSpeechFinal: false,
  });

  // Clean up Speech on unmount
  useEffect(() => {
    return () => {
      stop();
      stopListening();
    };
  }, [stop, stopListening]);

  // Sync isSynthesisSpeaking to currentState
  useEffect(() => {
    if (isSynthesisSpeaking) {
      setCurrentState("speaking");
    } else {
      setCurrentState((prev) => (prev === "speaking" ? "idle" : prev));
    }
  }, [isSynthesisSpeaking]);

  // Sync isListening to currentState
  useEffect(() => {
    if (isListening) {
      setCurrentState("listening");
    } else {
      setCurrentState((prev) => (prev === "listening" ? "idle" : prev));
    }
  }, [isListening]);

  // Sync isLoading to reset currentState if stuck in processing
  useEffect(() => {
    if (!isLoading && currentState === "processing") {
      setCurrentState("idle");
    }
  }, [isLoading, currentState]);

  const handleMicClick = () => {
    if (isSynthesisSpeaking) {
      stop();
      setCurrentState("idle");
      // Add a 300ms delay after stopping active TTS so hardware settles
      setTimeout(() => {
        startListening();
      }, 300);
      return;
    }
    if (currentState === "listening") {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (nextMute) {
      stop();
    }
  };

  const handleStop = () => {
    stop();
    stopListening();
    setCurrentState("idle");
  };

  const handleRestart = () => {
    handleStop();
    clearChat();
    // Automatically trigger voice recognition after brief delay (300ms)
    setTimeout(() => {
      startListening();
    }, 300);
  };

  const handleChipClick = (chipText) => {
    handleStop();
    handleUserQuery(chipText);
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: "1000",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
        bottom: "20px",
        right: isMobile ? "10px" : "20px",
        width: isMobile ? "calc(100vw - 20px)" : (isExpanded ? "600px" : "380px"),
        height: isMobile ? "80vh" : (isExpanded ? "700px" : "520px"),
        backgroundColor: "rgba(10, 15, 31, 0.95)",
        borderRadius: "24px",
        boxShadow: "0 10px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 255, 0.25)",
        border: "1px solid rgba(139, 92, 255, 0.3)",
      }}
    >
      <ChatHeader
        mode="voice"
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
        onClose={onClose}
        onBack={onBack}
        onSwitchMode={onSwitchMode}
        chatHistory={messages}
        onClearChat={clearChat}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "16px 0 8px 0",
          overflowY: "auto",
        }}
      >
        {/* Transcript Panel */}
        <TranscriptPanel transcript={messages} />

        {/* User-visible error alerts for no-speech or permission errors */}
        {speechError && (
          <div
            style={{
              textAlign: "center",
              color: "#ff6b6b",
              fontSize: "12px",
              fontWeight: "600",
              margin: "4px 16px",
              padding: "8px 12px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 107, 107, 0.12)",
              border: "1px solid rgba(255, 107, 107, 0.25)",
            }}
          >
            {speechError}
          </div>
        )}

        {/* Microphone Section */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <MicrophoneButton currentState={currentState} onClick={handleMicClick} />
        </div>

        {/* Controls Section */}
        <VoiceControls
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onStop={handleStop}
          onRestart={handleRestart}
        />

        {/* Suggested Questions Section */}
        <SuggestionChips onChipClick={handleChipClick} />
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "8px",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.35)",
          fontSize: "11px",
          fontWeight: "500",
          backgroundColor: "rgba(10, 15, 31, 0.6)",
          borderTop: "1px solid rgba(139, 92, 255, 0.1)"
        }}
      >
        Powered by Decentrawood AI
      </div>

      {/* Embedded Styles for Animations */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceChat;