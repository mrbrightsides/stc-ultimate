'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { STCTokenWidget } from '@/components/web3/stc-token-widget';
import { TransactionDashboard } from '@/components/analytics/transaction-dashboard';
import { Coins, BarChart3, Sparkles, ArrowLeft } from 'lucide-react';

export default function TokenAnalyticsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {/* Back to Home Button */}
      <div className="flex justify-start">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3">
          <Coins className="h-12 w-12 text-blue-500" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            STC Token & Analytics
          </h1>
          <BarChart3 className="h-12 w-12 text-indigo-500" />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your STC tokens and explore comprehensive blockchain transaction analytics
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span>Deployed on Ethereum Sepolia Testnet</span>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="token" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="token" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            STC Token
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Token Tab */}
        <TabsContent value="token">
          <Suspense
            fallback={
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Loading STC Token...</p>
                </CardContent>
              </Card>
            }
          >
            <STCTokenWidget />
          </Suspense>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Suspense
            fallback={
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Loading Analytics...</p>
                </CardContent>
              </Card>
            }
          >
            <TransactionDashboard />
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* Feature Highlights */}
      <div className="grid gap-4 md:grid-cols-3 mt-12">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6 space-y-2">
            <Coins className="h-8 w-8 text-blue-600" />
            <h3 className="font-semibold">Native Platform Token</h3>
            <p className="text-sm text-muted-foreground">
              STC tokens power the entire ecosystem with utilities including payments, rewards, governance, and staking
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200 dark:border-emerald-900">
          <CardContent className="pt-6 space-y-2">
            <BarChart3 className="h-8 w-8 text-emerald-600" />
            <h3 className="font-semibold">Real-time Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive transaction metrics, cost analysis, and performance insights with interactive charts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-900">
          <CardContent className="pt-6 space-y-2">
            <Sparkles className="h-8 w-8 text-amber-600" />
            <h3 className="font-semibold">Earn Rewards</h3>
            <p className="text-sm text-muted-foreground">
              Automatically earn 10% back in STC tokens on every tourism service booking completed on the platform
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Technical Details */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Technical Implementation</h3>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">STC Token (ERC-20)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Deployed on Ethereum Sepolia testnet</li>
                <li>• Standard ERC-20 interface with extensions</li>
                <li>• 1 billion initial supply with 18 decimals</li>
                <li>• Integrated with wallet providers (MetaMask, Coinbase)</li>
                <li>• Auto-reward distribution on service completion</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-emerald-600">Transaction Analytics</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Real-time transaction monitoring and tracking</li>
                <li>• Comprehensive cost comparison with traditional systems</li>
                <li>• Service-level breakdown and performance metrics</li>
                <li>• Time-series analysis with customizable periods</li>
                <li>• Export functionality for research and reporting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Value */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
            Academic Research Value
          </h3>
          <p className="text-sm text-purple-800 dark:text-purple-200">
            These features provide quantifiable metrics for blockchain tourism research, including:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-900 dark:text-purple-100">
            <ul className="space-y-1">
              <li>✓ Cost reduction percentage vs traditional systems</li>
              <li>✓ Transaction success rates and reliability metrics</li>
              <li>✓ Gas optimization and efficiency analysis</li>
            </ul>
            <ul className="space-y-1">
              <li>✓ Token economics and reward distribution</li>
              <li>✓ Time-series data for longitudinal studies</li>
              <li>✓ Service-level performance comparisons</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
