'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Network, DollarSign, Clock, CheckCircle2, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import { 
  getCrossChainSystem,
  getNetworks,
  getTransactionHistory,
  estimateFee,
  getBridgeStats,
  type SupportedNetwork,
  type BridgeTransaction
} from '@/lib/phase2-cross-chain';

interface CrossChainBridgeHubProps {
  onBack: () => void;
}

export default function CrossChainBridgeHub({ onBack }: CrossChainBridgeHubProps) {
  const [fromNetwork, setFromNetwork] = useState<string>('ethereum');
  const [toNetwork, setToNetwork] = useState<string>('polygon');
  const [amount, setAmount] = useState<string>('');
  const [estimatedFee, setEstimatedFee] = useState<number>(0);

  const crossChainSystem = getCrossChainSystem();
  const networks = getNetworks();
  const transactions = getTransactionHistory();
  const bridgeStats = getBridgeStats();

  const handleEstimate = (): void => {
    if (amount && fromNetwork && toNetwork) {
      const fee = estimateFee(fromNetwork as SupportedNetwork, toNetwork as SupportedNetwork, parseFloat(amount));
      setEstimatedFee(fee);
    }
  };

  const handleBridge = (): void => {
    // In a real app, this would initiate the bridge transaction
    console.log('Bridging', amount, 'from', fromNetwork, 'to', toNetwork);
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      bridging: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      completed: 'bg-green-500/20 text-green-300 border-green-500/50',
      failed: 'bg-red-500/20 text-red-300 border-red-500/50'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/50';
  };

  const getStatusIcon = (status: string): JSX.Element => {
    const icons: Record<string, JSX.Element> = {
      pending: <Clock className="h-4 w-4" />,
      bridging: <Activity className="h-4 w-4 animate-spin" />,
      completed: <CheckCircle2 className="h-4 w-4" />,
      failed: <AlertCircle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const selectedFromNetwork = networks.find(n => n.id === fromNetwork);
  const selectedToNetwork = networks.find(n => n.id === toNetwork);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Cross-Chain Bridge
              </h1>
              <p className="text-gray-400 mt-2">Transfer tokens seamlessly across blockchains</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Bridged</p>
                  <p className="text-3xl font-bold text-blue-400">{crossChainSystem.totalBridged.toFixed(1)}M</p>
                </div>
                <Network className="h-10 w-10 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-green-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Success Rate</p>
                  <p className="text-3xl font-bold text-green-400">{crossChainSystem.successRate}%</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Bridge Time</p>
                  <p className="text-3xl font-bold text-purple-400">{crossChainSystem.averageBridgeTime}m</p>
                </div>
                <Clock className="h-10 w-10 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Supported Networks</p>
                  <p className="text-3xl font-bold text-orange-400">{crossChainSystem.supportedNetworks}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bridge">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
            <TabsTrigger value="bridge">Bridge Tokens</TabsTrigger>
            <TabsTrigger value="networks">Networks</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          {/* Bridge Tab */}
          <TabsContent value="bridge" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Bridge Form */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle>Transfer STC Tokens</CardTitle>
                    <CardDescription>Bridge tokens between supported blockchains</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* From Network */}
                    <div className="space-y-2">
                      <Label htmlFor="from-network" className="text-white">From Network</Label>
                      <Select value={fromNetwork} onValueChange={setFromNetwork}>
                        <SelectTrigger id="from-network">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {networks.map((network) => (
                            <SelectItem key={network.id} value={network.id}>
                              {network.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedFromNetwork && (
                        <p className="text-sm text-gray-400">
                          Gas: {selectedFromNetwork.gasPrice} gwei • Volume: {selectedFromNetwork.volume.toFixed(1)}M STC
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>

                    {/* To Network */}
                    <div className="space-y-2">
                      <Label htmlFor="to-network" className="text-white">To Network</Label>
                      <Select value={toNetwork} onValueChange={setToNetwork}>
                        <SelectTrigger id="to-network">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {networks.filter(n => n.id !== fromNetwork).map((network) => (
                            <SelectItem key={network.id} value={network.id}>
                              {network.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedToNetwork && (
                        <p className="text-sm text-gray-400">
                          Gas: {selectedToNetwork.gasPrice} gwei • Volume: {selectedToNetwork.volume.toFixed(1)}M STC
                        </p>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-white">Amount (STC)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onBlur={handleEstimate}
                        className="bg-gray-800 text-2xl font-bold"
                      />
                    </div>

                    {/* Fee Estimate */}
                    {estimatedFee > 0 && (
                      <Alert className="bg-blue-500/10 border-blue-500/30">
                        <DollarSign className="h-4 w-4 text-blue-400" />
                        <AlertDescription className="text-gray-300">
                          <div className="flex items-center justify-between">
                            <span>Estimated Bridge Fee:</span>
                            <span className="font-bold text-blue-400">{estimatedFee.toFixed(4)} STC</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm">Estimated Time:</span>
                            <span className="text-sm text-gray-400">
                              {selectedFromNetwork && selectedToNetwork ? 
                                `${Math.floor(Math.random() * 10) + 5}-${Math.floor(Math.random() * 10) + 10} minutes` 
                                : '-'}
                            </span>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Bridge Button */}
                    <Button 
                      onClick={handleBridge}
                      disabled={!amount || parseFloat(amount) <= 0}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      size="lg"
                    >
                      <Network className="h-5 w-5 mr-2" />
                      Bridge Tokens
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Bridge Stats */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Routes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {bridgeStats.popularRoutes.slice(0, 5).map((route, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white">{route.from} → {route.to}</p>
                          <p className="text-xs text-gray-400">{route.volume.toFixed(1)}M STC</p>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-300">
                          {route.transactions}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Bridge Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Total Volume</span>
                      <span className="font-bold text-blue-400">{bridgeStats.totalVolume.toFixed(1)}M STC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Total Transactions</span>
                      <span className="font-bold text-purple-400">{bridgeStats.totalTransactions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Avg Fee</span>
                      <span className="font-bold text-green-400">{bridgeStats.averageFee.toFixed(4)} STC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Success Rate</span>
                      <span className="font-bold text-orange-400">{bridgeStats.successRate}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Networks Tab */}
          <TabsContent value="networks" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {networks.map((network) => (
                <Card key={network.id} className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{network.name}</CardTitle>
                        <CardDescription>Chain ID: {network.chainId}</CardDescription>
                      </div>
                      <Badge className={network.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}>
                        {network.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Network Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-800/50 rounded">
                        <p className="text-xs text-gray-400">Gas Price</p>
                        <p className="text-lg font-bold text-cyan-400">{network.gasPrice} gwei</p>
                      </div>
                      <div className="p-3 bg-gray-800/50 rounded">
                        <p className="text-xs text-gray-400">Volume</p>
                        <p className="text-lg font-bold text-purple-400">{network.volume.toFixed(1)}M</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {network.features.map((feature, idx) => (
                          <Badge key={idx} className="bg-blue-500/20 text-blue-300 text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Recent Bridge Transactions</CardTitle>
                <CardDescription>Track your cross-chain transfers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-white">{tx.fromNetwork} → {tx.toNetwork}</p>
                          <Badge className={getStatusColor(tx.status)}>
                            {getStatusIcon(tx.status)}
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{tx.amount.toFixed(4)} STC</span>
                          <span>•</span>
                          <span>Fee: {tx.fee.toFixed(4)} STC</span>
                          <span>•</span>
                          <span>{new Date(tx.timestamp).toLocaleString()}</span>
                        </div>
                        {tx.txHash && (
                          <p className="text-xs text-blue-400 font-mono">{tx.txHash}</p>
                        )}
                      </div>
                      {tx.status === 'completed' && tx.completedAt && (
                        <div className="text-right text-sm">
                          <p className="text-gray-400">Completed in</p>
                          <p className="font-bold text-green-400">
                            {Math.floor((tx.completedAt - tx.timestamp) / 60000)} min
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
