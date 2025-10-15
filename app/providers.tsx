"use client"

import type React from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createAppKit } from "@reown/appkit/react"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { base, baseSepolia } from "@reown/appkit/networks"

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || ""

const metadata = {
  name: "QuickReact",
  description: "Test your reaction time and earn points",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://quickreact.app",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
}

const networks = [base, baseSepolia]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
