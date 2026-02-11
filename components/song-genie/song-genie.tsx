"use client"

import { useCallback, useEffect, useState } from "react"
import { StarField } from "./star-field"
import { GenieCharacter } from "./genie-character"
import { SpeechBubble } from "./speech-bubble"
import { QuestionDisplay } from "./question-display"
import { AnswerButtons } from "./answer-buttons"
import { SmokeParticles } from "./smoke-particles"
import { GENIE_COMMENTS, QUESTIONS } from "./types"
import type { GenieState } from "./types"

function getRandomComment(type: keyof typeof GENIE_COMMENTS): string {
  const comments = GENIE_COMMENTS[type]
  return comments[Math.floor(Math.random() * comments.length)]
}

export function SongGenie() {
  // 🔒 ALL HOOKS MUST BE DECLARED FIRST — NO EXCEPTIONS
  const [mounted, setMounted] = useState(false)

  const [genieState, setGenieState] = useState<GenieState>("idle")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [genieMessage, setGenieMessage] = useState(
    "I am the Song Genie. Think of a song, and I shall divine it..."
  )
  const [isThinking, setIsThinking] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)

  // ✅ Mount guard effect
  useEffect(() => {
    setMounted(true)
  }, [])

  const currentQuestion = QUESTIONS[currentQuestionIndex]

  const handleAnswer = useCallback(
    (answer: "yes" | "no" | "unsure") => {
      setGenieState(answer)

      setTimeout(() => {
        setGenieState("thinking")
        setIsThinking(true)
        setGenieMessage(getRandomComment("thinking"))

        setTimeout(() => {
          setIsThinking(false)
          setGenieState("idle")
          setGenieMessage(getRandomComment(answer))

          if (currentQuestionIndex < QUESTIONS.length - 1) {
            setTimeout(() => {
              setCurrentQuestionIndex((prev) => prev + 1)
            }, 800)
          } else {
            setTimeout(() => {
              setGameFinished(true)
              setGenieMessage(getRandomComment("guess"))
            }, 800)
          }
        }, 1200)
      }, 500)
    },
    [currentQuestionIndex]
  )

  const handleStart = () => {
    setGameStarted(true)
    setGenieMessage(getRandomComment("thinking"))
    setGenieState("thinking")
    setIsThinking(true)

    setTimeout(() => {
      setGenieState("idle")
      setIsThinking(false)
      setGenieMessage("Think of any song... and answer my questions truthfully.")
    }, 1500)
  }

  const handleRestart = () => {
    setGameStarted(false)
    setGameFinished(false)
    setCurrentQuestionIndex(0)
    setGenieState("idle")
    setGenieMessage("I am the Song Genie. Think of a song, and I shall divine it...")
    setIsThinking(false)
  }

  const isDisabled = genieState === "thinking" || genieState !== "idle"

  // ⛔️ EARLY RETURN ONLY AFTER ALL HOOKS
  if (!mounted) {
    return null
  }

  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      <StarField />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(30, 20, 60, 0.8) 0%, transparent 50%)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-lg px-4">
        <header className="text-center mb-2">
          <h1 className="font-serif text-4xl tracking-wider">Song Genie</h1>
          <p className="text-xs tracking-widest uppercase mt-2 opacity-60">
            The Mystical Song Oracle
          </p>
        </header>

        <div className="relative w-full flex flex-col items-center" style={{ minHeight: "280px" }}>
          <SmokeParticles />
          <GenieCharacter state={genieState} />
        </div>

        <SpeechBubble message={genieMessage} isThinking={isThinking} />

        {!gameStarted ? (
          <button onClick={handleStart}>Begin the Divination</button>
        ) : gameFinished ? (
          <button onClick={handleRestart}>Summon Again</button>
        ) : (
          <>
            <QuestionDisplay
              question={currentQuestion.text}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={QUESTIONS.length}
            />
            <AnswerButtons onAnswer={handleAnswer} disabled={isDisabled} />
          </>
        )}
      </div>
    </main>
  )
}
