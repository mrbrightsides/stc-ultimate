'use client';

import { BlockchainEventStorage, type BlockchainEventRecord } from './blockchain-event-tracker';
import { STCTokenStorage, type TokenTransaction } from './stc-erc20-token';

// ========================================
// TRANSACTION HISTORY WITH PAGINATION
// Advanced pagination, filtering, and sorting system
// ========================================

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface TransactionFilters {
  status?: 'confirmed' | 'pending' | 'failed' | 'all';
  serviceName?: string;
  dateFrom?: number; // timestamp
  dateTo?: number; // timestamp
  minAmount?: number; // in ETH
  maxAmount?: number; // in ETH
  searchQuery?: string; // search by hash, service name, etc.
}

export interface TransactionSortOptions {
  field: 'timestamp' | 'amount' | 'gasUsed' | 'status' | 'serviceName';
  order: 'asc' | 'desc';
}

export interface EnhancedTransaction extends BlockchainEventRecord {
  // Additional computed fields
  amountETH: number;
  gasCostETH: number;
  relativeTime: string;
  statusColor: string;
  statusIcon: string;
}

/**
 * Transaction History Manager
 * Handles pagination, filtering, sorting, and export
 */
export class TransactionHistoryManager {
  private itemsPerPage: number = 10;

  /**
   * Set items per page
   */
  setItemsPerPage(count: number): void {
    this.itemsPerPage = Math.max(1, Math.min(100, count)); // Between 1-100
  }

