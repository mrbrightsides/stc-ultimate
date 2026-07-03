'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Search, 
  Filter,
  ArrowUpDown,
  ExternalLink,
  Calendar,
  DollarSign,
  Zap,
  Info,
  FileText,
  Database,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  transactionHistory,
  type TransactionFilters,
  type TransactionSortOptions,
  type EnhancedTransaction,
} from '@/lib/transaction-history';

export function TransactionHistoryViewer() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Filter state
  const [filters, setFilters] = useState<TransactionFilters>({
    status: 'all',
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sort state
  const [sort, setSort] = useState<TransactionSortOptions>({
    field: 'timestamp',
    order: 'desc',
  });

  // UI state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<EnhancedTransaction | null>(null);

  // Service names for filter dropdown
  const [serviceNames, setServiceNames] = useState<string[]>([]);

  // Load service names
  useEffect(() => {
    const names = transactionHistory.getServiceNames();
    setServiceNames(names);
  }, []);

  // Update items per page when changed
  useEffect(() => {
    transactionHistory.setItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  // Get paginated data
  const result = useMemo(() => {
    const activeFilters = {
      ...filters,
      searchQuery: searchQuery.trim() || undefined,
    };

    return transactionHistory.getPaginatedTransactions(
      currentPage,
      activeFilters,
      sort
    );
  }, [currentPage, filters, searchQuery, sort, itemsPerPage]);

  // Get statistics
  const statistics = useMemo(() => {
    return transactionHistory.getStatistics(filters);
  }, [filters]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change
  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page
  };

  // Handle sort change
  const handleSortChange = (field: TransactionSortOptions['field']) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc',
    }));
    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({ status: 'all' });
    setSearchQuery('');
    setCurrentPage(1);
    toast.success('Filters reset');
  };

  // Export handlers
  const handleExportCSV = () => {
    transactionHistory.downloadCSV(filters);
    toast.success('CSV exported successfully');
  };

  const handleExportJSON = () => {
    transactionHistory.downloadJSON(filters);
    toast.success('JSON exported successfully');
  };

  // View transaction details
  const handleViewDetails = (tx: EnhancedTransaction) => {
    setSelectedTransaction(tx);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{statistics.total}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">{statistics.totalVolume} ETH</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {statistics.total > 0 
                    ? ((statistics.confirmed / statistics.total) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Gas Cost</p>
                <p className="text-2xl font-bold">{statistics.totalGasCost} ETH</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View and manage all blockchain transactions
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJSON}
              >
                <FileText className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hash, service name, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={filters.status || 'all'}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Filter */}
                  <div className="space-y-2">
                    <Label>Service</Label>
                    <Select
                      value={filters.serviceName || 'all'}
                      onValueChange={(value) => 
                        handleFilterChange('serviceName', value === 'all' ? undefined : value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Services" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        {serviceNames.map(name => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Range */}
                  <div className="space-y-2">
                    <Label>Min Amount (ETH)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={filters.minAmount || ''}
                      onChange={(e) => 
                        handleFilterChange('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSortChange('timestamp')}
                  >
                    <div className="flex items-center gap-2">
                      Date & Time
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSortChange('serviceName')}
                  >
                    <div className="flex items-center gap-2">
                      Service
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSortChange('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 text-right"
                    onClick={() => handleSortChange('amount')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Amount (ETH)
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 text-right"
                    onClick={() => handleSortChange('gasUsed')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Gas Used
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  result.data.map((tx) => (
                    <TableRow key={tx.hash}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {tx.relativeTime}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{tx.serviceName || 'Unknown'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={tx.status === 'confirmed' ? 'default' : 
                                  tx.status === 'pending' ? 'secondary' : 'destructive'}
                        >
                          {tx.statusIcon} {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {tx.amountETH.toFixed(4)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {tx.gasUsed}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(tx)}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://sepolia.etherscan.io/tx/${tx.hash}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Items per page:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {result.pagination.currentPage} of {result.pagination.totalPages || 1}
                {' '}({result.pagination.totalItems} total)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!result.pagination.hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!result.pagination.hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this blockchain transaction
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <ScrollArea className="max-h-[600px] pr-4">
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Transaction Hash:</div>
                    <div className="font-mono break-all">{selectedTransaction.hash}</div>
                    
                    <div className="text-muted-foreground">Status:</div>
                    <div>
                      <Badge variant={selectedTransaction.status === 'confirmed' ? 'default' : 'secondary'}>
                        {selectedTransaction.status}
                      </Badge>
                    </div>
                    
                    <div className="text-muted-foreground">Block Number:</div>
                    <div className="font-mono">{selectedTransaction.blockNumber}</div>
                    
                    <div className="text-muted-foreground">Timestamp:</div>
                    <div>{new Date(selectedTransaction.timestamp).toLocaleString()}</div>
                  </div>
                </div>

                {/* Service Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Service Information</h3>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Service Name:</div>
                    <div className="font-medium">{selectedTransaction.serviceName || 'Unknown'}</div>
                    
                    <div className="text-muted-foreground">Amount:</div>
                    <div className="font-mono">{selectedTransaction.amountETH.toFixed(6)} ETH</div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Addresses</h3>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">From:</div>
                    <div className="font-mono break-all">{selectedTransaction.from}</div>
                    
                    <div className="text-muted-foreground">To:</div>
                    <div className="font-mono break-all">{selectedTransaction.to}</div>
                  </div>
                </div>

                {/* Gas Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Gas Information</h3>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Gas Used:</div>
                    <div className="font-mono">{selectedTransaction.gasUsed}</div>
                    
                    <div className="text-muted-foreground">Gas Cost:</div>
                    <div className="font-mono">{selectedTransaction.gasCostETH.toFixed(6)} ETH</div>
                  </div>
                </div>

                {/* IoT Actions */}
                {selectedTransaction.iotActions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">IoT Actions Triggered</h3>
                    <Separator />
                    <div className="space-y-2">
                      {selectedTransaction.iotActions.map((action, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">{action.deviceType}: {action.action}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {action.metadata ? JSON.stringify(action.metadata) : 'No metadata'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View on Etherscan */}
                <Button
                  className="w-full"
                  onClick={() => window.open(`https://sepolia.etherscan.io/tx/${selectedTransaction.hash}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Sepolia Etherscan
                </Button>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
