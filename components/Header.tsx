"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import Link from "next/link"

export default function Header() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === "injected")
    if (injectedConnector) {
      connect({ connector: injectedConnector })
    }
  }

  return (
    <header className="border-b border-gray-800 bg-deep-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-electric-green">
          QuickReact
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/game" className="text-gray-300 hover:text-electric-green transition-colors">
            Game
          </Link>
          <Link href="/leaderboard" className="text-gray-300 hover:text-electric-green transition-colors">
            Leaderboard
          </Link>

          {isConnected ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={() => disconnect()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="bg-electric-green hover:bg-neon-yellow text-deep-black px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
