'use client';

import { AlertTriangle, RefreshCw, Wifi, WifiOff, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { NeonCard } from './neon-card';
import { NeonButton } from './neon-button';
import { Badge } from './badge';
import { useState } from 'react';

export interface EnhancedErrorProps {
  title: string;
  description: string;
  errorCode?: string;
  errorType: 'network' | 'contract' | 'wallet' | 'permission' | 'validation' | 'unknown';
  onRetry?: () => void;
  onSupport?: () => void;
  details?: string;
  suggestions?: string[];
}

const getErrorTypeConfig = (errorType: EnhancedErrorProps['errorType']) => {
  switch (errorType) {
    case 'network':
      return {
        icon: WifiOff,
        color: 'orange',
        badge: 'NETWORK ERROR',
        primaryAction: 'Check Connection'
      };
    case 'contract':
      return {
        icon: AlertTriangle,
        color: 'red',
        badge: 'CONTRACT ERROR',
        primaryAction: 'Retry Transaction'
      };
    case 'wallet':
      return {
        icon: AlertTriangle,
        color: 'purple',
        badge: 'WALLET ERROR',
        primaryAction: 'Reconnect Wallet'
      };
    case 'permission':
      return {
        icon: AlertTriangle,
        color: 'yellow',
        badge: 'PERMISSION DENIED',
        primaryAction: 'Grant Permission'
      };
    case 'validation':
      return {
        icon: AlertTriangle,
        color: 'cyan',
        badge: 'VALIDATION ERROR',
        primaryAction: 'Check Input'
      };
    default:
      return {
        icon: AlertTriangle,
        color: 'gray',
        badge: 'UNKNOWN ERROR',
        primaryAction: 'Retry'
      };
  }
};

const getDefaultSuggestions = (errorType: EnhancedErrorProps['errorType']): string[] => {
  switch (errorType) {
    case 'network':
      return [
        'Check your internet connection',
        'Try switching to a different network',
        'Refresh the page and try again',
        'Contact your ISP if the problem persists'
      ];
    case 'contract':
      return [
        'Ensure you have enough ETH for gas fees',
        'Check if you\'re on the correct network (Sepolia)',
        'Wait a moment and retry the transaction',
        'Contact support if the contract is unresponsive'
      ];
    case 'wallet':
      return [
        'Reconnect your wallet',
        'Check if your wallet is unlocked',
        'Ensure you\'re on the correct account',
        'Try refreshing the page'
      ];
    case 'permission':
      return [
        'Accept the permission request in your wallet',
        'Enable location services if prompted',
        'Allow camera access for QR scanning',
        'Check browser permissions'
      ];
    case 'validation':
      return [
        'Check all required fields are filled',
        'Ensure amounts are valid numbers',
        'Verify date ranges are correct',
        'Double-check your selections'
      ];
    default:
      return [
        'Try refreshing the page',
        'Clear your browser cache',
        'Contact support if issue persists',
        'Check the console for more details'
      ];
  }
};

export function EnhancedError({
  title,
  description,
  errorCode,
  errorType,
  onRetry,
  onSupport,
  details,
  suggestions
}: EnhancedErrorProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const config = getErrorTypeConfig(errorType);
  const IconComponent = config.icon;
  const errorSuggestions = suggestions || getDefaultSuggestions(errorType);

  const copyErrorDetails = async (): Promise<void> => {
    const errorInfo = [
      `Error: ${title}`,
      `Description: ${description}`,
      errorCode && `Code: ${errorCode}`,
      `Type: ${errorType}`,
      details && `Details: ${details}`,
      `Timestamp: ${new Date().toISOString()}`
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(errorInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  return (
    <NeonCard glowColor={config.color as any} className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full bg-${config.color}-500/20`}>
            <IconComponent className={`h-8 w-8 text-${config.color}-400`} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <Badge className={`bg-${config.color}-500/20 text-${config.color}-300 border-${config.color}-500/50`}>
                {config.badge}
              </Badge>
            </div>
            <p className="text-gray-300">{description}</p>
            {errorCode && (
              <p className="text-sm text-gray-400 font-mono">
                Error Code: {errorCode}
              </p>
            )}
          </div>
        </div>

        {/* Error Details */}
        {details && (
          <div className="p-4 rounded-lg bg-black/30 border border-gray-600">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Technical Details:</h4>
            <p className="text-xs text-gray-400 font-mono whitespace-pre-wrap">{details}</p>
          </div>
        )}

        {/* Suggestions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Suggested Solutions:</h4>
          <ul className="space-y-2">
            {errorSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full bg-${config.color}-400 flex-shrink-0`} />
                <span className="text-sm text-gray-400">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
          {onRetry && (
            <NeonButton
              variant="primary"
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {config.primaryAction}
            </NeonButton>
          )}
          
          <NeonButton
            variant="secondary"
            onClick={copyErrorDetails}
            className="flex items-center gap-2"
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Error Details'}
          </NeonButton>

          {onSupport && (
            <NeonButton
              variant="secondary"
              onClick={onSupport}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Contact Support
            </NeonButton>
          )}
        </div>

        {/* Network Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-gray-600">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">Network Status</span>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
            Online
          </Badge>
        </div>
      </div>
    </NeonCard>
  );
}