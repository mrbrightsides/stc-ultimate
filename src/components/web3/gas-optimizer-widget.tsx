'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { TransactionSpeed, GasEstimate } from '@/lib/gas-optimizer';

// ========================================
// GAS OPTIMIZER WIDGET
// UI component for displaying and selecting gas options
// ========================================

interface GasOptimizerWidgetProps {
  estimates: Record<TransactionSpeed, GasEstimate> | null;
  selectedSpeed: TransactionSpeed;
  onSpeedChange: (speed: TransactionSpeed) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const speedLabels: Record<TransactionSpeed, { label: string; icon: string; color: string }> = {
  slow: { label: 'Slow', icon: '🐢', color: 'bg-blue-500' },
  medium: { label: 'Medium', icon: '⚡', color: 'bg-green-500' },
  fast: { label: 'Fast', icon: '🚀', color: 'bg-orange-500' },
  instant: { label: 'Instant', icon: '⚡⚡', color: 'bg-red-500' },
};

export function GasOptimizerWidget({
  estimates,
  selectedSpeed,
  onSpeedChange,
  isLoading = false,
  onRefresh,
}: GasOptimizerWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gas Optimizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Estimating gas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!estimates) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gas Optimizer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No gas estimates available</p>
          {onRefresh && (
            <Button onClick={onRefresh} className="mt-4">
              Estimate Gas
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const speeds: TransactionSpeed[] = ['slow', 'medium', 'fast', 'instant'];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>⛽ Gas Optimizer</CardTitle>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            🔄 Refresh
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Speed Options */}
        <div className="grid grid-cols-2 gap-3">
          {speeds.map((speed) => {
            const estimate = estimates[speed];
            const config = speedLabels[speed];
            const isSelected = speed === selectedSpeed;

            return (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${isSelected 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{config.icon}</span>
                  {isSelected && (
                    <Badge className="bg-blue-600">Selected</Badge>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{config.label}</p>
                  <p className="text-sm text-gray-600">{estimate.estimatedTime}</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    {estimate.totalCostEth.substring(0, 8)} ETH
                  </p>
                  {estimate.totalCostUsd && (
                    <p className="text-xs text-gray-500">
                      ≈ ${estimate.totalCostUsd} USD
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Estimate Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900">Transaction Details</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Gas Limit:</span>
              <span className="font-mono font-medium">
                {estimates[selectedSpeed].gasLimit.toString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Max Fee:</span>
              <span className="font-mono font-medium">
                {(parseFloat(estimates[selectedSpeed].maxFeePerGas.toString()) / 1e9).toFixed(2)} Gwei
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Priority Fee:</span>
              <span className="font-mono font-medium">
                {(parseFloat(estimates[selectedSpeed].maxPriorityFeePerGas.toString()) / 1e9).toFixed(2)} Gwei
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Time:</span>
              <span className="font-medium">
                {estimates[selectedSpeed].estimatedTime}
              </span>
            </div>
          </div>

          {/* Cost Comparison */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Cost Comparison:</p>
            <div className="space-y-1">
              {speeds.map((speed) => {
                const estimate = estimates[speed];
                const percentage = (parseFloat(estimate.totalCostEth) / parseFloat(estimates.instant.totalCostEth)) * 100;
                
                return (
                  <div key={speed} className="flex items-center gap-2">
                    <span className="text-xs w-16">{speedLabels[speed].label}:</span>
                    <Progress value={percentage} className="h-2" />
                    <span className="text-xs font-mono">
                      {estimate.totalCostEth.substring(0, 8)} ETH
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            💡 <strong>EIP-1559 Enabled:</strong> Gas fees automatically adjust based on network demand
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
