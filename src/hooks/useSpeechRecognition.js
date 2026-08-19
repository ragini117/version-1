import { useState, useEffect, useCallback, useRef } from 'react';

const DEFAULT_SILENCE_MS = 2000;

/**
 * Browser STT hook using the Web Speech API.
 *
 * @param {Function} onResult - Called once with the finalized transcript.
 * @param {Object} options
 * @param {boolean} options.continuous - Keep the mic open across pauses (recommended for voice mode).
 * @param {number} options.silenceTimeoutMs - Submit after this much silence following speech.
 * @param {string} options.lang - BCP-47 language tag.
 * @param {boolean} options.submitOnSpeechFinal - If true, submit immediately when the browser marks a segment final (text dictation mode).
 */
export const useSpeechRecognition = (onResult, options = {}) => {
  const {
    continuous = true,
    silenceTimeoutMs = DEFAULT_SILENCE_MS,
    lang = 'en-US',
    submitOnSpeechFinal = false,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  const onResultRef = useRef(onResult);
  const shouldKeepListeningRef = useRef(false);
  const accumulatedRef = useRef('');
  const silenceTimerRef = useRef(null);
  const restartTimerRef = useRef(null);
  const restartAttemptsRef = useRef(0);
  const submittedRef = useRef(false);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const submitTranscript = useCallback((text) => {
    const cleaned = (text || '').trim();
    if (!cleaned || submittedRef.current || !onResultRef.current) {
      return;
    }

    submittedRef.current = true;
    shouldKeepListeningRef.current = false;
    clearSilenceTimer();
    onResultRef.current(cleaned);
  }, [clearSilenceTimer]);

  const scheduleSilenceSubmit = useCallback((text) => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      submitTranscript(text);
    }, silenceTimeoutMs);
  }, [clearSilenceTimer, silenceTimeoutMs, submitTranscript]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Browser does not support Speech Recognition.');
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = lang;

    const scheduleRecognitionRestart = () => {
      if (!shouldKeepListeningRef.current || submittedRef.current) {
        return;
      }

      const maxRestartAttempts = 4;
      if (restartAttemptsRef.current >= maxRestartAttempts) {
        shouldKeepListeningRef.current = false;
        setIsListening(false);
        setError('Voice capture stopped unexpectedly. Please tap the mic to continue.');
        return;
      }

      clearRestartTimer();
      restartAttemptsRef.current += 1;
      const retryDelayMs = Math.min(150 * restartAttemptsRef.current, 500);

      restartTimerRef.current = setTimeout(() => {
        restartTimerRef.current = null;
        if (!shouldKeepListeningRef.current || submittedRef.current) {
          return;
        }
        try {
          recognition.start();
        } catch (_err) {
          scheduleRecognitionRestart();
        }
      }, retryDelayMs);
    };

    recognition.onstart = () => {
      submittedRef.current = false;
      shouldKeepListeningRef.current = true;
      restartAttemptsRef.current = 0;
      clearRestartTimer();
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interimText = '';
      let finalChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalChunk += piece;
        } else {
          interimText += piece;
        }
      }

      if (finalChunk) {
        accumulatedRef.current += finalChunk;
      }

      const displayText = `${accumulatedRef.current}${interimText}`.trim();
      setTranscript(displayText);

      if (submitOnSpeechFinal && finalChunk.trim()) {
        submitTranscript(displayText);
        return;
      }

      if (displayText) {
        scheduleSilenceSubmit(displayText);
      }
    };

    recognition.onerror = (event) => {
      const recoverableError = event.error === 'no-speech' || event.error === 'audio-capture' || event.error === 'network';

      if (event.error === 'no-speech') {
        setError('No speech detected — tap the mic and try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied.');
      } else if (event.error !== 'aborted') {
        setError(event.error);
      }

      if (!recoverableError && event.error !== 'aborted') {
        shouldKeepListeningRef.current = false;
        clearSilenceTimer();
        clearRestartTimer();
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (shouldKeepListeningRef.current && !submittedRef.current) {
        scheduleRecognitionRestart();
        return;
      }

      clearSilenceTimer();
      clearRestartTimer();
      setIsListening(false);
    };

    setRecognitionInstance(recognition);

    return () => {
      shouldKeepListeningRef.current = false;
      clearSilenceTimer();
      clearRestartTimer();
      try {
        recognition.abort();
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, [clearRestartTimer, clearSilenceTimer, continuous, lang, scheduleSilenceSubmit, submitOnSpeechFinal, submitTranscript]);

  const startListening = useCallback(() => {
    if (!recognitionInstance) {
      return;
    }

    accumulatedRef.current = '';
    submittedRef.current = false;
    shouldKeepListeningRef.current = true;
    restartAttemptsRef.current = 0;
    setTranscript('');
    setError(null);
    clearSilenceTimer();
    clearRestartTimer();

    try {
      recognitionInstance.abort();
    } catch (e) {
      // safe to ignore if not active
    }

    setTimeout(() => {
      try {
        recognitionInstance.start();
      } catch (err) {
        shouldKeepListeningRef.current = false;
        setError(err.message);
      }
    }, 250);
  }, [recognitionInstance, clearRestartTimer, clearSilenceTimer]);

  const stopListening = useCallback(() => {
    shouldKeepListeningRef.current = false;
    submittedRef.current = true;
    clearSilenceTimer();
    clearRestartTimer();

    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {
        // ignore stop errors
      }
    }
  }, [recognitionInstance, clearRestartTimer, clearSilenceTimer]);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    error,
  };
};
