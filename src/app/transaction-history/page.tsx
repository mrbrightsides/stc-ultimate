'use client';

import Link from 'next/link';
import { TransactionHistoryViewer } from '@/components/web3/transaction-history-viewer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Database, TrendingUp, Zap, ArrowLeft } from 'lucide-react';

export default function TransactionHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
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
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transaction History
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete transaction management system with advanced filtering, pagination, and export capabilities
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Paginated View</h3>
                  <p className="text-sm text-muted-foreground">5-100 items per page</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-900">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Advanced Filters</h3>
                  <p className="text-sm text-muted-foreground">Status, service, amount</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-900">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Smart Sorting</h3>
                  <p className="text-sm text-muted-foreground">Multiple sort options</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 dark:border-yellow-900">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Export Data</h3>
                  <p className="text-sm text-muted-foreground">CSV & JSON export</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Transaction Viewer */}
        <TransactionHistoryViewer />

        {/* Features Section */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">📊 Pagination</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Adjustable items per page (5, 10, 25, 50, 100)</li>
                  <li>Page navigation with previous/next buttons</li>
                  <li>Total count and page indicators</li>
                  <li>Automatic scroll to top on page change</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">🔍 Advanced Filtering</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Filter by status (confirmed, pending, failed)</li>
                  <li>Filter by service name</li>
                  <li>Amount range filtering (min/max ETH)</li>
                  <li>Search by hash, address, or service name</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">⚡ Smart Sorting</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Sort by timestamp (newest/oldest first)</li>
                  <li>Sort by amount (highest/lowest first)</li>
                  <li>Sort by gas used</li>
                  <li>Sort by status or service name</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">📤 Export Options</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Export to CSV for Excel/Google Sheets</li>
                  <li>Export to JSON for programmatic analysis</li>
                  <li>Includes all filtered transactions</li>
                  <li>Automatic filename with date stamp</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research & Paper Integration */}
        <Card className="border-2 border-dashed border-blue-300 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Research & Academic Value</h3>
                <p className="text-muted-foreground mb-4">
                  This transaction history system provides essential data management capabilities
                  for academic research and conference papers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold">✅ Verifiable Transaction Data:</span>
                    <p className="text-muted-foreground">All transactions verified on Sepolia testnet</p>
                  </div>
                  <div>
                    <span className="font-semibold">✅ Export for Analysis:</span>
                    <p className="text-muted-foreground">CSV/JSON formats for statistical software</p>
                  </div>
                  <div>
                    <span className="font-semibold">✅ Historical Tracking:</span>
                    <p className="text-muted-foreground">Complete audit trail with timestamps</p>
                  </div>
                  <div>
                    <span className="font-semibold">✅ Performance Metrics:</span>
                    <p className="text-muted-foreground">Gas costs, success rates, volume analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
