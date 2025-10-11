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
        return `${reactionTime}ms`
      case "too-early":
        return "Too early! Try again."
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div
        className={`${getBackgroundColor()} rounded-lg p-12 min-h-[300px] flex items-center justify-center cursor-pointer transition-colors duration-200 border-4 border-gray-800 ${
          gameState === "flash" ? "flash-animation" : ""
        }`}
        onClick={handleClick}
        onPointerDown={handleClick}
      >
        <div className="text-center">
          <p className="text-4xl md:text-6xl font-bold text-white">{getMessage()}</p>
          {gameState === "complete" && reactionTime && (
            <div className="mt-4 text-xl text-gray-300">
              {reactionTime < 300 && "🔥 Lightning fast! 5 points"}
              {reactionTime >= 300 && reactionTime < 500 && "⚡ Great! 3 points"}
              {reactionTime >= 500 && "👍 Good! 1 point"}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {(gameState === "idle" || gameState === "too-early") && (
          <button
            onClick={startGame}
            className="bg-electric-green hover:bg-neon-yellow text-deep-black px-8 py-4 rounded-lg text-xl font-bold transition-colors"
          >
            Start Game
          </button>
        )}

        {gameState === "complete" && (
          <button
            onClick={resetGame}
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-colors"
          >
            Play Again
          </button>
        )}
      </div>

      <div className="text-center text-gray-400 text-sm">
        <p>Click or tap the screen as soon as it turns green!</p>
      </div>
    </div>
  )
}
