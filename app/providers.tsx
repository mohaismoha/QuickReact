"use client"

import type React from "react"
import { WagmiProvider, createConfig, http, useNetwork, useSwitchNetwork } from "wagmi"
import { base } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { injected } from "wagmi/connectors"
import { useEffect } from "react"

const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_RPC || "https://mainnet.base.org"),
  },
})

const queryClient = new QueryClient()

function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const requiredChainId = base.id 

  useEffect(() => {
    if (chain && chain.id !== requiredChainId && switchNetwork) {
      switchNetwork(requiredChainId)
    }
  }, [chain, switchNetwork])

  if (!chain || chain.id !== requiredChainId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold">Switching Network…</h2>
        <p className="mt-2">Please approve the request in your wallet.</p>
      </div>
    )
  }

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NetworkGuard>{children}</NetworkGuard>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
