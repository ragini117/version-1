"use client";

import React, { useEffect, useRef } from "react";
import { NavigationLinkCard } from "./NavigationLinkCard";
import { FormattedMessageText } from "./FormattedMessageText";



export const TranscriptPanel = ({ transcript }) => {
  const panelEndRef = useRef(null);

  useEffect(() => {
    panelEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minHeight: "120px",
        backgroundColor: "rgba(20, 10, 40, 0.4)",
        borderRadius: "16px",
        border: "1px solid rgba(139, 92, 255, 0.15)",
        margin: "0 20px 16px 20px",
        boxSizing: "border-box"
      }}
    >
      {transcript.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.4)",
            padding: "20px 0",
            margin: "auto"
          }}
        >
          <h6
            style={{
              color: "#8B5CFF",
              fontSize: "14px",
              fontWeight: "700",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              filter: "drop-shadow(0 0 6px rgba(139, 92, 255, 0.4))"
            }}
          >
            Live Transcript
          </h6>
          <p style={{ fontSize: "12px", margin: 0, color: "#A8A2B5" }}>
            Your conversation will appear here in real time...
          </p>
        </div>
      ) : (
        transcript.map((msg, index) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id || index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isUser ? "flex-end" : "flex-start",
                width: "100%",
                boxSizing: "border-box"
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: isUser ? "#8B5CFF" : "#D4AF37",
                  marginBottom: "3px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: isUser ? "0 8px 0 0" : "0 0 0 8px"
                }}
              >
                {isUser ? "You" : "AI"}
              </div>
              <div
                style={{
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                  background: isUser
                    ? "linear-gradient(135deg, rgba(139, 92, 255, 0.25), rgba(109, 61, 255, 0.25))"
                    : "rgba(25, 25, 45, 0.75)",
                  border: isUser
                    ? "1px solid rgba(139, 92, 255, 0.4)"
                    : "1px solid rgba(212, 175, 55, 0.3)",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  boxShadow: isUser
                    ? "0 4px 12px rgba(139, 92, 255, 0.15)"
                    : "0 4px 12px rgba(0, 0, 0, 0.2)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)"
                }}
              >
                {msg.text ? (
                  <FormattedMessageText
                    text={msg.text}
                    navUrl={msg.navigation?.primary_route?.url}
                    isUser={isUser}
                  />
                ) : (
                  <div style={{ display: "flex", gap: "4px", padding: "6px 0", alignItems: "center" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#D4AF37", animation: "bounce 1.4s infinite" }}></span>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#D4AF37", animation: "bounce 1.4s infinite 0.2s" }}></span>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#D4AF37", animation: "bounce 1.4s infinite 0.4s" }}></span>
                  </div>
                )}

                {msg.navigation?.should_navigate === false && msg.navigation?.primary_route?.url && (
                  <NavigationLinkCard
                    route={msg.navigation.primary_route}
                    theme="gold"
                  />
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={panelEndRef} />
    </div>
  );
};

export default TranscriptPanel;
