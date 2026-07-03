'use client';

import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, ExternalLink, Copy, Download, X } from 'lucide-react';
import { NeonButton } from '@/components/ui/neon-button';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useCurrencyConverter } from '@/hooks/use-currency-converter';

interface TransactionSuccessProps {
  txHash: string;
  serviceAmount: string;
  serviceName: string;
  blockNumber?: number;
  gasUsed?: string;
  onDismiss?: () => void;
}

export function TransactionSuccess({ 
  txHash, 
  serviceAmount, 
  serviceName, 
  blockNumber, 
  gasUsed,
  onDismiss 
}: TransactionSuccessProps) {
  const etherscanUrl = `https://sepolia.etherscan.io/tx/${txHash}`;
  const { ethToUsd } = useCurrencyConverter();

  const copyTxHash = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(txHash);
      toast.success('Transaction hash copied!');
    } catch (error) {
      toast.error('Failed to copy transaction hash');
    }
  };

  const copyEtherscanUrl = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(etherscanUrl);
      toast.success('Etherscan URL copied!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const downloadQR = (): void => {
    const svg = document.querySelector('.transaction-qr-code svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      
      // White background
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 300, 300);
        ctx.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `tx-${serviceName.toLowerCase().replace(/\s+/g, '-')}-${txHash.slice(0, 8)}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <NeonCard glowColor="green" intense className="max-w-lg mx-auto relative">
      {/* Close Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 hover:bg-black/70 border border-gray-600 hover:border-red-500/50 transition-all group"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-400 group-hover:text-red-400" />
        </button>
      )}
      
      <div className="space-y-6 p-6">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-green-400">Payment Successful!</h3>
          <p className="text-gray-300">
            Your payment for <span className="text-white font-semibold">{serviceName}</span> has been processed
          </p>
        </div>

        {/* Transaction Details */}
        <div className="space-y-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Amount Paid</p>
              <p className="text-green-400 font-bold text-lg">{serviceAmount} ETH</p>
              <p className="text-green-300 text-xs">{ethToUsd(serviceAmount)}</p>
            </div>
            
            {blockNumber && (
              <div>
                <p className="text-gray-400">Block Number</p>
                <p className="text-white font-mono">#{blockNumber}</p>
              </div>
            )}
            
            {gasUsed && (
              <div>
                <p className="text-gray-400">Gas Used</p>
                <p className="text-cyan-400 font-mono">{gasUsed}</p>
              </div>
            )}
            
            <div>
              <p className="text-gray-400">Network</p>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                Sepolia Testnet
              </Badge>
            </div>
          </div>

          {/* Transaction Hash */}
          <div>
            <p className="text-gray-400 text-sm mb-2">Transaction Hash</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-black/50 border border-gray-600">
              <p className="text-green-400 font-mono text-sm flex-1 break-all">
                {txHash}
              </p>
              <NeonButton
                size="sm"
                variant="secondary"
                onClick={copyTxHash}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </NeonButton>
            </div>
          </div>
        </div>

        {/* QR Code for Etherscan */}
        <div className="text-center space-y-4">
          <h4 className="text-white font-semibold">Scan for Etherscan Verification</h4>
          <div className="transaction-qr-code flex justify-center">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={etherscanUrl}
                size={150}
                bgColor="white"
                fgColor="#000000"
                level="M"
                includeMargin={true}
              />
            </div>
          </div>
          
          <p className="text-gray-400 text-sm">
            Scan this QR code to view transaction details on Sepolia Etherscan
          </p>

          {/* QR Actions */}
          <div className="flex gap-2 justify-center">
            <NeonButton
              size="sm"
              variant="secondary"
              onClick={copyEtherscanUrl}
            >
              <Copy className="h-4 w-4" />
              Copy URL
            </NeonButton>
            <NeonButton
              size="sm"
              variant="secondary"
              onClick={downloadQR}
            >
              <Download className="h-4 w-4" />
              Download QR
            </NeonButton>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <NeonButton
            variant="primary"
            className="flex-1"
            onClick={() => window.open(etherscanUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            View on Etherscan
          </NeonButton>
          
          {onDismiss && (
            <NeonButton
              variant="secondary"
              onClick={onDismiss}
            >
              Close
            </NeonButton>
          )}
        </div>
      </div>
    </NeonCard>
  );
}