"use client";

import React from "react";



export const WelcomeScreen = ({
  isMobile = false,
  onMouseEnter,
  onMouseLeave,
  openTextChat,
  openVoiceChat,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: isMobile ? "90px" : "110px",
        right: isMobile ? "15px" : "30px",
        width: isMobile ? "calc(100vw - 30px)" : "360px",
        backgroundColor: "rgba(10, 15, 31, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(139, 92, 255, 0.3)",
        borderRadius: "24px",
        padding: "24px",
        zIndex: "9998",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 255, 0.2)",
        transformOrigin: "bottom right",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h4 style={{ color: "#FFFFFF", fontWeight: "700", marginBottom: "8px", fontSize: "20px" }}>
          Decentrawood AI
        </h4>
        <p style={{ color: "#D6D6D6", fontSize: "14px", margin: 0 }}>
          Choose how to interact with your AI Guide
        </p>
      </div>

      <div style={{ display: "flex", gap: "16px", justifyContent: "space-between" }}>
        {/* Text Chat Card */}
        <div
          onClick={openTextChat}
          style={{
            flex: 1,
            backgroundColor: "rgba(20, 10, 40, 0.7)",
            border: "1px solid rgba(139, 92, 255, 0.3)",
            borderRadius: "20px",
            padding: "24px 12px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(139, 92, 255, 0.15)";
            e.currentTarget.style.border = "1px solid rgba(139, 92, 255, 0.6)";
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(139, 92, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(20, 10, 40, 0.7)";
            e.currentTarget.style.border = "1px solid rgba(139, 92, 255, 0.3)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ fontSize: "42px", color: "#8B5CFF", marginBottom: "16px", filter: "drop-shadow(0 0 8px rgba(139, 92, 255, 0.6))" }}>
            <i className="bi bi-chat-dots-fill"></i>
          </div>
          <p style={{ color: "#D6D6D6", fontSize: "13px", margin: "0 0 8px 0" }}>
            Don't be shy.
          </p>
          <h5 style={{ color: "#FFFFFF", fontSize: "17px", fontWeight: "700", margin: 0 }}>
            Type Hi!
          </h5>
        </div>

        {/* Voice Chat Card */}
        <div
          onClick={openVoiceChat}
          style={{
            flex: 1,
            backgroundColor: "rgba(20, 10, 40, 0.7)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            borderRadius: "20px",
            padding: "24px 12px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(212, 175, 55, 0.15)";
            e.currentTarget.style.border = "1px solid rgba(212, 175, 55, 0.6)";
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(212, 175, 55, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(20, 10, 40, 0.7)";
            e.currentTarget.style.border = "1px solid rgba(212, 175, 55, 0.3)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ fontSize: "42px", color: "#D4AF37", marginBottom: "16px", filter: "drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))" }}>
            <i className="bi bi-mic-fill"></i>
          </div>
          <p style={{ color: "#D6D6D6", fontSize: "13px", margin: "0 0 8px 0" }}>
            Prefer to talk?
          </p>
          <h5 style={{ color: "#FFFFFF", fontSize: "17px", fontWeight: "700", margin: 0 }}>
            Say Hey!
          </h5>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
