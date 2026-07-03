'use client';

import { ethers } from 'ethers';
import { createNFTMetadata, uploadFileToPinata } from './pinata-service';
import type { Achievement } from './achievement-system';

// ========================================
// NFT ACHIEVEMENT CONTRACT
// Mint NFT achievements with IPFS metadata
// ========================================

// ERC-721 Achievement NFT ABI
export const ACHIEVEMENT_NFT_ABI = [
  // ERC-721 Standard
  {
    "inputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "symbol", "type": "string"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "string", "name": "tokenURI", "type": "string"}
    ],
    "name": "mint",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "index", "type": "uint256"}
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "from", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  }
] as const;

// Contract address (deployed on Sepolia)
// TODO: Deploy actual contract and update this address
export const ACHIEVEMENT_NFT_CONTRACT = '0x0000000000000000000000000000000000000000';

export interface NFTMintParams {
  achievement: Achievement;
  userAddress: string;
  provider: ethers.providers.Web3Provider;
  badgeImage?: File; // Optional custom badge image
}

export interface NFTMintResult {
  tokenId: string;
  txHash: string;
  blockNumber: number;
  metadataCID: string;
  metadataUrl: string;
  openseaUrl: string;
  etherscanUrl: string;
}

/**
 * Generate default badge image SVG for achievement
 */
function generateBadgeSVG(achievement: Achievement): string {
  const categoryColors: Record<Achievement['category'], string> = {
    explorer: '#3b82f6',
    photographer: '#8b5cf6',
    cultural: '#f59e0b',
    social: '#ec4899',
    collector: '#10b981',
  };

  const color = categoryColors[achievement.category];

  return `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color}88;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="400" fill="url(#grad)" rx="20"/>
      
      <!-- Border -->
      <rect width="380" height="380" x="10" y="10" fill="none" stroke="#ffffff" stroke-width="4" rx="15"/>
      
      <!-- Icon -->
      <text x="200" y="180" font-size="120" text-anchor="middle" fill="#ffffff">
        ${achievement.icon}
      </text>
      
      <!-- Name -->
      <text x="200" y="260" font-size="28" font-weight="bold" text-anchor="middle" fill="#ffffff">
        ${achievement.name}
      </text>
      
      <!-- Points -->
      <text x="200" y="310" font-size="20" text-anchor="middle" fill="#ffffff">
        ${achievement.points} Points
      </text>
      
      <!-- Category badge -->
      <rect x="150" y="330" width="100" height="30" fill="#ffffff44" rx="15"/>
      <text x="200" y="351" font-size="16" text-anchor="middle" fill="#ffffff">
        ${achievement.category}
      </text>
    </svg>
  `;
}

/**
 * Upload badge image to IPFS
 */
async function uploadBadgeToIPFS(
  achievement: Achievement,
  customImage?: File
): Promise<{ cid: string; gatewayUrl: string }> {
  if (customImage) {
    // Upload custom image
    const result = await uploadFileToPinata(customImage);
    if (!result.success) {
      throw new Error('Failed to upload custom badge image');
    }
    return {
      cid: result.cid!,
      gatewayUrl: result.gatewayUrl!,
    };
  }

  // Generate and upload default SVG badge
  const svg = generateBadgeSVG(achievement);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const file = new File([blob], `${achievement.id}-badge.svg`, { type: 'image/svg+xml' });

  const result = await uploadFileToPinata(file);
  if (!result.success) {
    throw new Error('Failed to upload badge to IPFS');
  }

  return {
    cid: result.cid!,
    gatewayUrl: result.gatewayUrl!,
  };
}

/**
 * Create NFT metadata with achievement data
 */
async function createAchievementMetadata(
  achievement: Achievement,
  imageCID: string
): Promise<{ cid: string; gatewayUrl: string }> {
  const metadata = await createNFTMetadata({
    name: `STC Achievement: ${achievement.name}`,
    description: achievement.description,
    image: `ipfs://${imageCID}`,
    attributes: [
      { trait_type: 'Category', value: achievement.category },
      { trait_type: 'Points', value: achievement.points },
      { trait_type: 'Achievement ID', value: achievement.id },
      { trait_type: 'Unlocked At', value: new Date().toISOString() },
      { trait_type: 'Platform', value: 'STC Ultimate' },
    ],
  });

  if (!metadata.success) {
    throw new Error('Failed to create NFT metadata');
  }

  return {
    cid: metadata.cid!,
    gatewayUrl: metadata.gatewayUrl!,
  };
}

/**
 * Mint achievement NFT
 */
