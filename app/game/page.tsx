"use client"

import { useState, useEffect } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import Header from "@/components/Header"
import GameBoard from "@/components/GameBoard"
import ClaimButton from "@/components/ClaimButton"
import Toast from "@/components/Toast"

export default function GamePage() {
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

  useEffect(() => {
    sdk.actions.ready()
  }, [])

  const handleGameComplete = (time: number) => {
    setReactionTime(time)
    setToast({ message: `Reaction time: ${time}ms!`, type: "success" })
  }

  const handleClaimSuccess = () => {
    setToast({ message: "Claim successful! Check your wallet.", type: "success" })
    setReactionTime(null)
  }

  const handleClaimError = (error: string) => {
    setToast({ message: error, type: "error" })
  }

  return (
    <div className="min-h-screen bg-deep-black">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-electric-green text-center mb-8">
          Reaction Time Game
        </h1>

        <GameBoard onComplete={handleGameComplete} />

        {reactionTime !== null && (
          <div className="mt-8">
            <ClaimButton
              reactionTime={reactionTime}
              onSuccess={handleClaimSuccess}
              onError={handleClaimError}
            />
          </div>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
