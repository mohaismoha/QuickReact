"use client"

import { useAppKit } from "@reown/appkit/react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"

export function ConnectButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()

  if (isConnected && address) {
    return (
      <Button onClick={() => open()} variant="outline" size="sm">
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    )
  }

  return (
    <Button onClick={() => open()} size="sm">
      Connect Wallet
    </Button>
  )
}
