"use client";

import React, { useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useChat } from "@/context/ChatContext";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { VoiceButton } from "./Voice/VoiceButton";
import { SpeechPlayer } from "./Voice/SpeechPlayer";
import ChatHeader from "./ChatHeader";
import useChatWindowSize from "../hooks/useChatWindowSize";
import { NavigationLinkCard } from "./NavigationLinkCard";


export const TextChat = ({
  isMobile,
  onClose,
  onBack,
  onSwitchMode,
}) => {
  const {
    messages,
    isLoading,
    isListening,
    sendMessage,
    hasMoreHistory,
    isLoadingHistory,
    loadMoreHistory,
    clearChat
  } = useChat();

  const { isExpanded, toggleExpand } = useChatWindowSize();
  const [inputValue, setInputValue] = React.useState("");

  const handleSpeechResult = React.useCallback((text) => {
    const newText = inputValue ? `${inputValue} ${text}` : text;
    setInputValue(newText);
    sendMessage(newText);
    setInputValue("");
  }, [inputValue, sendMessage]);

  const {
    isListening: isMicListening,
    startListening,
    stopListening
  } = useSpeechRecognition(handleSpeechResult);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && hasMoreHistory && !isLoadingHistory) {
      const container = e.target;
      const scrollHeightBefore = container.scrollHeight;

      loadMoreHistory().then(() => {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight - scrollHeightBefore;
        }, 100);
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleSendClick = () => {
    sendMessage(inputValue);
    setInputValue("");
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
        boxShadow: "0 10px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 255, 0.15)",
        border: "1px solid rgba(139, 92, 255, 0.3)",
      }}
    >
      <ChatHeader
        mode="text"
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
        onClose={onClose}
        onBack={onBack}
        onSwitchMode={onSwitchMode}
        chatHistory={messages}
      />

      {/* Messages Container */}
      <div
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "column",
          gap: "22px",
        }}
      >
        {isLoadingHistory && (
          <div style={{ textAlign: "center", padding: "10px", color: "#8B5CFF", fontSize: "13px" }}>
            <div style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              border: "2px solid rgba(139, 92, 255, 0.3)",
              borderTopColor: "#8B5CFF",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginRight: "8px"
            }}></div>
            "Loading past messages..."
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
              gap: "4px",
            }}
          >
            {/* Timestamp */}
            <span
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.45)",
                padding: "0 10px",
              }}
            >
              {msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : ""}
            </span>

            {/* Message Bubble */}
            <div
              style={{
                maxWidth: "85%",
                padding: "14px 18px",
                borderRadius:
                  msg.sender === "user"
                    ? "22px 22px 6px 22px"
                    : "22px 22px 22px 6px",
                background:
                  msg.sender === "user"
                    ? "linear-gradient(135deg, #8B5CFF, #6D3DFF)"
                    : "rgba(25, 25, 45, 0.95)",
                border:
                  msg.sender === "user"
                    ? "none"
                    : "1px solid rgba(139, 92, 255, 0.25)",
                color: "#FFFFFF",
                fontSize: "14px",
                lineHeight: "1.7",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                boxShadow:
                  msg.sender === "user"
                    ? "0 6px 20px rgba(139,92,255,0.35)"
                    : "0 4px 12px rgba(0,0,0,0.25)",
                backdropFilter: "blur(12px)",
                position: "relative",
              }}
            >
              {/* Render text, but skip URLs that are already shown in the nav card */}
              {(() => {
                const navUrl = msg.navigation?.primary_route?.url;
                return msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
                  if (/(https?:\/\/[^\s]+)/g.test(part)) {
                    // If this URL matches the navigation card URL, suppress it
                    if (navUrl && part.replace(/\/+$/, '') === navUrl.replace(/\/+$/, '')) {
                      return null;
                    }
                    return (
                      <a key={i} href={part} target="_blank" rel="noopener noreferrer"
                        style={{ color: msg.sender === "user" ? "#FFFFFF" : "#8B5CFF", textDecoration: "underline" }}>
                        {part}
                      </a>
                    );
                  }
                  return part;
                });
              })()}
              {/* Navigation URL card (external routes only) */}
              {msg.navigation?.should_navigate === false && msg.navigation?.primary_route?.url && (
                <NavigationLinkCard
                  route={msg.navigation.primary_route}
                  theme="purple"
                />
              )}
            </div>
            {msg.sender !== "user" && <SpeechPlayer text={msg.text} />}
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", gap: "6px", padding: "10px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#8B5CFF",
                animation: "bounce 1.4s infinite",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#8B5CFF",
                animation: "bounce 1.4s infinite 0.2s",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#8B5CFF",
                animation: "bounce 1.4s infinite 0.4s",
              }}
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          borderTop: "1px solid rgba(139, 92, 255, 0.2)",
          padding: "16px",
          backgroundColor: "rgba(10, 15, 31, 0.95)",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message DecentraAI..."
          style={{
            flex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(139, 92, 255, 0.3)",
            color: "#FFFFFF",
            borderRadius: "24px",
            padding: "12px 18px",
            fontSize: "14px",
            outline: "none",
            fontFamily: "inherit",
            transition: "border 0.3s ease",
          }}
          onFocus={(e) => e.target.style.border = "1px solid rgba(139, 92, 255, 0.8)"}
          onBlur={(e) => e.target.style.border = "1px solid rgba(139, 92, 255, 0.3)"}
        />
        <VoiceButton 
          isListening={isMicListening} 
          onStart={startListening} 
          onStop={stopListening} 
        />
        <button
          onClick={handleSendClick}
          disabled={isLoading || !inputValue.trim()}
          style={{
            background: "linear-gradient(135deg, #8B5CFF, #140A28)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            cursor: inputValue.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            opacity: inputValue.trim() ? 1 : 0.6,
            boxShadow: "0 4px 12px rgba(139, 92, 255, 0.3)",
          }}
        >
          <i className="bi bi-send-fill" style={{ transform: "translate(-2px, 1px)" }}></i>
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.5;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 255, 0.35);
          border-radius: 20px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default TextChat;
