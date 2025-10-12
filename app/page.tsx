import Link from "next/link"
import Header from "@/components/Header"

export default function Home() {
  return (
    <div className="min-h-screen bg-deep-black">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-electric-green mb-4">QuickReact</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Test your reaction time. Earn points. Compete on the leaderboard.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link
              href="/game"
              className="bg-electric-green text-deep-black px-8 py-6 rounded-lg text-xl font-bold hover:bg-neon-yellow transition-colors glow-animation"
            >
              Play Game
            </Link>
            <Link
              href="/leaderboard"
              className="bg-gray-800 text-white px-8 py-6 rounded-lg text-xl font-bold hover:bg-gray-700 transition-colors border-2 border-electric-green"
            >
              View Leaderboard
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-electric-green text-xl font-bold mb-2">1. Play</h3>
              <p className="text-gray-400">Click as fast as you can when the screen flashes. Test your reflexes!</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-electric-green text-xl font-bold mb-2">2. Sign</h3>
              <p className="text-gray-400">Sign your score with your wallet using EIP-712 signature.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-electric-green text-xl font-bold mb-2">3. Earn</h3>
              <p className="text-gray-400">Claim QRP tokens onchain. Faster reactions = more points!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
