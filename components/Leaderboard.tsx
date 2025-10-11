"use client"

import { useState, useEffect } from "react"
import { fetchClaimedEvents } from "@/utils/fetchEvents"

interface LeaderboardEntry {
  player: string
  bestTime: number
  totalPoints: number
  claimCount: number
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadLeaderboard = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const events = await fetchClaimedEvents()

      // Aggregate data by player
      const playerMap = new Map<string, LeaderboardEntry>()

      for (const event of events) {
        const player = event.player
        const existing = playerMap.get(player)

        if (!existing) {
          playerMap.set(player, {
            player,
            bestTime: event.reactionTime,
            totalPoints: event.points,
            claimCount: 1,
          })
        } else {
          existing.bestTime = Math.min(existing.bestTime, event.reactionTime)
          existing.totalPoints += event.points
          existing.claimCount += 1
        }
      }

      // Sort by best time (lowest first)
      const sorted = Array.from(playerMap.values())
        .sort((a, b) => a.bestTime - b.bestTime)
        .slice(0, 20)

      setEntries(sorted)
    } catch (err: any) {
      console.error("Leaderboard error:", err)
      setError(err.message || "Failed to load leaderboard")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLeaderboard()
  }, [])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-electric-green border-t-transparent"></div>
        <p className="text-gray-400 mt-4">Loading leaderboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={loadLeaderboard}
          className="bg-electric-green text-deep-black px-6 py-2 rounded-lg font-bold hover:bg-neon-yellow transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">No entries yet. Be the first to play!</p>
        <button
          onClick={loadLeaderboard}
          className="bg-electric-green text-deep-black px-6 py-2 rounded-lg font-bold hover:bg-neon-yellow transition-colors"
        >
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={loadLeaderboard}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-electric-green font-bold">Rank</th>
              <th className="px-4 py-3 text-left text-electric-green font-bold">Player</th>
              <th className="px-4 py-3 text-right text-electric-green font-bold">Best Time</th>
              <th className="px-4 py-3 text-right text-electric-green font-bold">Total Points</th>
              <th className="px-4 py-3 text-right text-electric-green font-bold">Games</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.player} className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3 font-bold text-neon-yellow">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && `#${index + 1}`}
                </td>
                <td className="px-4 py-3 font-mono text-sm">
                  {entry.player.slice(0, 6)}...{entry.player.slice(-4)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-electric-green">{entry.bestTime}ms</td>
                <td className="px-4 py-3 text-right">{entry.totalPoints} QRP</td>
                <td className="px-4 py-3 text-right text-gray-400">{entry.claimCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
