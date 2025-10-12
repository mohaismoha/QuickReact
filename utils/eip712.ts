// utils/eip712.ts

export interface ClaimTypedData {
  domain: {
    name: string
    version: string
    chainId: number
    verifyingContract: string
  }
  types: {
    Claim: Array<{ name: string; type: string }>
  }
  primaryType: "Claim"
  message: {
    reactionTime: number
    timestamp: number
    nonce: number
    contractAddress: string
    chainId: number
  }
}

/**
 * Build EIP-712 typed data for QuickReact claims.
 * Ensures domain + struct values are consistent with the deployed contract.
 */
export function buildClaimTypedData(
  reactionTime: number,
  timestamp: number,
  nonce: number,
  verifyingContract: string, // must be ReactionTimeGame contract address
  chainId: number,
): ClaimTypedData {
  return {
    domain: {
      name: "QuickReact",
      version: "1",
      chainId,
      verifyingContract,
    },
    types: {
      Claim: [
        { name: "reactionTime", type: "uint256" },
        { name: "timestamp", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "contractAddress", type: "address" },
        { name: "chainId", type: "uint256" },
      ],
    },
    primaryType: "Claim",
    message: {
      reactionTime,
      timestamp,
      nonce,
      contractAddress: verifyingContract, // enforce same as domain.verifyingContract
      chainId,                            // enforce same as domain.chainId
    },
  }
}
