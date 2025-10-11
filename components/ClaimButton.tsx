"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { ethers } from "ethers"
import { getReactionGameContract } from "@/utils/contract"
import { buildClaimTypedData } from "@/utils/eip712"

interface ClaimButtonProps {
  reactionTime: number
  onSuccess: () => void
  onError: (error: string) => void
}

export default function ClaimButton({ reactionTime, onSuccess, onError }: ClaimButtonProps) {
  const { address, isConnected } = useAccount()
  const [isClaiming, setIsClaiming] = useState(false)

  const handleClaim = async () => {
    if (!isConnected || !address) {
      onError("Please connect your wallet first")
      return
    }

    setIsClaiming(true)

    try {
      // Get provider from window.ethereum
      if (!window.ethereum) {
        throw new Error("No ethereum provider found")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = getReactionGameContract(signer)

      // Fetch current nonce for the user
      const nonce = await contract.nonces(address)
      const timestamp = Math.floor(Date.now() / 1000)
      const chainId = (await provider.getNetwork()).chainId

      // Build EIP-712 typed data
      const typedData = buildClaimTypedData(
        reactionTime,
        timestamp,
        Number(nonce),
        await contract.getAddress(),
        Number(chainId),
      )

      // Request signature using eth_signTypedData_v4
      const signature = await signer.signTypedData(
        typedData.domain,
        { Claim: typedData.types.Claim },
        typedData.message,
      )

      // Call claim function on contract
      const tx = await contract.claim(reactionTime, timestamp, nonce, signature)

      onError("Transaction pending...")
      await tx.wait()

      onSuccess()
    } catch (error: any) {
      console.error("Claim error:", error)
      onError(error.message || "Failed to claim tokens")
    } finally {
      setIsClaiming(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center">
        <p className="text-gray-400 mb-4">Connect your wallet to claim tokens</p>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      <div className="bg-gray-900 p-6 rounded-lg border border-electric-green">
        <h3 className="text-xl font-bold text-electric-green mb-2">Ready to Claim!</h3>
        <p className="text-gray-300 mb-4">
          Reaction Time: <span className="font-bold text-neon-yellow">{reactionTime}ms</span>
        </p>
        <p className="text-sm text-gray-400 mb-4">
          You'll earn{" "}
          <span className="font-bold text-electric-green">
            {reactionTime < 300 ? "5" : reactionTime < 500 ? "3" : "1"} QRP
          </span>{" "}
          tokens
        </p>
      </div>

      <button
        onClick={handleClaim}
        disabled={isClaiming}
        className="bg-electric-green hover:bg-neon-yellow disabled:bg-gray-600 disabled:cursor-not-allowed text-deep-black px-8 py-4 rounded-lg text-xl font-bold transition-colors w-full"
      >
        {isClaiming ? "Claiming..." : "Claim Tokens"}
      </button>

      <p className="text-xs text-gray-500">You'll be asked to sign a message and approve a transaction</p>
    </div>
  )
}
