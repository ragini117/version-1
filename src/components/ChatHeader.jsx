"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  MoreVertical,
  X,
  Download,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  MessageSquare,
  Volume2,
  Globe,
  Check
} from "lucide-react";
import { useChat } from "@/context/ChatContext";

const TRANSLATIONS = {
  titleText: "DecentraAI Assistant",
  subtitleText: "Your Metaverse Guide",
  titleVoice: "Decentrawood AI Voice Assistant",
  subtitleVoice: "Voice Mode Active",
  downloadChat: "Download Chat",
  clearChat: "Clear Conversation",
  switchToVoice: "Switch to Voice Mode",
  switchToText: "Switch to Text Mode",
  clearConfirmTitle: "Clear Conversation?",
  clearConfirmDesc: "Are you sure you want to clear your conversation history? This cannot be undone.",
  cancel: "Cancel",
  clear: "Clear",
  language: "Language",
  langAuto: "Auto Detect",
  langEn: "English",
  langHi: "हिंदी",
  langHinglish: "Hinglish"
};

export const ChatHeader = ({
  mode = "text",
  isExpanded = false,
  toggleExpand,
  onClose,
  onBack,
  onSwitchMode,
  chatHistory = [],
  onClearChat
}) => {
  const { clearChat, language, setLanguage } = useChat();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsLanguageMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDownloadChat = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const exportHeader = `DecentraAI Assistant Chat Export (${mode.toUpperCase()} MODE) - ${dateStr}\n` +
      `==================================================\n\n`;

    const logs = chatHistory.map(msg => {
      const time = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';
      const senderName = msg.sender === 'user' ? 'User' : 'Bot/AI';
      return `[${time}] ${senderName}: ${msg.text}`;
    }).join('\n\n');

    const fileContent = exportHeader + logs;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `decentra-chat-${mode}-${dateStr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
  };

  const handleClearConfirm = () => {
    if (onClearChat) {
      onClearChat();
    } else {
      clearChat();
    }
    setIsConfirmModalOpen(false);
    setIsMenuOpen(false);
  };

  const currentT = TRANSLATIONS;

  return (
    <>
      <div
        style={{
          background: "linear-gradient(135deg, rgba(20, 10, 40, 0.9) 0%, rgba(10, 15, 31, 0.9) 100%)",
          borderBottom: "1px solid rgba(139, 92, 255, 0.2)",
          color: "white",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Back Button */}
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              marginRight: "2px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#8B5CFF"}
            onMouseLeave={(e) => e.currentTarget.style.color = "white"}
          >
            <ArrowLeft size={20} />
          </button>

          {/* Logo */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8B5CFF, #140A28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(139, 92, 255, 0.5)"
            }}
          >
            <i className="bi bi-robot" style={{ fontSize: "20px", color: "#FFF" }}></i>
          </div>

          {/* Titles */}
          <div>
            <h5 style={{ margin: 0, fontSize: mode === "voice" ? "14px" : "15px", fontWeight: "700", color: "#FFFFFF" }}>
              {mode === "voice" ? currentT.titleVoice : currentT.titleText}
            </h5>
            <span
              style={{
                fontSize: "11px",
                color: mode === "voice" ? "#D4AF37" : "#D6D6D6",
                fontWeight: mode === "voice" ? "600" : "400"
              }}
            >
              {mode === "voice" ? currentT.subtitleVoice : currentT.subtitleText}
            </span>
          </div>
        </div>

        {/* Action Controls Cluster */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Expand/Collapse Button */}
          <button
            onClick={toggleExpand}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 255, 0.25)";
              e.currentTarget.style.boxShadow = "0 0 8px rgba(139, 92, 255, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Overflow Menu Button */}
          <div style={{ position: "relative" }} ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: isMenuOpen ? "rgba(139, 92, 255, 0.25)" : "rgba(255, 255, 255, 0.08)",
                boxShadow: isMenuOpen ? "0 0 8px rgba(139, 92, 255, 0.5)" : "none",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isMenuOpen) {
                  e.currentTarget.style.background = "rgba(139, 92, 255, 0.25)";
                  e.currentTarget.style.boxShadow = "0 0 8px rgba(139, 92, 255, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMenuOpen) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              <MoreVertical size={16} />
            </button>

            {/* Dropdown Card */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: "0",
                    width: "210px",
                    backgroundColor: "rgba(10, 15, 31, 0.94)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(139, 92, 255, 0.4)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 35px rgba(0,0,0,0.6), 0 0 15px rgba(139, 92, 255, 0.25)",
                    padding: "6px 0",
                    zIndex: "1010",
                  }}
                >


                  {/* Mode Switch Item */}
                  {onSwitchMode && (
                    <div
                      onClick={() => {
                        onSwitchMode();
                        setIsMenuOpen(false);
                        setIsLanguageMenuOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        color: "white",
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(139, 92, 255, 0.15)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {mode === "text" ? (
                        <>
                          <Volume2 size={14} style={{ color: "#D4AF37" }} />
                          <span>{currentT.switchToVoice}</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare size={14} style={{ color: "#8B5CFF" }} />
                          <span>{currentT.switchToText}</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Language Switch Item */}
                  <div
                    onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      padding: "10px 16px",
                      color: "white",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(139, 92, 255, 0.15)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Globe size={14} style={{ color: "#8B5CFF" }} />
                      <span>{currentT.language}</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isLanguageMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: "hidden", backgroundColor: "rgba(0,0,0,0.2)" }}
                      >
                        {[
                          { id: "auto", label: currentT.langAuto, icon: null },
                          { id: "en", label: currentT.langEn, icon: "🇬🇧" },
                          { id: "hi", label: currentT.langHi, icon: "🇮🇳" },
                          { id: "hinglish", label: currentT.langHinglish, icon: "🇮🇳" }
                        ].map((lang) => (
                          <div
                            key={lang.id}
                            onClick={() => {
                              setLanguage(lang.id);
                              setIsLanguageMenuOpen(false);
                              setIsMenuOpen(false);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 16px 8px 38px",
                              color: language === lang.id ? "#8B5CFF" : "#d6d6d6",
                              fontSize: "12px",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(139, 92, 255, 0.1)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <span style={{ width: "14px", display: "inline-block" }}>
                              {language === lang.id && <Check size={12} />}
                            </span>
                            {lang.icon && <span style={{ marginRight: "4px" }}>{lang.icon}</span>}
                            <span>{lang.label}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Download Chat Item */}
                  <div
                    onClick={handleDownloadChat}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      color: "white",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(139, 92, 255, 0.15)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <Download size={14} style={{ color: "#8B5CFF" }} />
                    <span>{currentT.downloadChat}</span>
                  </div>

                  {/* Clear Conversation Item */}
                  <div
                    onClick={() => {
                      setIsConfirmModalOpen(true);
                      setIsMenuOpen(false);
                      setIsLanguageMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      color: "#FF4D4D",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 77, 77, 0.12)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <Trash2 size={14} />
                    <span>{currentT.clearChat}</span>
                  </div>


                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 77, 77, 0.25)";
              e.currentTarget.style.boxShadow = "0 0 8px rgba(255, 77, 77, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(10, 15, 31, 0.8)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: "2000",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                backgroundColor: "rgba(20, 10, 40, 0.96)",
                border: "1px solid rgba(255, 77, 77, 0.4)",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 77, 77, 0.25)",
                borderRadius: "20px",
                padding: "24px",
                width: "100%",
                maxWidth: "320px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 77, 77, 0.1)",
                  border: "1px solid rgba(255, 77, 77, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  color: "#FF4D4D",
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <h4 style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
                {currentT.clearConfirmTitle}
              </h4>
              <p style={{ color: "#d6d6d6", fontSize: "13px", lineHeight: "1.5", marginBottom: "20px" }}>
                {currentT.clearConfirmDesc}
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    border: "none",
                    color: "white",
                    borderRadius: "12px",
                    padding: "10px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)"}
                >
                  {currentT.cancel}
                </button>
                <button
                  onClick={handleClearConfirm}
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #ff4d4d, #990000)",
                    border: "none",
                    color: "white",
                    borderRadius: "12px",
                    padding: "10px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(255, 77, 77, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 77, 77, 0.6)";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 77, 77, 0.3)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {currentT.clear}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatHeader;
