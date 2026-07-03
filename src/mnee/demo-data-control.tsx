'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Database, Trash2, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import {
  populateMockData,
  clearMockData,
  getMockDataStats,
} from '@/lib/mock-data-generator';

/**
 * Demo Data Control Panel
 * For MNEE Hackathon - Quick populate/clear demo data
 */
export function DemoDataControl() {
  const [stats, setStats] = useState({
    payments: 0,
    escrows: 0,
    splits: 0,
    totalVolume: '0.00',
    isEmpty: true,
  });
  const [isPopulating, setIsPopulating] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);

  // Load stats on mount
  useEffect(() => {
    refreshStats();
  }, []);

  const refreshStats = () => {
    const currentStats = getMockDataStats();
    setStats(currentStats);
  };

  const handlePopulate = () => {
    setIsPopulating(true);
    
    try {
      const result = populateMockData({
        payments: 120,
        escrows: 75,
        splits: 70,
      });

      toast.success('Demo data populated! 🎉', {
        description: `Generated ${result.escrowsGenerated} escrows, ${result.splitsGenerated} splits, ${result.paymentsGenerated} payments. Total volume: $${result.totalVolume}`,
      });

      // Refresh stats
      refreshStats();

      // Reload page to refresh all components
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Failed to populate data:', error);
      toast.error('Failed to populate demo data');
    } finally {
      setIsPopulating(false);
    }
  };

  const handleClear = () => {
    setIsClearing(true);
    
    try {
      clearMockData();
      toast.success('Demo data cleared!', {
        description: 'All mock data has been removed from localStorage',
      });

      // Refresh stats
      refreshStats();

      // Reload page to refresh all components
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Failed to clear data:', error);
      toast.error('Failed to clear demo data');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <NeonCard glowColor="cyan" className="mb-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Database className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Demo Data Control</h3>
              <p className="text-sm text-gray-400">Quick populate or clear demo data for hackathon presentation</p>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
            MNEE Hackathon
          </Badge>
        </div>

        {/* Stats */}
        {!stats.isEmpty && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-black/30 border border-cyan-500/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{stats.payments}</p>
              <p className="text-xs text-gray-400">Payments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{stats.escrows}</p>
              <p className="text-xs text-gray-400">Escrows</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{stats.splits}</p>
              <p className="text-xs text-gray-400">Splits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">${stats.totalVolume}</p>
              <p className="text-xs text-gray-400">Total Volume</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats.isEmpty && (
          <div className="p-8 rounded-lg bg-black/30 border border-gray-700 text-center">
            <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-300 mb-2">No Demo Data</p>
            <p className="text-sm text-gray-500">Click "Populate Demo Data" to generate realistic data for presentation</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <NeonButton
            variant="primary"
            onClick={handlePopulate}
            loading={isPopulating}
            disabled={isClearing}
            className="flex-1"
          >
            <Sparkles className="h-5 w-5" />
            {isPopulating ? 'Populating...' : 'Populate Demo Data'}
          </NeonButton>

          <NeonButton
            variant="secondary"
            onClick={refreshStats}
            disabled={isPopulating || isClearing}
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </NeonButton>

          {!stats.isEmpty && (
            <NeonButton
              variant="secondary"
              onClick={handleClear}
              loading={isClearing}
              disabled={isPopulating}
              className="border-red-500/50 text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-5 w-5" />
              {isClearing ? 'Clearing...' : 'Clear Data'}
            </NeonButton>
          )}
        </div>

        {/* Info */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm text-gray-300">
              <p className="font-semibold text-white">Demo Data Generation:</p>
              <ul className="space-y-1 ml-4 list-disc text-gray-400">
                <li>120 MNEE payments (bookings, splits, releases, refunds)</li>
                <li>75 tour escrows (various statuses: pending, verified, released)</li>
                <li>70 revenue splits (multi-stakeholder distributions)</li>
                <li>Realistic service names (hotels, tours, activities from 10 cities)</li>
                <li>Timestamps spanning last 90 days</li>
                <li>Transaction amounts: $50 - $5,000 MNEE</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                💡 Tip: This data is stored in browser localStorage and will persist until cleared or browser data is reset.
              </p>
            </div>
          </div>
        </div>
      </div>
    </NeonCard>
  );
}
