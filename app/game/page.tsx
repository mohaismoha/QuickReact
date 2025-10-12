"use client"

import { useState, useEffect, useRef } from "react"

type GameState = "idle" | "waiting" | "flash" | "complete" | "too-early"

interface GameBoardProps {
  onComplete: (reactionTime: number) => void
}

export default function GameBoard({ onComplete }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>("idle")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const startGame = () => {
    setGameState("waiting")
    setReactionTime(null)

    // Random delay between 1.5s and 4.5s
    const delay = 1500 + Math.random() * 3000

    timeoutRef.current = setTimeout(() => {
      setGameState("flash")
      startTimeRef.current = Date.now()
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "waiting") {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setGameState("too-early")
      return
    }

    if (gameState === "flash") {
      const endTime = Date.now()
      const reaction = endTime - startTimeRef.current
      setReactionTime(reaction)
      setGameState("complete")
      onComplete(reaction)
    }
  }

  const resetGame = () => {
    setGameState("idle")
    setReactionTime(null)
  }

  const getBackgroundColor = () => {
    switch (gameState) {
      case "flash":
        return "bg-electric-green"
      case "waiting":
        return "bg-red-900"
      case "too-early":
        return "bg-red-600"
      default:
        return "bg-gray-900"
    }
  }

  const getMessage = () => {
    switch (gameState) {
      case "idle":
        return 'Click "Start" to begin'
      case "waiting":
        return "Wait for green..."
      case "flash":
        return "CLICK NOW!"
      case "complete":
        return `Reaction time: ${reactionTime}ms`
      case "too-early":
        return "Too early! Try again."
      default:
        return ""
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center h-96 rounded-2xl transition-colors duration-300 ${getBackgroundColor()}`}
      onClick={handleClick}
    >
      <h2 className="text-white text-2xl font-semibold mb-4">{getMessage()}</h2>

      {gameState === "idle" && (
        <button
          onClick={startGame}
          className="bg-electric-green text-black font-bold py-2 px-6 rounded-full hover:bg-green-400 transition"
        >
          Start
        </button>
      )}

      {(gameState === "complete" || gameState === "too-early") && (
        <button
          onClick={resetGame}
          className="mt-4 bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-300 transition"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
