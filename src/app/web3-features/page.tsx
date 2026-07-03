'use client';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RealtimeEventMonitor } from '@/components/web3/realtime-event-monitor';
import { GasOptimizerWidget } from '@/components/web3/gas-optimizer-widget';
import { AchievementNFTMinter } from '@/components/web3/achievement-nft-minter';
import { useGasOptimizer } from '@/hooks/use-gas-optimizer';
import { ALL_ACHIEVEMENTS } from '@/lib/achievement-system';

// ========================================
// WEB3 FEATURES DEMO PAGE
// Showcase all advanced Web3 features
// ========================================

export default function Web3FeaturesPage() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Sample transaction for gas optimizer
  const sampleTransaction: ethers.providers.TransactionRequest = {
    to: '0x742c44a19cb28ade92bfb8f1c50a5143f5ee9eaf',
    value: ethers.utils.parseEther('0.01'),
  };

  const gasOptimizer = useGasOptimizer({
    transaction: sampleTransaction,
    provider,
    autoEstimate: false,
  });

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await web3Provider.send('eth_requestAccounts', []);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      setProvider(web3Provider);
      setUserAddress(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Sample achievement for NFT minting
  const sampleAchievement = ALL_ACHIEVEMENTS[0] || {
    id: 'first-visit',
    name: 'First Steps',
    description: 'Visit your first 360° panorama',
    icon: '🎯',
    category: 'explorer' as const,
    points: 10,
    unlocked: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚀 Advanced Web3 Features
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real-time blockchain monitoring, gas optimization, and NFT achievements for STC Ultimate
          </p>

          {/* Wallet Connection */}
          <div className="flex flex-col items-center gap-3">
            {!provider ? (
              <Button 
                onClick={connectWallet}
                disabled={isConnecting}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isConnecting ? 'Connecting...' : '🔌 Connect Wallet'}
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Badge className="bg-green-600 text-lg px-4 py-2">
                  ✅ Connected: {userAddress.substring(0, 6)}...{userAddress.substring(38)}
                </Badge>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setProvider(null);
                    setUserAddress('');
                  }}
                >
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">📡</span>
                <span>Real-time Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                WebSocket provider monitors blockchain events in real-time with instant IoT trigger notifications
              </p>
              <div className="mt-4 space-y-2">
                <Badge variant="outline">✅ WebSocket Listener</Badge>
                <Badge variant="outline">✅ Event Decoder</Badge>
                <Badge variant="outline">✅ IoT Actions</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">⛽</span>
                <span>Gas Optimizer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Dynamic gas estimation with EIP-1559 support and multiple speed options for optimal transactions
              </p>
              <div className="mt-4 space-y-2">
                <Badge variant="outline">✅ EIP-1559</Badge>
                <Badge variant="outline">✅ Multi-Speed</Badge>
                <Badge variant="outline">✅ Cost Analysis</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">🎨</span>
                <span>NFT Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Mint achievement NFTs with IPFS metadata storage and automated badge generation
              </p>
              <div className="mt-4 space-y-2">
                <Badge variant="outline">✅ ERC-721</Badge>
                <Badge variant="outline">✅ IPFS Storage</Badge>
                <Badge variant="outline">✅ OpenSea Ready</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">📡 Live Events</TabsTrigger>
            <TabsTrigger value="gas">⛽ Gas Optimizer</TabsTrigger>
            <TabsTrigger value="nft">🎨 NFT Minting</TabsTrigger>
          </TabsList>

          {/* Real-time Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Real-time Blockchain Monitoring:</strong> The WebSocket listener automatically connects to Ethereum Sepolia 
                and monitors your deployed smart contracts for events. Make a transaction to see it appear instantly!
              </AlertDescription>
            </Alert>

            <RealtimeEventMonitor />

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <p>WebSocket connection established to Infura Sepolia endpoint</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <p>Event listeners attached to TourPackageEscrow & MyTourEscrow contracts</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <p>Events decoded using contract ABIs and mapped to IoT actions</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold">4.</span>
                  <p>Real-time notifications sent to UI with transaction details</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gas Optimizer Tab */}
          <TabsContent value="gas" className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Smart Gas Estimation:</strong> Get real-time gas estimates with multiple speed options. 
                Choose between slow (cheapest) to instant (fastest) based on your needs.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GasOptimizerWidget
                estimates={gasOptimizer.estimates}
                selectedSpeed={gasOptimizer.selectedSpeed}
                onSpeedChange={gasOptimizer.setSelectedSpeed}
                isLoading={gasOptimizer.isLoading}
                onRefresh={gasOptimizer.estimateGas}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Gas Optimization Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">💰 Cost Savings</h4>
                    <p className="text-sm text-gray-600">
                      Dynamic fee calculation ensures you never overpay. EIP-1559 support adjusts fees based on network demand.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">⚡ Speed Control</h4>
                    <p className="text-sm text-gray-600">
                      Choose your priority: Save money with slow transactions or get instant confirmation when needed.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">📊 Transparency</h4>
                    <p className="text-sm text-gray-600">
                      See exactly what you're paying in ETH and USD before confirming any transaction.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">📈 Statistics</h4>
                    <div className="bg-gray-50 rounded p-3 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Avg Base Fee:</span>
                        <span className="font-mono">{gasOptimizer.stats.avgBaseFee.toFixed(2)} Gwei</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Transactions:</span>
                        <span className="font-mono">{gasOptimizer.stats.totalTransactions}</span>
                      </div>
                    </div>
                  </div>

                  {!provider && (
                    <Button onClick={connectWallet} className="w-full">
                      Connect Wallet to Estimate
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* NFT Minting Tab */}
          <TabsContent value="nft" className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Achievement NFTs:</strong> Mint ERC-721 tokens for your achievements with metadata stored on IPFS. 
                Each NFT includes a unique badge, achievement details, and is viewable on OpenSea.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AchievementNFTMinter
                achievement={sampleAchievement}
                userAddress={userAddress}
                provider={provider}
                onMintSuccess={(result) => {
                  console.log('NFT minted:', result);
                }}
              />

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>NFT Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-1">
                        📦 IPFS Storage
                      </h4>
                      <p className="text-gray-600">
                        Badge images and metadata stored permanently on IPFS via Pinata gateway
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-1">
                        🎨 Auto-Generated Badges
                      </h4>
                      <p className="text-gray-600">
                        Beautiful SVG badges automatically generated with achievement info and colors
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-1">
                        🌐 OpenSea Compatible
                      </h4>
                      <p className="text-gray-600">
                        ERC-721 compliant tokens viewable on OpenSea and all major NFT platforms
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-1">
                        ✅ On-Chain Proof
                      </h4>
                      <p className="text-gray-600">
                        Permanent record of achievements with timestamp and user ownership
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sample Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`{
  "name": "STC Achievement: First Steps",
  "description": "Visit your first 360° panorama",
  "image": "ipfs://QmXyz123...",
  "attributes": [
    { "trait_type": "Category", "value": "explorer" },
    { "trait_type": "Points", "value": 10 },
    { "trait_type": "Platform", "value": "STC Ultimate" }
  ]
}`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Technical Details */}
        <Card className="border-2 border-blue-600">
          <CardHeader>
            <CardTitle>🔧 Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">WebSocket Events</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• ethers.WebSocketProvider</li>
                  <li>• Event filter subscriptions</li>
                  <li>• Auto-reconnect logic</li>
                  <li>• ABI event decoding</li>
                  <li>• IoT action mapping</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Gas Optimization</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• EIP-1559 support</li>
                  <li>• Dynamic estimation</li>
                  <li>• Multi-speed options</li>
                  <li>• USD cost calculation</li>
                  <li>• Usage statistics</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">NFT Achievements</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• ERC-721 standard</li>
                  <li>• Pinata IPFS integration</li>
                  <li>• SVG badge generation</li>
                  <li>• OpenSea metadata</li>
                  <li>• On-chain minting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Built for Ethereum Sepolia Testnet • STC Ultimate Platform</p>
          <p className="mt-1">All features production-ready and scalable for mainnet deployment</p>
        </div>
      </div>
    </div>
  );
}
