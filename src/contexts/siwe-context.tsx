'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ethers } from 'ethers';

interface SIWEContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  error: string | null;
  refreshBalance: () => Promise<void>;
  getProvider: () => ethers.providers.Web3Provider | null;
}

const SIWEContext = createContext<SIWEContextType | null>(null);

export function SIWEProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!address;

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to connect your wallet');
      }

      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const network = await provider.getNetwork();
      
      // Get balance
      const userBalance = await provider.getBalance(userAddress);
      const formattedBalance = ethers.utils.formatEther(userBalance);

      setAddress(userAddress);
      setBalance(parseFloat(formattedBalance).toFixed(4));
      setChainId(network.chainId);

      // Store in localStorage for persistence
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_address', userAddress);

    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    setChainId(null);
    setError(null);
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('No wallet connected');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return await signer.signMessage(message);
  };

  const refreshBalance = async (): Promise<void> => {
    if (!address || !window.ethereum) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const userBalance = await provider.getBalance(address);
      const formatted = parseFloat(ethers.utils.formatEther(userBalance)).toFixed(4);
      setBalance(formatted);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const getProvider = (): ethers.providers.Web3Provider | null => {
    if (!window.ethereum) return null;
    return new ethers.providers.Web3Provider(window.ethereum);
  };

  // Auto-reconnect on page load
  useEffect(() => {
    const autoConnect = async () => {
      const wasConnected = localStorage.getItem('wallet_connected');
      if (wasConnected && window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
            const network = await provider.getNetwork();
            const userBalance = await provider.getBalance(userAddress);
            
            setAddress(userAddress);
            setBalance(parseFloat(ethers.utils.formatEther(userBalance)).toFixed(4));
            setChainId(network.chainId);
          }
        } catch (err) {
          console.log('Auto-reconnect failed:', err);
          localStorage.removeItem('wallet_connected');
        }
      }
    };

    autoConnect();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          connect();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const value: SIWEContextType = {
    address,
    isConnected,
    isConnecting,
    balance,
    chainId,
    connect,
    disconnect,
    signMessage,
    error,
    refreshBalance,
    getProvider
  };

  return (
    <SIWEContext.Provider value={value}>
      {children}
    </SIWEContext.Provider>
  );
}

export function useSIWE() {
  const context = useContext(SIWEContext);
  if (!context) {
    throw new Error('useSIWE must be used within a SIWEProvider');
  }
  return context;
}