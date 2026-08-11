"use client";

import React from "react";

const CHIPS = [
  "What is Decentrawood?",
  "How do I buy land?",
  "Tell me about DEOD token",
  "How does the metaverse work?",
  "Contact support",
];

/**
 * SuggestionChips — horizontal scrollable row of suggested queries for VoiceChat.
 * Props:
 *   onChipClick: fn(chipText: string)
 */
export const SuggestionChips = ({ onChipClick }) => {
  return (
    <div
      style={{
        padding: "8px 12px",
        overflowX: "auto",
        display: "flex",
        gap: "8px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        flexShrink: 0,
      }}
    >
      <style>{`
        .suggestion-chip-scroll::-webkit-scrollbar { display: none; }
        .suggestion-chip {
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .suggestion-chip:hover {
          background: rgba(139,92,255,0.3) !important;
          border-color: rgba(139,92,255,0.7) !important;
          transform: translateY(-1px);
          color: #fff !important;
        }
      `}</style>

      {CHIPS.map((chip) => (
        <button
          key={chip}
          className="suggestion-chip"
          onClick={() => onChipClick?.(chip)}
          style={{
            background: "rgba(139,92,255,0.1)",
            border: "1px solid rgba(139,92,255,0.35)",
            borderRadius: "20px",
            color: "rgba(255,255,255,0.75)",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          {chip}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
