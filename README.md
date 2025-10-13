# QuickReact

A reaction-time game where players earn QRP tokens by signing EIP-712 messages and claiming rewards onchain.
## Features

- 🎮 Reaction time game with randomized delays
- 🔐 EIP-712 signature-based claiming (no backend)
- 🏆 Onchain leaderboard from contract events
- 🎯 Points system: <300ms = 5 QRP, 300-499ms = 3 QRP, ≥500ms = 1 QRP
- 📱 Mobile-first responsive design
- 🖼️ Farcaster Frame integration

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Web3**: wagmi, ethers v6, EIP-712 signing
- **Contracts**: Solidity 0.8.20, OpenZeppelin
- **Deployment**: Vercel (frontend), Base/Base Sepolia (contracts)

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Wizbisy/QuickReact.git
cd QuickReact
npm install
```

### 2. Deploy Smart Contracts

Use [Remix IDE](https://remix.ethereum.org/) to deploy contracts:

#### Step 1: Deploy QuickReactPoint.sol
1. Open `contracts/QuickReactPoint.sol` in Remix
2. Compile with Solidity 0.8.20
3. Deploy to Base Sepolia (or Base mainnet)
4. **Save the deployed token address**

#### Step 2: Deploy ReactionTimeGame.sol
1. Open `contracts/ReactionTimeGame.sol` in Remix
2. Compile with Solidity 0.8.20
3. Deploy with constructor parameter: `_token` = QuickReactPoint address from Step 1
4. **Save the deployed game contract address**

#### Step 3: Configure Contracts
After deployment, call these functions in Remix:

1. **On QuickReactPoint contract:**
   ```solidity
   setMinter(address) // Pass ReactionTimeGame contract address
   ```

2. **On ReactionTimeGame contract:**
   ```solidity
   setDomainSeparator(uint256) // Pass chain ID: 84532 for Base Sepolia, 8453 for Base
   ```

### 3. Update Frontend Configuration

Edit `utils/contract.ts`:

```typescript
export const REACTION_CONTRACT_ADDRESS = '0xYOUR_REACTION_GAME_ADDRESS'
```

### 4. Set Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_RPC=https://sepolia.base.org
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, use:
```bash
NEXT_PUBLIC_RPC=https://mainnet.base.org
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment Checklist

### Smart Contracts (Remix)
- [ ] Deploy QuickReactPoint.sol → Save address
- [ ] Deploy ReactionTimeGame.sol with token address → Save address
- [ ] Call `token.setMinter(reactionGameAddress)`
- [ ] Call `reactionGame.setDomainSeparator(chainId)`
- [ ] Verify contracts on BaseScan (optional)

### Frontend (Vercel)
- [ ] Update `REACTION_CONTRACT_ADDRESS` in `utils/contract.ts`
- [ ] Set `NEXT_PUBLIC_RPC` environment variable
- [ ] Set `NEXT_PUBLIC_BASE_URL` to your domain
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Test wallet connection and game flow

### Farcaster Frame
- [ ] Update `public/.well-known/farcaster.json` with your domain
- [ ] Ensure manifest is accessible at `https://yourdomain.com/.well-known/farcaster.json`
- [ ] Test Frame in Warpcast by sharing your domain URL
- [ ] Verify Frame buttons link to `/game` and `/leaderboard`

## Testing

### Local Testing
1. Connect MetaMask to Base Sepolia
2. Get testnet ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
3. Play game and claim tokens
4. Check leaderboard updates

### Frame Testing
1. Deploy to production
2. Share your domain in Warpcast
3. Verify Frame preview appears
4. Test "Play QuickReact" button opens miniapp

## Troubleshooting

### Common Errors

**"Invalid signature"**
- Ensure `setDomainSeparator(chainId)` was called with correct chain ID
- Verify wallet is connected to same network as deployed contracts
- Check that contract address in frontend matches deployed address

**"Signature expired"**
- Claim within 5 minutes of playing (default `maxSignatureAge`)
- Adjust `maxSignatureAge` in contract if needed

**"Invalid nonce"**
- Each claim increments nonce; can't reuse old signatures
- Refresh page if nonce gets out of sync

**"No ethereum provider found"**
- Ensure MetaMask or compatible wallet is installed
- In Farcaster Frame, wallet must be injected by Warpcast

**Leaderboard not loading**
- Verify `NEXT_PUBLIC_RPC` is set correctly
- Check contract address is correct
- Ensure at least one claim has been made

### Security Notes

- **No backend = no anti-bot protection**: Users can play multiple times
- **Signature TTL**: 5-minute window prevents old score reuse
- **Per-user nonces**: Prevents replay attacks
- **Recommendation**: Add server-side verification for production apps

## Architecture

### EIP-712 Signature Flow
1. User plays game → records reaction time
2. Frontend fetches user's current nonce from contract
3. Build typed data: `{ reactionTime, timestamp, nonce, contractAddress, chainId }`
4. Request `eth_signTypedData_v4` signature from wallet
5. Call `claim(reactionTime, timestamp, nonce, signature)` on contract
6. Contract verifies signature matches `msg.sender` and mints tokens

### Leaderboard
- Reads `Claimed` events from contract using `ethers.Contract.queryFilter`
- Aggregates best (lowest) reaction time per player
- Displays top 20 players sorted by best time

## Contract Addresses

### Base Sepolia (Testnet)
- QuickReactPoint: `[DEPLOY AND ADD HERE]`
- ReactionTimeGame: `[DEPLOY AND ADD HERE]`

### Base Mainnet
- QuickReactPoint: `[DEPLOY AND ADD HERE]`
- ReactionTimeGame: `[DEPLOY AND ADD HERE]`

## License

MIT

## Support

For issues or questions:
- Check troubleshooting section above
- Review contract deployment steps
- Verify environment variables are set correctly
