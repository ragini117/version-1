"use client";

import React from "react";

/**
 * VoiceButton — small mic icon button for the TextChat input bar.
 * Props:
 *   isListening: bool
 *   onStart: fn
 *   onStop: fn
 */
export const VoiceButton = ({ isListening, onStart, onStop }) => {
  const handleClick = () => {
    if (isListening) {
      onStop?.();
    } else {
      onStart?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      title={isListening ? "Stop listening" : "Start voice input"}
      style={{
        background: isListening
          ? "linear-gradient(135deg, #ff4444, #cc2222)"
          : "rgba(139, 92, 255, 0.15)",
        border: isListening
          ? "1px solid rgba(255,68,68,0.6)"
          : "1px solid rgba(139, 92, 255, 0.4)",
        color: "#fff",
        borderRadius: "50%",
        width: "44px",
        height: "44px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        flexShrink: 0,
        transition: "all 0.25s ease",
        boxShadow: isListening
          ? "0 0 14px rgba(255,68,68,0.45)"
          : "0 4px 12px rgba(139,92,255,0.2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Pulse ring when listening */}
      {isListening && (
        <span
          style={{
            position: "absolute",
            inset: "-4px",
            borderRadius: "50%",
            border: "2px solid rgba(255,68,68,0.5)",
            animation: "voicePulse 1.2s ease-out infinite",
          }}
        />
      )}
      <i className={isListening ? "bi bi-stop-fill" : "bi bi-mic-fill"} />

      <style>{`
        @keyframes voicePulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0;   }
        }
      `}</style>
    </button>
  );
};

export default VoiceButton;
