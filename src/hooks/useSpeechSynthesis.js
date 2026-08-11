import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        setIsSupported(true);
      }
    }
  }, []);

  const speak = useCallback((text) => {
    if (!isSupported || !text) return;

    // Stop anything currently speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: You can configure voice, pitch, rate here
    // utterance.rate = 1.0;
    // utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isSupported
  };
};