  /**
   * Get paginated transactions with filters and sorting
   */
  getPaginatedTransactions(
    page: number = 1,
    filters?: TransactionFilters,
    sort?: TransactionSortOptions
  ): PaginatedResult<EnhancedTransaction> {
    // Get all transactions
    let transactions = BlockchainEventStorage.getAll();

    // Apply filters
    transactions = this.applyFilters(transactions, filters);

    // Apply sorting
    transactions = this.applySorting(transactions, sort);

    // Enhance transactions with computed fields
    const enhanced = transactions.map(tx => this.enhanceTransaction(tx));

    // Calculate pagination
    const totalItems = enhanced.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));
    const startIndex = (currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Get page data
    const pageData = enhanced.slice(startIndex, endIndex);

    return {
      data: pageData,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage: this.itemsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }

  /**
   * Apply filters to transactions
   */
  private applyFilters(
    transactions: BlockchainEventRecord[],
    filters?: TransactionFilters
  ): BlockchainEventRecord[] {
    if (!filters) return transactions;

    let filtered = transactions;

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(tx => tx.status === filters.status);
    }

    // Service name filter
    if (filters.serviceName) {
      filtered = filtered.filter(tx => 
        tx.serviceName?.toLowerCase().includes(filters.serviceName!.toLowerCase())
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(tx => tx.timestamp >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(tx => tx.timestamp <= filters.dateTo!);
    }

    // Amount range filter (convert Wei to ETH)
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(tx => {
        const amountETH = parseFloat(tx.value) / 1e18;
        return amountETH >= filters.minAmount!;
      });
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(tx => {
        const amountETH = parseFloat(tx.value) / 1e18;
        return amountETH <= filters.maxAmount!;
      });
    }

    // Search query (tx hash, service name, wallet address)
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.hash.toLowerCase().includes(query) ||
        tx.serviceName?.toLowerCase().includes(query) ||
        tx.from.toLowerCase().includes(query) ||
        tx.to.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  /**
   * Apply sorting to transactions
   */
  private applySorting(
    transactions: BlockchainEventRecord[],
    sort?: TransactionSortOptions
  ): BlockchainEventRecord[] {
    if (!sort) {
      // Default: newest first
      return transactions.sort((a, b) => b.timestamp - a.timestamp);
    }

    const { field, order } = sort;
    const multiplier = order === 'asc' ? 1 : -1;

    return transactions.sort((a, b) => {
      switch (field) {
        case 'timestamp':
          return (a.timestamp - b.timestamp) * multiplier;
        
        case 'amount':
          const amountA = parseFloat(a.value);
          const amountB = parseFloat(b.value);
          return (amountA - amountB) * multiplier;
        
        case 'gasUsed':
          const gasA = parseFloat(a.gasUsed);
          const gasB = parseFloat(b.gasUsed);
          return (gasA - gasB) * multiplier;
        
        case 'status':
          return a.status.localeCompare(b.status) * multiplier;
        
        case 'serviceName':
          const nameA = a.serviceName || '';
          const nameB = b.serviceName || '';
          return nameA.localeCompare(nameB) * multiplier;
        
        default:
          return 0;
      }
    });
  }

  /**
   * Enhance transaction with computed fields
   */
  private enhanceTransaction(tx: BlockchainEventRecord): EnhancedTransaction {
    const amountETH = parseFloat(tx.value) / 1e18;
    const gasCostETH = parseFloat(tx.gasCost);
    const relativeTime = this.getRelativeTime(tx.timestamp);
    const { color, icon } = this.getStatusDisplay(tx.status);

    return {
      ...tx,
      amountETH,
      gasCostETH,
      relativeTime,
      statusColor: color,
      statusIcon: icon,
    };
  }

  /**
   * Get relative time string (e.g., "2 hours ago")
   */
  private getRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
  }

  /**
   * Get status display color and icon
   */
  private getStatusDisplay(status: string): { color: string; icon: string } {
    switch (status) {
      case 'confirmed':
        return { color: 'text-green-600', icon: '✓' };
      case 'pending':
        return { color: 'text-yellow-600', icon: '⏳' };
      case 'failed':
        return { color: 'text-red-600', icon: '✗' };
      default:
        return { color: 'text-gray-600', icon: '?' };
    }
  }

  /**
   * Get unique service names for filter dropdown
   */
  getServiceNames(): string[] {
    const transactions = BlockchainEventStorage.getAll();
    const services = new Set<string>();
    
    transactions.forEach(tx => {
      if (tx.serviceName) {
        services.add(tx.serviceName);
      }
    });

    return Array.from(services).sort();
  }

  /**
   * Get transaction statistics
   */
  getStatistics(filters?: TransactionFilters): {
    total: number;
    confirmed: number;
    pending: number;
    failed: number;
    totalVolume: string;
    avgAmount: string;
    totalGasCost: string;
  } {
    const transactions = this.applyFilters(
      BlockchainEventStorage.getAll(),
      filters
    );

    const confirmed = transactions.filter(tx => tx.status === 'confirmed').length;
    const pending = transactions.filter(tx => tx.status === 'pending').length;
    const failed = transactions.filter(tx => tx.status === 'failed').length;

    const totalVolumeWei = transactions.reduce((sum, tx) => 
      sum + parseFloat(tx.value), 0
    );
    const totalVolumeETH = totalVolumeWei / 1e18;
    const avgAmount = transactions.length > 0 ? totalVolumeETH / transactions.length : 0;

    const totalGasCost = transactions.reduce((sum, tx) => 
      sum + parseFloat(tx.gasCost), 0
    );

    return {
      total: transactions.length,
      confirmed,
      pending,
      failed,
      totalVolume: totalVolumeETH.toFixed(4),
      avgAmount: avgAmount.toFixed(4),
      totalGasCost: totalGasCost.toFixed(6),
    };
  }

  /**
   * Export transactions to CSV
   */
  exportToCSV(filters?: TransactionFilters): string {
    const transactions = this.applyFilters(
      BlockchainEventStorage.getAll(),
      filters
    );

    // CSV Header
    const headers = [
      'Transaction Hash',
      'Date & Time',
      'Service Name',
      'Status',
      'Amount (ETH)',
      'Gas Used',
      'Gas Cost (ETH)',
      'Block Number',
      'From Address',
      'To Address',
      'Etherscan URL',
    ];

    // CSV Rows
    const rows = transactions.map(tx => {
      const amountETH = (parseFloat(tx.value) / 1e18).toFixed(6);
      const date = new Date(tx.timestamp).toISOString();
      
      return [
        tx.hash,
        date,
        tx.serviceName || 'Unknown',
        tx.status,
        amountETH,
        tx.gasUsed,
        tx.gasCost,
        tx.blockNumber.toString(),
        tx.from,
        tx.to,
        `https://sepolia.etherscan.io/tx/${tx.hash}`,
      ];
    });

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Export transactions to JSON
   */
  exportToJSON(filters?: TransactionFilters): string {
    const transactions = this.applyFilters(
      BlockchainEventStorage.getAll(),
      filters
    );

    const enhanced = transactions.map(tx => this.enhanceTransaction(tx));
    const statistics = this.getStatistics(filters);

    const exportData = {
      exportedAt: new Date().toISOString(),
      statistics,
      transactions: enhanced,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Download file helper
   */
  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export and download CSV
   */
  downloadCSV(filters?: TransactionFilters): void {
    const csv = this.exportToCSV(filters);
    const timestamp = new Date().toISOString().split('T')[0];
    this.downloadFile(
      csv,
      `stc-transactions-${timestamp}.csv`,
      'text/csv;charset=utf-8;'
    );
  }

  /**
   * Export and download JSON
   */
  downloadJSON(filters?: TransactionFilters): void {
    const json = this.exportToJSON(filters);
    const timestamp = new Date().toISOString().split('T')[0];
    this.downloadFile(
      json,
      `stc-transactions-${timestamp}.json`,
      'application/json'
    );
  }
}

// Singleton instance
export const transactionHistory = new TransactionHistoryManager();
