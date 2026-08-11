import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechRecognition = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  // Keep latest onResult without forcing the recognition instance to be recreated
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError('Browser does not support Speech Recognition.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal && onResultRef.current) {
          onResultRef.current(currentTranscript);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          setError('No speech detected — tap the mic and try again.');
        } else if (event.error === 'not-allowed') {
          setError('Microphone permission denied.');
        } else {
          setError(event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognitionInstance(recognition);
    }
    // ✅ Empty dependency array: create instance ONCE, never on re-render
  }, []);

  const startListening = useCallback(() => {
    if (recognitionInstance) {
      setTranscript('');
      setError(null);
      try {
        recognitionInstance.abort();
      } catch (e) {
        // safe to ignore if not active
      }
      setTimeout(() => {
        try {
          recognitionInstance.start();
        } catch (err) {
          setError(err.message);
        }
      }, 250);
    }
  }, [recognitionInstance]);

  const stopListening = useCallback(() => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
  }, [recognitionInstance]);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    error
  };
};