"use client";

import React, { useState, useCallback } from "react";

/**
 * SpeechPlayer — "Read aloud" button beneath bot messages in TextChat.
 * Uses the browser's Web Speech Synthesis API (local, no network).
 * Props:
 *   text: string — the bot message text to speak
 */
export const SpeechPlayer = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleToggle = useCallback(() => {
    if (!text || typeof window === "undefined" || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // clear queue
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [text, isSpeaking]);

  if (!text) return null;

  return (
    <button
      onClick={handleToggle}
      title={isSpeaking ? "Stop reading" : "Read aloud"}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2px 6px",
        color: isSpeaking ? "#8B5CFF" : "rgba(255,255,255,0.4)",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        transition: "color 0.2s ease",
        borderRadius: "6px",
      }}
      onMouseEnter={(e) => {
        if (!isSpeaking) e.currentTarget.style.color = "rgba(255,255,255,0.7)";
      }}
      onMouseLeave={(e) => {
        if (!isSpeaking) e.currentTarget.style.color = "rgba(255,255,255,0.4)";
      }}
    >
      <i className={isSpeaking ? "bi bi-stop-circle-fill" : "bi bi-volume-up-fill"} style={{ fontSize: "13px" }} />
      <span style={{ fontSize: "11px", fontWeight: 500 }}>
        {isSpeaking ? "Stop" : "Read"}
      </span>
    </button>
  );
};

export default SpeechPlayer;
