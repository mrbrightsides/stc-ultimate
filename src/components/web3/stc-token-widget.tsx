'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSIWE } from '@/contexts/siwe-context';
import { 
  STCTokenManager, 
  STCTokenStorage, 
  STC_TOKEN_CONFIG,
  calculateServiceReward,
  getTokenPriceUSD,
  type STCTokenInfo,
  type TokenTransaction
} from '@/lib/stc-erc20-token';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Coins, 
  Send, 
  CheckCircle2, 
  Wallet, 
  ExternalLink,
  TrendingUp,
  Gift,
  Info
} from 'lucide-react';

export function STCTokenWidget() {
  const { address, getProvider } = useSIWE();
  const [tokenManager] = useState(() => new STCTokenManager());
  const [tokenInfo, setTokenInfo] = useState<STCTokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recentTransactions, setRecentTransactions] = useState<TokenTransaction[]>([]);

  // Load token info
  useEffect(() => {
    if (address) {
      loadTokenInfo();
      loadRecentTransactions();
    }
  }, [address]);

  const loadTokenInfo = async () => {
    if (!address) return;

    try {
      const provider = getProvider();
      if (!provider) return;

      await tokenManager.initialize(provider);
      const info = await tokenManager.getTokenInfo(address);
      setTokenInfo(info);
    } catch (error) {
      console.error('Failed to load token info:', error);
    }
  };

  const loadRecentTransactions = () => {
    const txs = STCTokenStorage.getAll().slice(0, 5);
    setRecentTransactions(txs);
  };

  const handleAddToWallet = async () => {
    setIsLoading(true);
    try {
      const success = await tokenManager.addToWallet();
      if (success) {
        toast.success('STC Token Added!', {
          description: 'STC token has been added to your wallet',
        });
      } else {
        toast.error('Failed to add token', {
          description: 'Please try again or add manually',
        });
      }
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'Failed to add token to wallet',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferTo || !transferAmount) {
      toast.error('Invalid Input', {
        description: 'Please enter recipient address and amount',
      });
      return;
    }

    setIsLoading(true);
    try {
      const tx = await tokenManager.transfer(transferTo, transferAmount);
      
      // Save transaction
      STCTokenStorage.save(tx);
      
      toast.success('Transfer Successful!', {
        description: `Sent ${transferAmount} STC to ${transferTo.slice(0, 10)}...`,
        action: {
          label: 'View on Etherscan',
          onClick: () => window.open(
            `https://sepolia.etherscan.io/tx/${tx.txHash}`,
            '_blank'
          ),
        },
      });

      // Reset form
      setTransferTo('');
      setTransferAmount('');
      
      // Reload data
      await loadTokenInfo();
      loadRecentTransactions();
    } catch (error: any) {
      toast.error('Transfer Failed', {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (value: string): string => {
    const num = parseFloat(value);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toFixed(2);
  };

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-blue-500" />
            STC Token
          </CardTitle>
          <CardDescription>Connect wallet to access STC tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Please connect your wallet to view and manage STC tokens
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Token Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-blue-500" />
              STC Token Balance
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToWallet}
              disabled={isLoading}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Add to Wallet
            </Button>
          </CardTitle>
          <CardDescription>
            Your {STC_TOKEN_CONFIG.symbol} token holdings and utilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Balance Display */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-4xl font-bold">
                {tokenInfo ? formatNumber(tokenInfo.userBalance) : '0.00'}
              </p>
              <p className="text-sm font-medium">{STC_TOKEN_CONFIG.symbol}</p>
              <p className="text-xs text-muted-foreground">
                ≈ ${tokenInfo ? (parseFloat(tokenInfo.userBalance) * getTokenPriceUSD()).toFixed(2) : '0.00'} USD
              </p>
            </div>
          </div>

          {/* Token Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Symbol</p>
              <p className="font-medium">{STC_TOKEN_CONFIG.symbol}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Decimals</p>
              <p className="font-medium">{STC_TOKEN_CONFIG.decimals}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Supply</p>
              <p className="font-medium">{formatNumber(STC_TOKEN_CONFIG.initialSupply)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Price (USD)</p>
              <p className="font-medium flex items-center gap-1">
                ${getTokenPriceUSD().toFixed(2)}
                <TrendingUp className="h-3 w-3 text-green-500" />
              </p>
            </div>
          </div>

          <Separator />

          {/* Token Utilities */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Token Utilities
            </h4>
            <div className="flex flex-wrap gap-2">
              {STC_TOKEN_CONFIG.utilities.map((utility, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {utility}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(tokenManager.getEtherscanUrl(), '_blank')}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Etherscan
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(tokenManager.getHolderUrl(address), '_blank')}
              className="flex-1"
            >
              <Info className="h-4 w-4 mr-2" />
              Holder Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-green-500" />
            Transfer STC Tokens
          </CardTitle>
          <CardDescription>Send STC tokens to another address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Available: {tokenInfo ? formatNumber(tokenInfo.userBalance) : '0.00'} STC
            </p>
          </div>

          <Button
            onClick={handleTransfer}
            disabled={isLoading || !transferTo || !transferAmount}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send Tokens'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest STC token activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {tx.type === 'transfer' ? '-' : ''}{tx.amount} STC
                    </p>
                    <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewards Info */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <Gift className="h-5 w-5" />
            Earn STC Rewards
          </CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            Earn 10% back in STC tokens on every service booking!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Complete tourism services and automatically receive STC token rewards. 
            Use tokens for future bookings, stake for additional rewards, or participate in platform governance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
