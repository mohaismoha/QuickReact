"use client"

import Link from "next/link"
import { ConnectButton } from "@/components/connect-button"

export default function Header() {
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

          <ConnectButton />
        </nav>
      </div>
    </header>
  )
}
