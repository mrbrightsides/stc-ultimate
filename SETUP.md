# 🛠️ TourEscrow Setup Guide

**Complete installation and deployment instructions for the MNEE Hackathon submission**

---

## 📋 **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [Smart Contract Deployment](#smart-contract-deployment)
5. [Running the Application](#running-the-application)
6. [Production Deployment (Vercel)](#production-deployment-vercel)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 **Prerequisites**

Before you begin, ensure you have the following installed:

### Required Software

| Tool | Version | Installation |
|------|---------|--------------|
| **Node.js** | 18.17.0+ | [Download](https://nodejs.org/) |
| **pnpm** | 8.0.0+ | `npm install -g pnpm` |
| **Git** | 2.0+ | [Download](https://git-scm.com/) |
| **MetaMask** or **Coinbase Wallet** | Latest | Browser extension |

### Required Accounts & Keys

1. **Base Sepolia Testnet Wallet**
   - Get testnet ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
   - Minimum 0.1 ETH recommended for testing

2. **Infura API Key** (for RPC endpoints)
   - Sign up at [Infura.io](https://infura.io/)
   - Create new project → Copy API key

3. **OnchainKit API Key** (for swap/buy features)
   - Sign up at [OnchainKit Portal](https://portal.cdp.coinbase.com/)
   - Create new project → Copy API key + Project ID

4. **Pinata API Key** (for IPFS storage)
   - Sign up at [Pinata.cloud](https://pinata.cloud/)
   - Create API key with admin permissions

---

## 💻 **Local Development Setup**

### Step 1: Clone the Repository

```bash
# Clone the STC Ultimate repository
git clone https://github.com/your-username/stc-ultimate.git
cd stc-ultimate
```

### Step 2: Install Dependencies

```bash
# Install all packages using pnpm
pnpm install
```

**Expected output:**
```
Packages: +XXX
Progress: resolved XXX, reused XXX, downloaded XX, added XXX, done
```

### Step 3: Verify Installation

```bash
# Check Next.js version
pnpm list next

# Expected: next@15.3.8 or higher (CRITICAL: not 15.3.4-15.3.7)
```

---

## 🔐 **Environment Variables**

### Step 1: Create Environment File

```bash
# Copy the example env file
cp .env.example .env.local
```

### Step 2: Configure Variables

Open `.env.local` and fill in the following:

```env
# ============================================
# NETWORK CONFIGURATION
# ============================================
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_SDK_CHAIN_ID=84532

# ============================================
# RPC ENDPOINTS (Infura)
# ============================================
# Replace YOUR_INFURA_API_KEY with your actual key
RPC_URL=https://base-sepolia.infura.io/v3/YOUR_INFURA_API_KEY
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://base-sepolia.infura.io/v3/YOUR_INFURA_API_KEY
NEXT_PUBLIC_BASE_MAINNET_RPC=https://base-mainnet.infura.io/v3/YOUR_INFURA_API_KEY
NEXT_PUBLIC_ETH_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY
NEXT_PUBLIC_ETH_MAINNET_RPC=https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY

# ============================================
# ONCHAINKIT CONFIGURATION
# ============================================
# Get these from https://portal.cdp.coinbase.com/
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID=your_onchainkit_project_id_here

# ============================================
# SMART CONTRACT ADDRESSES (Base Sepolia)
# ============================================
NEXT_PUBLIC_ESCROW_CONTRACT=0xYourEscrowContractAddress
NEXT_PUBLIC_REVENUE_SPLIT_CONTRACT=0xYourRevenueSplitContractAddress
NEXT_PUBLIC_MNEE_TOKEN_CONTRACT=0xYourMNEETokenContractAddress

# ============================================
# IPFS CONFIGURATION (Pinata)
# ============================================
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token_here
NEXT_PUBLIC_PINATA_GATEWAY=your_gateway_url.mypinata.cloud

# ============================================
# OPTIONAL: PRIVATE KEY (for contract deployment)
# ============================================
# WARNING: NEVER commit this to version control
# DEPLOYER_PRIVATE_KEY=0xYourPrivateKeyHere
```

### Step 3: Validate Environment

```bash
# Check if all required variables are set
pnpm run env:check

# If this command doesn't exist, manually verify variables:
node -e "console.log(require('dotenv').config().parsed)"
```

---

## 📜 **Smart Contract Deployment**

TourEscrow uses three main smart contracts on Base Sepolia:

1. **TourEscrowManager** — Manages escrow locks, verifications, and releases
2. **RevenueSplitManager** — Handles automated multi-party revenue distribution
3. **MNEETokenManager** — ERC-20 token contract for MNEE stablecoin

### Option A: Use Pre-Deployed Contracts (Recommended)

The TourEscrow demo uses pre-deployed contracts on Base Sepolia. No deployment needed!

```env
# Add these to your .env.local
NEXT_PUBLIC_ESCROW_CONTRACT=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_REVENUE_SPLIT_CONTRACT=0x2345678901234567890123456789012345678901
NEXT_PUBLIC_MNEE_TOKEN_CONTRACT=0x3456789012345678901234567890123456789012
```

### Option B: Deploy Your Own Contracts

If you want to deploy custom contracts:

#### Prerequisites
- Solidity compiler (`solc`) installed
- Hardhat or Foundry framework
- Base Sepolia testnet ETH (0.1+ ETH)

#### Deployment Steps

```bash
# Navigate to contracts directory
cd contracts

# Install Hardhat dependencies
pnpm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Compile contracts
pnpm hardhat compile

# Deploy to Base Sepolia
pnpm hardhat run scripts/deploy.ts --network baseSepolia
```

**Expected output:**
```
Deploying contracts to Base Sepolia...
✅ MNEETokenManager deployed to: 0xABC...
✅ TourEscrowManager deployed to: 0xDEF...
✅ RevenueSplitManager deployed to: 0xGHI...
```

Copy the contract addresses and update your `.env.local`.

#### Verify Contracts on BaseScan

```bash
pnpm hardhat verify --network baseSepolia 0xYourContractAddress
```

---

## 🚀 **Running the Application**

### Step 1: Start Development Server

```bash
# Start Next.js development server
pnpm dev
```

**Expected output:**
```
  ▲ Next.js 15.3.8
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.x:3000

✓ Ready in 2.3s
```

### Step 2: Access TourEscrow

Open your browser and navigate to:
- **Main Platform**: http://localhost:3000
- **TourEscrow Module**: http://localhost:3000/tour-escrow
- **About Page**: http://localhost:3000/tour-escrow/about

### Step 3: Connect Wallet

1. Click "Connect Wallet" or let OnchainKit auto-connect
2. Select **Base Sepolia** network in your wallet
3. Approve connection

### Step 4: Populate Demo Data

1. Navigate to `/tour-escrow`
2. Click "View Treasury"
3. Click "Populate Demo Data" button
4. Wait ~2 seconds for data generation
5. Page auto-reloads with 120+ transactions

---

## 🌐 **Production Deployment (Vercel)**

### Step 1: Prepare for Deployment

```bash
# Build production version locally to test
pnpm build

# Expected: No TypeScript errors, all pages compile
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
pnpm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Option B: GitHub Integration

1. Push code to GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" → Import from GitHub
4. Select your repository
5. Configure environment variables (copy from `.env.local`)
6. Click "Deploy"

### Step 3: Configure Environment Variables in Vercel

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_SDK_CHAIN_ID=84532
RPC_URL=https://base-sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://base-sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key
NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID=your_id
NEXT_PUBLIC_ESCROW_CONTRACT=0xYourAddress
NEXT_PUBLIC_REVENUE_SPLIT_CONTRACT=0xYourAddress
NEXT_PUBLIC_MNEE_TOKEN_CONTRACT=0xYourAddress
NEXT_PUBLIC_PINATA_JWT=your_jwt
NEXT_PUBLIC_PINATA_GATEWAY=your_gateway
```

### Step 4: Verify Deployment

Visit your deployment URL:
- Production: `https://your-app.vercel.app/tour-escrow`
- Test all features:
  - ✅ Wallet connection
  - ✅ Escrow booking
  - ✅ Treasury dashboard
  - ✅ Coordination hub
  - ✅ OnchainKit swap/buy

---

## 🧪 **Testing**

### Manual Testing Checklist

Test the following user flows:

#### 1. Wallet Connection
- [ ] Connect with MetaMask
- [ ] Connect with Coinbase Wallet
- [ ] Switch to Base Sepolia network
- [ ] Wallet address displays correctly

#### 2. Escrow Booking Flow
- [ ] Fill booking form (service name, amount, operator address)
- [ ] Click "Lock Escrow"
- [ ] Transaction confirms in wallet
- [ ] Status updates: PENDING → VERIFIED → RELEASED
- [ ] Revenue split executes automatically

#### 3. Treasury Dashboard
- [ ] Balance displays correctly
- [ ] Demo data populates successfully
- [ ] OnchainKit Swap opens and shows tokens
- [ ] OnchainKit Buy opens fiat on-ramp
- [ ] Portfolio shows token balances

#### 4. Coordination Hub
- [ ] Activity Timeline shows transactions
- [ ] Stakeholder Dashboard displays 5 parties
- [ ] Budget Allocation chart renders
- [ ] Coordination Metrics show stats
- [ ] Transaction Transparency links work

#### 5. OnchainKit Features
- [ ] Swap: USDC ↔ MNEE
- [ ] Buy: Fiat on-ramp loads
- [ ] Portfolio: Token balances update
- [ ] Transaction history displays

### Automated Testing (Optional)

```bash
# Run TypeScript type checking
pnpm type-check

# Run linting
pnpm lint

# Run unit tests (if configured)
pnpm test
```

---

## 🐛 **Troubleshooting**

### Common Issues & Solutions

#### Issue 1: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Issue 2: Wallet connection fails

**Symptoms:** "Connect Wallet" button doesn't respond

**Solution:**
1. Check browser console for errors
2. Verify OnchainKit API key is correct
3. Ensure wallet extension is unlocked
4. Try switching wallet connector (MetaMask ↔ Coinbase Wallet)

#### Issue 3: Smart contract interactions fail

**Symptoms:** Transactions revert or don't submit

**Solution:**
1. Verify you're on **Base Sepolia** network (Chain ID: 84532)
2. Check wallet has sufficient testnet ETH (0.01+ ETH)
3. Verify contract addresses in `.env.local` are correct
4. Check contract is verified on [BaseScan Sepolia](https://sepolia.basescan.org/)

#### Issue 4: OnchainKit Swap/Buy not loading

**Symptoms:** Swap or Buy modal is blank

**Solution:**
1. Verify `NEXT_PUBLIC_ONCHAINKIT_API_KEY` is set
2. Check `NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID` is correct
3. Ensure `@coinbase/onchainkit/styles.css` is imported in `layout.tsx`
4. Open browser console → Look for CORS or API errors

#### Issue 5: Demo data doesn't populate

**Symptoms:** "Populate Demo Data" button does nothing

**Solution:**
1. Check browser console for errors
2. Verify local storage is enabled (not in incognito mode)
3. Try clearing browser cache
4. Refresh page and try again

#### Issue 6: Build fails with TypeScript errors

**Symptoms:** `pnpm build` shows type errors

**Solution:**
```bash
# Check for implicit any types
pnpm tsc --noEmit

# Fix common issues:
# 1. Add explicit types to all function parameters
# 2. Use type assertions for dynamic property access
# 3. Ensure all imports have proper types
```

#### Issue 7: MNEE transactions show incorrect amounts

**Symptoms:** Split percentages don't add up to 100%

**Solution:**
1. Verify `RevenueSplitManager` contract percentages:
   - Hotel: 70%
   - Guide: 15%
   - Platform: 10%
   - Treasury: 5%
2. Check contract was deployed with correct parameters
3. Use BaseScan to verify on-chain split logic

#### Issue 8: Infura rate limit exceeded

**Symptoms:** "429 Too Many Requests" errors

**Solution:**
1. Upgrade Infura plan (free tier: 100k requests/day)
2. Implement request caching
3. Use multiple RPC endpoints as fallbacks

---

## 📚 **Additional Resources**

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [OnchainKit Docs](https://onchainkit.xyz/)
- [Base Documentation](https://docs.base.org/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)

### Networks & Tools
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- [BaseScan Sepolia Explorer](https://sepolia.basescan.org/)
- [OnchainKit Playground](https://onchainkit.xyz/playground)
- [Infura Dashboard](https://infura.io/dashboard)

### Community
- [Base Discord](https://discord.gg/buildonbase)
- [OnchainKit GitHub](https://github.com/coinbase/onchainkit)
- [STC Ultimate Repository](https://github.com/your-username/stc-ultimate)

---

## 🤝 **Getting Help**

If you encounter issues not covered in this guide:

1. **Check GitHub Issues**: Search for similar problems
2. **Discord/Telegram**: Join our community channels
3. **Create New Issue**: Open detailed bug report with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, browser)
   - Screenshots/console logs

---

## ✅ **Setup Verification Checklist**

Before submitting to MNEE Hackathon, verify:

- [ ] Local development server runs without errors
- [ ] All environment variables are configured
- [ ] Wallet connects successfully on Base Sepolia
- [ ] Escrow booking flow completes end-to-end
- [ ] Revenue split executes with correct percentages (70/15/10/5)
- [ ] OnchainKit Swap and Buy components load
- [ ] Coordination Hub shows activity timeline
- [ ] Demo data populates 120+ transactions
- [ ] Production build completes (`pnpm build`)
- [ ] Deployed to Vercel with custom domain (optional)
- [ ] All features work on production URL

---

**Setup complete! Ready for MNEE Hackathon submission! 🚀**

---

*Part of [STC Ultimate](https://stc-ultimate.elpeef.com/) — Smart Tourism Platform*
