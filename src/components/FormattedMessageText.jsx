"use client";

import React from "react";

export const FormattedMessageText = ({ text, navUrl, isUser }) => {
  if (!text) return null;

  // Helper to render inline formatting (bold & links with suppression)
  const renderInline = (str) => {
    if (!str) return null;
    const parts = str.split(/(https?:\/\/[^\s]+)/g);
    return parts.map((part, i) => {
      if (/^https?:\/\/[^\s]+$/.test(part)) {
        if (navUrl && part.replace(/\/+$/, "") === navUrl.replace(/\/+$/, "")) {
          return null;
        }
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: isUser ? "#FFFFFF" : "#8B5CFF",
              textDecoration: "underline",
              wordBreak: "break-all",
            }}
          >
            {part}
          </a>
        );
      }
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bPart, j) => {
        if (bPart.startsWith("**") && bPart.endsWith("**")) {
          return <strong key={j}>{bPart.slice(2, -2)}</strong>;
        }
        return bPart;
      });
    });
  };

  const lines = text.split("\n");
  const blocks = [];
  let currentTable = null;

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Table row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (!currentTable) {
        currentTable = [];
      }
      if (!/^\|[\s\-:|]+\|$/.test(trimmed)) {
        const cells = trimmed
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        currentTable.push(cells);
      }
      return;
    } else if (currentTable) {
      blocks.push({ type: "table", rows: currentTable });
      currentTable = null;
    }

    // Headings
    if (/^#{1,4}\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^#{1,4}\s+/, "");
      blocks.push({ type: "heading", text: headingText });
      return;
    }

    // Bullet list
    if (/^[\-\*]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[\-\*]\s+/, "");
      blocks.push({ type: "bullet", text: itemText });
      return;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (match) {
        blocks.push({ type: "numbered", num: match[1], text: match[2] });
        return;
      }
    }

    if (trimmed === "") {
      blocks.push({ type: "space" });
    } else {
      blocks.push({ type: "paragraph", text: line });
    }
  });

  if (currentTable) {
    blocks.push({ type: "table", rows: currentTable });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          return (
            <div
              key={idx}
              style={{
                fontWeight: "700",
                fontSize: "15px",
                marginTop: "6px",
                marginBottom: "2px",
                color: isUser ? "#FFFFFF" : "#E2D9FF",
              }}
            >
              {renderInline(block.text)}
            </div>
          );
        }

        if (block.type === "bullet") {
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "8px",
                paddingLeft: "4px",
                lineHeight: "1.6",
              }}
            >
              <span style={{ color: isUser ? "#FFFFFF" : "#8B5CFF", fontWeight: "bold" }}>•</span>
              <div style={{ flex: 1 }}>{renderInline(block.text)}</div>
            </div>
          );
        }

        if (block.type === "numbered") {
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "8px",
                paddingLeft: "4px",
                lineHeight: "1.6",
              }}
            >
              <span style={{ color: isUser ? "#FFFFFF" : "#8B5CFF", fontWeight: "bold", minWidth: "18px" }}>
                {block.num}.
              </span>
              <div style={{ flex: 1 }}>{renderInline(block.text)}</div>
            </div>
          );
        }

        if (block.type === "table") {
          if (block.rows.length === 0) return null;
          const [header, ...bodyRows] = block.rows;
          return (
            <div
              key={idx}
              style={{
                overflowX: "auto",
                margin: "8px 0",
                borderRadius: "8px",
                border: "1px solid rgba(139, 92, 255, 0.25)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                  textAlign: "left",
                }}
              >
                {header && (
                  <thead>
                    <tr style={{ background: "rgba(139, 92, 255, 0.2)" }}>
                      {header.map((cell, cIdx) => (
                        <th
                          key={cIdx}
                          style={{
                            padding: "8px 12px",
                            borderBottom: "1px solid rgba(139, 92, 255, 0.3)",
                            fontWeight: "600",
                          }}
                        >
                          {renderInline(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {bodyRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      style={{
                        background: rIdx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.03)",
                      }}
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          style={{
                            padding: "6px 12px",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                          }}
                        >
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "space") {
          return <div key={idx} style={{ height: "4px" }} />;
        }

        return <div key={idx}>{renderInline(block.text)}</div>;
      })}
    </div>
  );
};

export default FormattedMessageText;
