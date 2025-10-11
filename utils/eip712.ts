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
  message: {
    reactionTime: number
    timestamp: number
    nonce: number
    contractAddress: string
    chainId: number
  }
}

export function buildClaimTypedData(
  reactionTime: number,
  timestamp: number,
  nonce: number,
  contractAddress: string,
  chainId: number,
): ClaimTypedData {
  return {
    domain: {
      name: "QuickReact",
      version: "1",
      chainId,
      verifyingContract: contractAddress,
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
    message: {
      reactionTime,
      timestamp,
      nonce,
      contractAddress,
      chainId,
    },
  }
}
