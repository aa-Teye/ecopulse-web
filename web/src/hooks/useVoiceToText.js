import { useEffect, useRef, useState } from 'react'

// Uses the browser's built-in Web Speech API (Chrome, Edge, Safari) — no
// backend, no API key. Not supported in Firefox, so callers should hide the
// mic button entirely when `supported` is false rather than show a broken one.
export function useVoiceToText({ onResult } = {}) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef(null)

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

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      if (transcript.trim()) onResult?.(transcript.trim())
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    return () => recognition.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function start() {
    if (!recognitionRef.current || listening) return
    setListening(true)
    recognitionRef.current.start()
  }

  function stop() {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setListening(false)
  }

  return { supported, listening, start, stop }
}
