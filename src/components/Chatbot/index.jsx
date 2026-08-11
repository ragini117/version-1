"use client";

import React, { useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import WelcomeScreen from "../WelcomeScreen";
import TextChat from "../TextChat";
import VoiceChat from "../VoiceChat";

export const Chatbot = () => {
  const {
    isChatOpen,
    setIsChatOpen
  } = useChat();

  const [chatMode, setChatMode] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("decentrawood_chat_mode") || "text";
    }
    return "text";
  });
  const [isWelcomeOpen, setIsWelcomeOpen] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(typeof window !== "undefined" ? window.innerWidth : 1200);


  const isMobile = windowWidth <= 500;
  const channelRef = React.useRef(null);

  const changeChatMode = (mode) => {
    setChatMode(mode);
    if (typeof window !== "undefined") {
      if (mode) {
        localStorage.setItem("decentrawood_chat_mode", mode);
      } else {
        localStorage.removeItem("decentrawood_chat_mode");
      }
    }
  };

  // Track window resizing for responsive layouts
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync isWelcomeOpen across tabs via BroadcastChannel if needed
  useEffect(() => {
    if (typeof window !== "undefined") {
      channelRef.current = new BroadcastChannel("decentrawood_chat_ui_channel");
      channelRef.current.onmessage = (event) => {
        if (event.data.type === "SYNC_IS_WELCOME_OPEN") {
          setIsWelcomeOpen(event.data.payload);
        }
      };
      return () => {
        channelRef.current?.close();
      };
    }
  }, []);

  const handleSetIsWelcomeOpen = (isOpen) => {
    setIsWelcomeOpen(isOpen);
    channelRef.current?.postMessage({ type: "SYNC_IS_WELCOME_OPEN", payload: isOpen });
  };

  const openTextChat = () => {
    changeChatMode("text");
    setIsChatOpen(true);
    handleSetIsWelcomeOpen(false);
  };

  const openVoiceChat = () => {
    changeChatMode("voice");
    setIsChatOpen(true);
    handleSetIsWelcomeOpen(false);
  };

  const handleClose = () => {
    changeChatMode(null);
    setIsChatOpen(false);
    handleSetIsWelcomeOpen(false);
  };

  const handleBack = () => {
    changeChatMode(null);
    setIsChatOpen(false);
    handleSetIsWelcomeOpen(true);
  };

  return (
    <>
      {/* Chat Button (Robot bubble) */}
      {!isChatOpen && (
        <div
          onClick={() => handleSetIsWelcomeOpen(!isWelcomeOpen)}
          className="d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            bottom: isMobile ? "15px" : "30px",
            right: isMobile ? "15px" : "30px",
            width: "64px",
            height: "64px",
            backgroundColor: "#0A0F1F",
            border: "2px solid rgba(139, 92, 255, 0.6)",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "30px",
            zIndex: "9999",
            boxShadow: "0 0 20px rgba(139, 92, 255, 0.4)",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(139, 92, 255, 0.8)";
            handleSetIsWelcomeOpen(true);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(139, 92, 255, 0.4)";
          }}
        >
          {isWelcomeOpen ? (
            <i className="bi bi-x text-white" style={{ transition: "all 0.3s ease" }}></i>
          ) : (
            <i className="bi bi-robot text-white" style={{ transition: "all 0.3s ease" }}></i>
          )}
        </div>
      )}

      {/* Welcome Popup Screen */}
      {isWelcomeOpen && !isChatOpen && (
        <WelcomeScreen

          isMobile={isMobile}
          onMouseEnter={() => handleSetIsWelcomeOpen(true)}
          onMouseLeave={() => handleSetIsWelcomeOpen(false)}
          openTextChat={openTextChat}
          openVoiceChat={openVoiceChat}
        />
      )}

      {/* Text Chat View */}
      {isChatOpen && chatMode === "text" && (
        <TextChat
          isMobile={isMobile}
          onClose={handleClose}
          onBack={handleBack}
          onSwitchMode={() => changeChatMode("voice")}
        />
      )}

      {/* Voice Chat View */}
      {isChatOpen && chatMode === "voice" && (
        <VoiceChat
          isMobile={isMobile}
          onClose={handleClose}
          onBack={handleBack}
          onSwitchMode={() => changeChatMode("text")}
        />
      )}
    </>
  );
};

export default Chatbot;
