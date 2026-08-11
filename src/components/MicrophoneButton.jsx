"use client";

import React from "react";
import { motion } from "framer-motion";

export const MicrophoneButton = ({ currentState = "idle", onClick }) => {
  const isIdle = currentState === "idle";
  const isListening = currentState === "listening";
  const isProcessing = currentState === "processing";
  const isSpeaking = currentState === "speaking";

  const getStatusText = () => {
    switch (currentState) {
      case "listening":
        return "Listening...";
      case "processing":
        return "Thinking...";
      case "speaking":
        return "AI is speaking...";
      case "idle":
      default:
        return "Tap mic to start voice chat";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 0",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      {/* Microphone Wrapper */}
      <div style={{ position: "relative", marginBottom: "12px" }}>
        
        {/* Animated outer rings for Listening glow */}
        {isListening && (
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: -15,
              left: -15,
              right: -15,
              bottom: -15,
              borderRadius: "50%",
              border: "2px solid #8B5CFF",
              boxShadow: "0 0 20px rgba(139, 92, 255, 0.4)",
              pointerEvents: "none",
            }}
          />
        )}
        
        {/* Animated outer rings for Speaking glow */}
        {isSpeaking && (
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 0.15, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: -12,
              left: -12,
              right: -12,
              bottom: -12,
              borderRadius: "50%",
              border: "2px solid #D4AF37",
              boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Processing Spinner Ring */}
        {isProcessing && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              top: -8,
              left: -8,
              right: -8,
              bottom: -8,
              borderRadius: "50%",
              border: "4px solid rgba(139, 92, 255, 0.1)",
              borderTopColor: "#8B5CFF",
              borderRightColor: "#D4AF37",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Main Microphone Button */}
        <motion.button
          onClick={onClick}
          animate={{
            scale: isListening ? 1.12 : isIdle ? [1, 1.05, 1] : 1,
            boxShadow: isListening 
              ? "0 0 35px rgba(139, 92, 255, 0.8), 0 0 15px rgba(139, 92, 255, 0.4)"
              : isSpeaking
              ? "0 0 35px rgba(212, 175, 55, 0.7), 0 0 15px rgba(212, 175, 55, 0.3)"
              : "0 0 20px rgba(139, 92, 255, 0.4)",
          }}
          transition={isIdle ? {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          } : { duration: 0.3 }}
          style={{
            width: "76px",
            height: "76px",
            borderRadius: "50%",
            backgroundColor: isIdle ? "#FFFFFF" : isListening ? "#8B5CFF" : isSpeaking ? "#D4AF37" : "#1A1528",
            border: `3px solid ${isListening ? "#8B5CFF" : isSpeaking ? "#D4AF37" : "rgba(139, 92, 255, 0.6)"}`,
            color: isIdle ? "#100A1F" : "#FFFFFF",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            outline: "none",
            zIndex: 10,
            position: "relative",
            transition: "background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease",
          }}
        >
          {isProcessing ? (
            <i className="bi bi-cpu-fill" style={{ color: "#8B5CFF", animation: "pulse 1s infinite" }}></i>
          ) : isSpeaking ? (
            <i className="bi bi-volume-up-fill"></i>
          ) : (
            <i className="bi bi-mic-fill"></i>
          )}
        </motion.button>
      </div>

      {/* Bouncing audio waves under mic when Listening */}
      {isListening && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            height: "18px",
            margin: "6px 0"
          }}
        >
          {[1, 2, 3, 4, 5].map((bar) => (
            <motion.div
              key={bar}
              animate={{
                scaleY: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: bar * 0.1,
                ease: "easeInOut",
              }}
              style={{
                width: "4px",
                height: "100%",
                backgroundColor: "#8B5CFF",
                borderRadius: "2px",
                transformOrigin: "center",
              }}
            />
          ))}
        </div>
      )}

      {/* Waveform under mic when Speaking */}
      {isSpeaking && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            height: "18px",
            margin: "6px 0"
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
            <motion.div
              key={bar}
              animate={{
                scaleY: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: bar * 0.08,
                ease: "easeInOut",
              }}
              style={{
                width: "3px",
                height: "100%",
                backgroundColor: "#D4AF37",
                borderRadius: "1.5px",
                transformOrigin: "center",
              }}
            />
          ))}
        </div>
      )}

      {/* Processing label loader space */}
      {isProcessing && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "18px",
            margin: "6px 0",
            color: "#8B5CFF",
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.5px"
          }}
        >
          Thinking...
        </div>
      )}

      {/* State status text label */}
      <span
        style={{
          marginTop: (isListening || isSpeaking || isProcessing) ? "2px" : "10px",
          fontSize: "13px",
          fontWeight: "600",
          color: isListening ? "#8B5CFF" : isSpeaking ? "#D4AF37" : isProcessing ? "#8B5CFF" : "#E2D9F3",
          textAlign: "center",
          transition: "color 0.3s ease",
        }}
      >
        {getStatusText()}
      </span>
    </div>
  );
};

export default MicrophoneButton;
