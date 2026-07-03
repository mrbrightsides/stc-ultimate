'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Achievement } from '@/lib/achievement-system';
import { simulateMintAchievementNFT, type NFTMintResult } from '@/lib/nft-achievement-contract';
import { ethers } from 'ethers';

// ========================================
// ACHIEVEMENT NFT MINTER
// UI for minting achievement NFTs
// ========================================

interface AchievementNFTMinterProps {
  achievement: Achievement;
  userAddress: string;
  provider: ethers.providers.Web3Provider | null;
  onMintSuccess?: (result: NFTMintResult) => void;
}

export function AchievementNFTMinter({
  achievement,
  userAddress,
  provider,
  onMintSuccess,
}: AchievementNFTMinterProps) {
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintResult, setMintResult] = useState<NFTMintResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMint = async () => {
    if (!provider) {
      setError('Wallet not connected');
      return;
    }

    setIsMinting(true);
    setError(null);

    try {
      console.log('🎨 Starting NFT mint for achievement:', achievement.name);

      // Use simulation for now (until contract is deployed)
      const result = await simulateMintAchievementNFT({
        achievement,
        userAddress,
        provider,
      });

      setMintResult(result);
      
      if (onMintSuccess) {
        onMintSuccess(result);
      }

      console.log('✅ NFT minted successfully!', result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to mint NFT';
      setError(errorMsg);
      console.error('Failed to mint NFT:', err);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-3xl">{achievement.icon}</span>
          <span>Mint Achievement NFT</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Achievement Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <h3 className="font-bold text-lg text-gray-900">{achievement.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
          
          <div className="flex gap-2 mt-3">
            <Badge>{achievement.category}</Badge>
            <Badge variant="outline">{achievement.points} Points</Badge>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Mint Result */}
        {mintResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <h4 className="font-bold text-green-900">NFT Minted Successfully!</h4>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Token ID:</span>
                <span className="ml-2 font-mono font-medium">#{mintResult.tokenId}</span>
              </div>
              
              <div>
                <span className="text-gray-600">Metadata:</span>
                <a 
                  href={mintResult.metadataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  View on IPFS
                </a>
              </div>
              
              <div>
                <span className="text-gray-600">Transaction:</span>
                <a 
                  href={mintResult.etherscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  View on Etherscan
                </a>
              </div>
              
              <div>
                <span className="text-gray-600">OpenSea:</span>
                <a 
                  href={mintResult.openseaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  View NFT
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Mint Button */}
        {!mintResult && (
          <Button 
            onClick={handleMint}
            disabled={isMinting || !provider}
            className="w-full"
            size="lg"
          >
            {isMinting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Minting NFT...
              </>
            ) : (
              <>🎨 Mint Achievement NFT</>
            )}
          </Button>
        )}

        {/* Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• NFT will be minted on Ethereum Sepolia testnet</p>
          <p>• Badge image stored on IPFS via Pinata</p>
          <p>• Metadata follows ERC-721 standard</p>
          <p>• Viewable on OpenSea and other NFT platforms</p>
        </div>
      </CardContent>
    </Card>
  );
}
