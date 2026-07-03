'use client';

import { useState } from 'react';
import { DollarSign, ArrowLeftRight } from 'lucide-react';
import { NeonButton } from './neon-button';
import { useCurrencyConverter } from '@/hooks/use-currency-converter';

export function CurrencyToggle() {
  const { displayCurrency, toggleCurrency, currentRate, usdToIdr } = useCurrencyConverter();
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleToggle = (): void => {
    setIsAnimating(true);
    toggleCurrency();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const displayRate = displayCurrency === 'IDR' 
    ? currentRate * usdToIdr 
    : currentRate;

  return (
    <div className="flex items-center gap-3">
      {/* Current Rate Display */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-gray-600">
        <DollarSign className="h-4 w-4 text-green-400" />
        <span className="text-sm text-gray-300">1 ETH =</span>
        <span className="text-sm font-semibold text-green-400">
          {displayCurrency === 'IDR' 
            ? `Rp ${displayRate.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`
            : `$${displayRate.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
          }
        </span>
      </div>

      {/* Toggle Button */}
      <NeonButton
        size="sm"
        variant="secondary"
        onClick={handleToggle}
        className={`p-2 ${isAnimating ? 'animate-spin' : ''}`}
        title={`Switch to ${displayCurrency === 'USD' ? 'IDR' : 'USD'}`}
      >
        <ArrowLeftRight className="h-4 w-4" />
      </NeonButton>

      {/* Currency Label */}
      <div className="px-2 py-1 rounded bg-cyan-500/20 border border-cyan-500/50">
        <span className="text-xs font-medium text-cyan-300">
          {displayCurrency}
        </span>
      </div>
    </div>
  );
}