"use client"

import Header from "@/components/Header"
import Leaderboard from "@/components/Leaderboard"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-deep-black">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-electric-green text-center mb-8">Leaderboard</h1>
        <Leaderboard />
      </main>
    </div>
  )
}
