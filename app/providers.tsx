"use client"

import type React from "react"
import { useEffect } from "react"
import { WagmiProvider, createConfig, http, useChainId, useSwitchChain } from "wagmi"
import { base } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { injected } from "wagmi/connectors"


const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_RPC || "https://mainnet.base.org"),
  },
})

const queryClient = new QueryClient()

function AutoSwitchToBase() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    if (chainId && chainId !== base.id) {
      switchChain({ chainId: base.id }).catch(() => {
        console.warn("User rejected or wallet doesn't support chain switching.")
      })
    }
  }, [chainId, switchChain])

  return null
}


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AutoSwitchToBase />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