export async function mintAchievementNFT(
  params: NFTMintParams
): Promise<NFTMintResult> {
  console.log('🎨 Minting achievement NFT:', params.achievement.name);

  // Check if contract is deployed
  if (ACHIEVEMENT_NFT_CONTRACT === '0x0000000000000000000000000000000000000000') {
    throw new Error('Achievement NFT contract not deployed yet. Deploy contract first.');
  }

  try {
    // Step 1: Upload badge image to IPFS
    console.log('📤 Uploading badge image to IPFS...');
    const { cid: imageCID } = await uploadBadgeToIPFS(
      params.achievement,
      params.badgeImage
    );
    console.log('✅ Badge uploaded:', imageCID);

    // Step 2: Create and upload metadata to IPFS
    console.log('📤 Creating NFT metadata...');
    const { cid: metadataCID, gatewayUrl: metadataUrl } = await createAchievementMetadata(
      params.achievement,
      imageCID
    );
    console.log('✅ Metadata uploaded:', metadataCID);

    // Step 3: Mint NFT on-chain
    console.log('⛓️ Minting NFT on blockchain...');
    const signer = params.provider.getSigner();
    const contract = new ethers.Contract(
      ACHIEVEMENT_NFT_CONTRACT,
      ACHIEVEMENT_NFT_ABI,
      signer
    );

    const tokenURI = `ipfs://${metadataCID}`;
    const tx = await contract.mint(params.userAddress, tokenURI, {
      gasLimit: 200000,
    });

    console.log('⏳ Waiting for confirmation...');
    const receipt = await tx.wait();
    console.log('✅ NFT minted!');

    // Extract tokenId from Transfer event
    const transferEvent = receipt.events?.find((e: ethers.Event) => e.event === 'Transfer');
    const tokenId = transferEvent?.args?.tokenId?.toString() || '0';

    const result: NFTMintResult = {
      tokenId,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      metadataCID,
      metadataUrl,
      openseaUrl: `https://testnets.opensea.io/assets/sepolia/${ACHIEVEMENT_NFT_CONTRACT}/${tokenId}`,
      etherscanUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`,
    };

    console.log('🎉 Achievement NFT minted successfully!', result);
    return result;

  } catch (error) {
    console.error('Failed to mint achievement NFT:', error);
    throw error;
  }
}

/**
 * Get user's achievement NFTs
 */
export async function getUserAchievementNFTs(
  userAddress: string,
  provider: ethers.providers.Provider
): Promise<{ tokenId: string; tokenURI: string }[]> {
  if (ACHIEVEMENT_NFT_CONTRACT === '0x0000000000000000000000000000000000000000') {
    return [];
  }

  try {
    const contract = new ethers.Contract(
      ACHIEVEMENT_NFT_CONTRACT,
      ACHIEVEMENT_NFT_ABI,
      provider
    );

    const balance = await contract.balanceOf(userAddress);
    const nfts: { tokenId: string; tokenURI: string }[] = [];

    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
      const tokenURI = await contract.tokenURI(tokenId);
      
      nfts.push({
        tokenId: tokenId.toString(),
        tokenURI,
      });
    }

    return nfts;
  } catch (error) {
    console.error('Failed to fetch user NFTs:', error);
    return [];
  }
}

/**
 * Check if contract is deployed
 */
export async function isContractDeployed(
  provider: ethers.providers.Provider
): Promise<boolean> {
  if (ACHIEVEMENT_NFT_CONTRACT === '0x0000000000000000000000000000000000000000') {
    return false;
  }

  try {
    const code = await provider.getCode(ACHIEVEMENT_NFT_CONTRACT);
    return code !== '0x';
  } catch {
    return false;
  }
}

/**
 * Simulate minting (for testing without deployed contract)
 */
export async function simulateMintAchievementNFT(
  params: NFTMintParams
): Promise<NFTMintResult> {
  console.log('🎨 Simulating achievement NFT mint:', params.achievement.name);

  // Upload to IPFS (real)
  const { cid: imageCID } = await uploadBadgeToIPFS(
    params.achievement,
    params.badgeImage
  );
  const { cid: metadataCID, gatewayUrl: metadataUrl } = await createAchievementMetadata(
    params.achievement,
    imageCID
  );

  // Simulate blockchain transaction
  const mockTokenId = Math.floor(Math.random() * 1000000).toString();
  const mockTxHash = `0x${Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;

  return {
    tokenId: mockTokenId,
    txHash: mockTxHash,
    blockNumber: 0,
    metadataCID,
    metadataUrl,
    openseaUrl: `https://testnets.opensea.io/assets/sepolia/${ACHIEVEMENT_NFT_CONTRACT}/${mockTokenId}`,
    etherscanUrl: `https://sepolia.etherscan.io/tx/${mockTxHash}`,
  };
}
