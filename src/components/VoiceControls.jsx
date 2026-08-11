"use client";

import React from "react";

export const VoiceControls = ({
  isMuted = false,
  onToggleMute,
  onStop,
  onRestart
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        margin: "6px 0 12px 0",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      {/* Mute Button */}
      <button
        onClick={onToggleMute}
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          backgroundColor: isMuted ? "rgba(255, 77, 77, 0.15)" : "rgba(255, 255, 255, 0.05)",
          border: isMuted ? "1px solid rgba(255, 77, 77, 0.5)" : "1px solid rgba(139, 92, 255, 0.3)",
          color: isMuted ? "#FF4D4D" : "#E2D9F3",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          transition: "all 0.2s ease-in-out",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isMuted ? "rgba(255, 77, 77, 0.25)" : "rgba(139, 92, 255, 0.25)";
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = isMuted ? "0 0 10px rgba(255, 77, 77, 0.4)" : "0 0 10px rgba(139, 92, 255, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isMuted ? "rgba(255, 77, 77, 0.15)" : "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
        title={isMuted ? "Unmute AI voice output" : "Mute AI voice output"}
      >
        {isMuted ? <i className="bi bi-volume-mute-fill"></i> : <i className="bi bi-volume-up-fill"></i>}
      </button>

      {/* Stop Button */}
      <button
        onClick={onStop}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 77, 77, 0.1)",
          border: "1px solid rgba(255, 77, 77, 0.4)",
          color: "#FF4D4D",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          transition: "all 0.2s ease-in-out",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 77, 77, 0.25)";
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 0 12px rgba(255, 77, 77, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 77, 77, 0.1)";
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
        title="Stop listening/speaking"
      >
        <i className="bi bi-stop-fill"></i>
      </button>

      {/* Restart Button */}
      <button
        onClick={onRestart}
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(139, 92, 255, 0.3)",
          color: "#E2D9F3",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          transition: "all 0.2s ease-in-out",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(139, 92, 255, 0.25)";
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 0 10px rgba(139, 92, 255, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
        title="Clear transcript & restart"
      >
        <i className="bi bi-arrow-clockwise"></i>
      </button>
    </div>
  );
};

export default VoiceControls;
