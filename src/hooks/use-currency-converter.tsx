'use client';

import { useState, useEffect } from 'react';

type Currency = 'USD' | 'IDR';

interface CurrencyRates {
  currentRate: number;
  usdToIdr: number;
  displayCurrency: Currency;
  ethToUsd: (ethAmount: number) => number;
  ethToDisplay: (ethAmount: number) => number;
  formatCurrency: (amount: number, includeSymbol?: boolean) => string;
  toggleCurrency: () => void;
}

export function useCurrencyConverter(): CurrencyRates {
  const [currentRate, setCurrentRate] = useState<number>(2847); // ETH price in USD
  const [usdToIdr] = useState<number>(15750); // USD to IDR rate
  const [displayCurrency, setDisplayCurrency] = useState<Currency>('USD');

  useEffect(() => {
    // Simulate price updates every 30 seconds
    const interval = setInterval(() => {
      setCurrentRate(prev => {
        const change = (Math.random() - 0.5) * 100; // ±$50 variation
        const newPrice = prev + change;
        return Math.max(2000, Math.min(4000, newPrice)); // Keep between $2000-$4000
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const ethToUsd = (ethAmount: number): number => {
    return ethAmount * currentRate;
  };

  const ethToDisplay = (ethAmount: number): number => {
    const usdAmount = ethToUsd(ethAmount);
    return displayCurrency === 'IDR' ? usdAmount * usdToIdr : usdAmount;
  };

  const formatCurrency = (amount: number, includeSymbol: boolean = true): string => {
    if (displayCurrency === 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: includeSymbol ? 'currency' : 'decimal',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: includeSymbol ? 'currency' : 'decimal',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
  };

  const toggleCurrency = (): void => {
    setDisplayCurrency(prev => prev === 'USD' ? 'IDR' : 'USD');
  };

  return {
    currentRate,
    usdToIdr,
    displayCurrency,
    ethToUsd,
    ethToDisplay,
    formatCurrency,
    toggleCurrency
  };
}