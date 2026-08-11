"use client";

import { useState, useEffect } from "react";

// Simple module-level state to persist expanded state across mounts (e.g. text <=> voice swap)
let globalIsExpanded = false;
const listeners = new Set();

const updateListeners = (val) => {
  globalIsExpanded = val;
  listeners.forEach((listener) => listener(val));
  if (typeof window !== "undefined") {
    localStorage.setItem("decentrawood_chat_is_expanded", val ? "true" : "false");
  }
};

// Initialize from localStorage if on client side
if (typeof window !== "undefined") {
  globalIsExpanded = localStorage.getItem("decentrawood_chat_is_expanded") === "true";
}

export const useChatWindowSize = () => {
  const [isExpanded, setIsExpanded] = useState(globalIsExpanded);

  useEffect(() => {
    listeners.add(setIsExpanded);
    return () => {
      listeners.delete(setIsExpanded);
    };
  }, []);

  const toggleExpand = () => {
    updateListeners(!globalIsExpanded);
  };

  return {
    isExpanded,
    toggleExpand,
  };
};

export default useChatWindowSize;
