import { getProvider, getReactionGameContract } from "./contract"

export interface ClaimedEvent {
  player: string
  reactionTime: number
  points: number
  nonce: number
}

export async function fetchClaimedEvents(): Promise<ClaimedEvent[]> {
  try {
    const provider = getProvider()
    const contract = getReactionGameContract(provider)

    // Fetch logs for Claimed events
    const filter = contract.filters.Claimed()
    const logs = await contract.queryFilter(filter, 0, "latest")

    const events: ClaimedEvent[] = logs.map((log) => {
      const parsed = contract.interface.parseLog({
        topics: [...log.topics],
        data: log.data,
      })

      return {
        player: parsed?.args.player,
        reactionTime: Number(parsed?.args.reactionTime),
        points: Number(parsed?.args.points),
        nonce: Number(parsed?.args.nonce),
      }
    })

    return events
  } catch (error) {
    console.error("Error fetching events:", error)
    throw new Error("Failed to fetch leaderboard data")
  }
}
