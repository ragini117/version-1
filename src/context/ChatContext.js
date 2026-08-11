"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ChatContext = createContext();

const WELCOME_MESSAGE = "Hello! 👋 I'm Decentrawood AI Assistant. How can I help you today?";

// Mock bot responses
const MOCK_RESPONSES = [
  "That's a fascinating perspective! In Decentrawood, the possibilities are endless.",
  "I'm currently running in local mock mode, but usually I'd process that request through our backend.",
  "Decentrawood is an innovative AI-powered metaverse platform offering immersive games.",
  "Did you know you can use voice mode to talk to me instead?",
  "You can explore glamorous virtual worlds and cultural experiences right here.",
  "That's a great question! However, since I'm disconnected from the server right now, I can only provide these simulated responses.",
  "I'm happy to help you navigate through the Decentrawood metaverse."
];

export const ChatProvider = ({ children }) => {
  const router = useRouter();


  const [messages, setMessages] = useState([
    {
      id: 1,
      text: WELCOME_MESSAGE,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);



  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("decentrawood_is_chat_open") === "true";
    }
    return false;
  });
  
  const [page, setPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const channelRef = useRef(null);
  const recognitionRef = useRef(null);
  const mockChatHistoryRef = useRef([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      channelRef.current = new BroadcastChannel("decentrawood_chat_channel");
      channelRef.current.onmessage = (event) => {
        if (event.data.type === "SYNC_MESSAGES") {
          const syncedMessages = event.data.payload.map(msg => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
          }));
          setMessages(syncedMessages);
        } else if (event.data.type === "SYNC_IS_CHAT_OPEN") {
          setIsChatOpen(event.data.payload);
          localStorage.setItem("decentrawood_is_chat_open", event.data.payload ? "true" : "false");
        } else if (event.data.type === "SYNC_IS_LOADING") {
          setIsLoading(event.data.payload);
        }
      };

      // Mock fetching initial history
      const initChat = () => {
        setIsLoadingHistory(true);
        setTimeout(() => {
          const storedHistory = localStorage.getItem("decentrawood_mock_history");
          if (storedHistory) {
            try {
              const parsed = JSON.parse(storedHistory);
              const restoredMessages = parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
              setMessages(restoredMessages);
              mockChatHistoryRef.current = restoredMessages;
            } catch (e) {
              console.error("Error parsing local mock history", e);
            }
          }
          setIsLoadingHistory(false);
          setHasMoreHistory(false); // Only 1 page mocked
        }, 500);
      };

      initChat();

      return () => {
        channelRef.current?.close();
      };
    }
  }, []);

  const saveHistoryToLocal = (newMessages) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("decentrawood_mock_history", JSON.stringify(newMessages));
    }
  };

  const handleSetIsChatOpen = useCallback((isOpen) => {
    setIsChatOpen(isOpen);
    if (typeof window !== "undefined") {
      localStorage.setItem("decentrawood_is_chat_open", isOpen ? "true" : "false");
    }
    channelRef.current?.postMessage({ type: "SYNC_IS_CHAT_OPEN", payload: isOpen });
  }, []);

  const handleSetIsLoading = useCallback((loading) => {
    setIsLoading(loading);
    channelRef.current?.postMessage({ type: "SYNC_IS_LOADING", payload: loading });
  }, []);

  const sendMessage = useCallback(async (text, onComplete, options = {}) => {
    const isVoiceInput = options.isVoiceInput === true;
    if (!text.trim()) return;

    // Add user message
    const userMessageId = Date.now();
    const userMessage = {
      id: userMessageId,
      text: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      channelRef.current?.postMessage({ type: "SYNC_MESSAGES", payload: newMessages });
      saveHistoryToLocal(newMessages);
      return newMessages;
    });
    
    handleSetIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      });

      const data = await response.json();
      const botMessageId = Date.now() + 1;
      const botResponseText = data.response || "Sorry, I couldn't understand that.";

      const botMessage = {
        id: botMessageId,
        text: botResponseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, botMessage];
        channelRef.current?.postMessage({ type: "SYNC_MESSAGES", payload: newMessages });
        saveHistoryToLocal(newMessages);
        return newMessages;
      });

      if (onComplete) {
        onComplete(botResponseText);
      }

      if (data.navigation?.type === "internal" && data.navigation?.route) {
        let navUrl = data.navigation.route;
        if (navUrl.startsWith("/")) {
          router.push(navUrl);
        } else if (navUrl.includes("localhost:3000") || navUrl.includes("decentrawood.com")) {
          try {
            const urlObj = new URL(navUrl);
            router.push(urlObj.pathname + urlObj.search);
          } catch (e) {
            router.push(navUrl);
          }
        }
      }
    } catch (error) {
      console.error("Error communicating with chatbot API:", error);
      
      const botMessageId = Date.now() + 1;
      const botMessage = {
        id: botMessageId,
        text: "Error connecting to the server.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, botMessage];
        channelRef.current?.postMessage({ type: "SYNC_MESSAGES", payload: newMessages });
        saveHistoryToLocal(newMessages);
        return newMessages;
      });
      
      if (onComplete) {
        onComplete("Error connecting to the server.");
      }
    } finally {
      handleSetIsLoading(false);
    }
  }, [handleSetIsLoading]);

  // Mock voice input via MediaRecorder but without calling a backend endpoint
  const startVoiceInput = useCallback((onTranscript) => {
    if (recognitionRef.current && recognitionRef.current.recorder) {
      recognitionRef.current.recorder.stop();
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mimeType = MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";
        const recorder = new MediaRecorder(stream, { mimeType });
        let stopped = false;

        recorder.onstart = () => {
          setIsListening(true);
          // Auto-stop simulation after 3.5 seconds
          setTimeout(() => {
            if (!stopped && recorder.state === "recording") {
              stopped = true;
              recorder.stop();
            }
          }, 3500);
        };

        recorder.onstop = () => {
          setIsListening(false);
          stream.getTracks().forEach((track) => track.stop());
          recognitionRef.current = null;

          // Provide a simulated transcription
          setTimeout(() => {
             if (onTranscript) {
               onTranscript("This is a simulated mock voice transcription.");
             }
          }, 500);
        };

        recorder.onerror = () => {
          setIsListening(false);
          recognitionRef.current = null;
        };

        recorder.start();
        recognitionRef.current = { recorder };
      })
      .catch((err) => {
        console.error("Microphone access denied or unavailable:", err);
        alert("Microphone access is required for voice input.");
      });
  }, []);

  const loadMoreHistory = useCallback(async () => {
    // In mock mode, we don't have pagination, so just return
    return;
  }, []);

  const clearChat = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("decentrawood_mock_history");
    }
    const newHistory = [
      {
        id: 1,
        text: WELCOME_MESSAGE,
        sender: "bot",
        timestamp: new Date(),
      },
    ];
    setMessages(newHistory);
    setPage(1);
    setHasMoreHistory(false);
    channelRef.current?.postMessage({ type: "SYNC_MESSAGES", payload: newHistory });
  }, []);

  const value = {
    messages,
    isLoading,
    isListening,
    isChatOpen,
    setIsChatOpen: handleSetIsChatOpen,
    sendMessage,
    startVoiceInput,
    clearChat,
    hasMoreHistory,
    isLoadingHistory,
    loadMoreHistory,

  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
