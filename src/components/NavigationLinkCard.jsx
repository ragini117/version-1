"use client";

import React from "react";

/**
 * NavigationLinkCard
 *
 * Renders a structured, styled, clickable card for an external navigation destination.
 * Used by TextChat and TranscriptPanel so the rendering is consistent.
 *
 * Props:
 *   route  — the primary_route object from the navigation payload:
 *            { url, title, label, type, domain }
 *   theme  — "purple" (default, for TextChat) | "gold" (for TranscriptPanel)
 */
export const NavigationLinkCard = ({ route, theme = "purple" }) => {
  if (!route || !route.url) return null;

  // Derive a human-readable label: prefer title, then label, then "Open {domain}"
  const domain = route.domain || (() => {
    try { return new URL(route.url).hostname; } catch { return route.url; }
  })();
  const cardTitle = route.title || route.label || `Open ${domain}`;

  const isPurple = theme !== "gold";
  const accentColor = isPurple ? "#8B5CFF" : "#D4AF37";
  const accentAlpha10 = isPurple ? "rgba(139, 92, 255, 0.10)" : "rgba(212, 175, 55, 0.10)";
  const accentAlpha30 = isPurple ? "rgba(139, 92, 255, 0.30)" : "rgba(212, 175, 55, 0.30)";
  const accentAlpha40 = isPurple ? "rgba(139, 92, 255, 0.40)" : "rgba(212, 175, 55, 0.40)";
  const shadowColor = isPurple ? "rgba(139, 92, 255, 0.25)" : "rgba(212, 175, 55, 0.25)";

  return (
    <div style={{ marginTop: "12px" }}>
      <a
        href={route.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${cardTitle} in a new tab`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "9px 16px",
          backgroundColor: accentAlpha10,
          border: `1px solid ${accentAlpha40}`,
          borderRadius: "12px",
          color: "#FFFFFF",
          textDecoration: "none",
          fontSize: "13px",
          fontWeight: "600",
          letterSpacing: "0.01em",
          transition: "all 0.2s ease",
          maxWidth: "100%",
          overflow: "hidden",
          lineHeight: "1.4",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = accentAlpha30;
          e.currentTarget.style.boxShadow = `0 4px 16px ${shadowColor}`;
          e.currentTarget.style.borderColor = accentColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = accentAlpha10;
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = accentAlpha40;
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = `2px solid ${accentColor}`;
          e.currentTarget.style.outlineOffset = "2px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
        }}
      >
        {/* External link icon */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            borderRadius: "6px",
            backgroundColor: accentAlpha30,
            flexShrink: 0,
            fontSize: "11px",
          }}
          aria-hidden="true"
        >
          ↗
        </span>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {cardTitle}
        </span>
      </a>
    </div>
  );
};

export default NavigationLinkCard;
