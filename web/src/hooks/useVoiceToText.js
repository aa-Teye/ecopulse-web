import { useEffect, useRef, useState } from 'react'

// Human-readable text for the Web Speech API's fixed set of error codes
// (SpeechRecognitionErrorEvent.error) — previously these were swallowed
// entirely, so a mic-permission denial or "no speech detected" looked
// identical to the button just doing nothing.
const ERROR_MESSAGES = {
  'not-allowed': 'Microphone access was denied — check your browser\'s site permissions.',
  'service-not-allowed': 'Microphone access was denied — check your browser\'s site permissions.',
  'no-speech': "Didn't catch that — try speaking again.",
  'audio-capture': 'No microphone found on this device.',
  network: 'Network error — check your connection and try again.',
  aborted: null, // user-initiated stop, not a real error
}

// Safety net for a real failure mode: the underlying recognition service can
// hang with no result, error, or end event at all (seen when it can't reach
// its network speech backend) — without this, the button gets stuck on
// "Listening…" forever with zero feedback, which is indistinguishable from
// "voice input doesn't work."
const NO_RESPONSE_TIMEOUT_MS = 10000

// Uses the browser's built-in Web Speech API (Chrome, Edge, Safari) — no
// backend, no API key. Not supported in Firefox, so callers should hide the
// mic button entirely when `supported` is false rather than show a broken one.
export function useVoiceToText({ onResult } = {}) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }
    setSupported(true)

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    const clearNoResponseTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    recognition.onresult = (event) => {
      clearNoResponseTimeout()
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      if (transcript.trim()) {
        setError(null)
        onResult?.(transcript.trim())
      }
    }
    recognition.onerror = (event) => {
      clearNoResponseTimeout()
      setListening(false)
      const message = ERROR_MESSAGES[event.error]
      if (message !== undefined) setError(message)
      else setError('Voice input isn\'t available right now — please try again.')
    }
    recognition.onend = () => {
      clearNoResponseTimeout()
      setListening(false)
    }

    recognitionRef.current = recognition
    return () => {
      clearNoResponseTimeout()
      recognition.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function start() {
    if (!recognitionRef.current || listening) return
    setError(null)
    setListening(true)
    recognitionRef.current.start()
    timeoutRef.current = setTimeout(() => {
      recognitionRef.current?.stop()
      setListening(false)
      setError("Didn't hear anything — check your connection and try again.")
    }, NO_RESPONSE_TIMEOUT_MS)
  }

  function stop() {
    if (!recognitionRef.current) return
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    recognitionRef.current.stop()
    setListening(false)
  }

  return { supported, listening, error, start, stop }
}
