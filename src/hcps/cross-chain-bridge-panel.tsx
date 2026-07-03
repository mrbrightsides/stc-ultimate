'use client';

/**
 * Cross-Chain Bridge Panel
 * Transfer STC tokens across multiple blockchains
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Link2, ArrowRight, Clock, CheckCircle2, AlertCircle,
  TrendingUp, BarChart3, ExternalLink, Wallet, RefreshCw
} from 'lucide-react';
import { 
  SUPPORTED_NETWORKS,
  generateMockBridgeTransactions,
  calculateCrossChainStats,
  type BlockchainNetwork,
  type BridgeTransaction
} from '@/lib/phase2-cross-chain';

interface Props {
  userRole: string;
}

export function CrossChainBridgePanel({ userRole }: Props): JSX.Element {
  const [fromNetwork, setFromNetwork] = useState<BlockchainNetwork>(SUPPORTED_NETWORKS[0]);
  const [toNetwork, setToNetwork] = useState<BlockchainNetwork>(SUPPORTED_NETWORKS[1]);
  const [amount, setAmount] = useState<string>('');
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const [isBridging, setIsBridging] = useState<boolean>(false);

  useEffect(() => {
    // Load mock transactions
    setTransactions(generateMockBridgeTransactions());
  }, []);

  const stats = calculateCrossChainStats(transactions);

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (fromNetwork.id === toNetwork.id) {
      alert('Please select different networks');
      return;
    }

    setIsBridging(true);
    
    // Simulate bridge transaction
    setTimeout(() => {
      const newTx: BridgeTransaction = {
        id: `bridge-${Date.now()}`,
        fromChain: fromNetwork.id,
        toChain: toNetwork.id,
        tokenAmount: amount,
        tokenSymbol: 'STC',
        status: 'bridging',
        txHashSource: `0x${Math.random().toString(16).slice(2, 66)}`,
        timestamp: Date.now(),
        estimatedTime: 600,
        fee: '0.001',
        recipient: `0x${Math.random().toString(16).slice(2, 42)}`
      };
      
      setTransactions(prev => [newTx, ...prev]);
      setIsBridging(false);
      setAmount('');
      
      alert('Bridge transaction initiated! Check transaction history for updates.');
    }, 2000);
  };

  const getStatusColor = (status: BridgeTransaction['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'bridging': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: BridgeTransaction['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'bridging': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Bridged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalBridged} STC</div>
            <p className="text-xs text-muted-foreground mt-1">Cross-chain volume</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1">Bridge operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Successful bridges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageFee} ETH</div>
            <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bridge Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-blue-600" />
              Bridge Tokens
            </CardTitle>
            <CardDescription>Transfer STC tokens across blockchains</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Bridge transactions typically take 5-15 minutes. Fees vary by network.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>From Network</Label>
              <Select 
                value={fromNetwork.id} 
                onValueChange={(id) => setFromNetwork(SUPPORTED_NETWORKS.find(n => n.id === id)!)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_NETWORKS.map(network => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.logo} {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button variant="ghost" size="icon" onClick={() => {
                const temp = fromNetwork;
                setFromNetwork(toNetwork);
                setToNetwork(temp);
              }}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>To Network</Label>
              <Select 
                value={toNetwork.id} 
                onValueChange={(id) => setToNetwork(SUPPORTED_NETWORKS.find(n => n.id === id)!)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_NETWORKS.map(network => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.logo} {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount (STC)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Fee:</span>
                <span className="font-medium">0.001 {fromNetwork.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Time:</span>
                <span className="font-medium">~10 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">You will receive:</span>
                <span className="font-medium">{amount || '0'} STC</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleBridge}
              disabled={isBridging || !amount}
            >
              {isBridging ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Bridging...
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Bridge Tokens
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Supported Networks */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Networks</CardTitle>
            <CardDescription>Available blockchain networks for bridging</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {SUPPORTED_NETWORKS.map(network => (
                <Card key={network.id} className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">{network.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{network.name}</h4>
                        <Badge variant="secondary">{network.symbol}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Gas: {network.gasPrice}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {network.features.slice(0, 3).map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 text-xs">
                        <span className="text-muted-foreground">Volume: </span>
                        <span className="font-medium">{stats.volumeByChain[network.id] || '0'} STC</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>Recent bridge transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 10).map(tx => (
              <Card key={tx.id} className="p-3">
                <div className="flex items-start gap-3">
                  {getStatusIcon(tx.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {SUPPORTED_NETWORKS.find(n => n.id === tx.fromChain)?.logo}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {SUPPORTED_NETWORKS.find(n => n.id === tx.toChain)?.logo}
                      </span>
                      <Badge variant="outline" className="ml-auto">
                        {tx.tokenAmount} {tx.tokenSymbol}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={getStatusColor(tx.status)}>{tx.status}</span>
                      <span>•</span>
                      <span>{new Date(tx.timestamp).toLocaleString()}</span>
                      {tx.txHashSource && (
                        <>
                          <span>•</span>
                          <a 
                            href={`#`} 
                            className="flex items-center gap-1 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View TX <ExternalLink className="h-3 w-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
