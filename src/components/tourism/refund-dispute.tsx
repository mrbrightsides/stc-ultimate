'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  Timer,
  MessageSquare,
  ArrowRight,
  AlertCircle,
  Ban
} from 'lucide-react';
import { useCurrencyConverter } from '@/hooks/use-currency-converter';
import type { TourPackage, TourService } from '@/app/types/contracts';

interface DisputeCase {
  id: string;
  serviceId: number;
  serviceName: string;
  reason: string;
  description: string;
  submittedAt: Date;
  status: 'pending' | 'investigating' | 'resolved' | 'rejected';
  resolution: string | null;
  refundAmount: string;
  timeoutHours: number;
  evidence?: string[];
}

interface RefundDisputeProps {
  tourPackage: TourPackage;
  onRefundIssued: (serviceId: number, amount: string) => void;
  onServiceSkipped: (serviceId: number) => void;
  walletConnected: boolean;
}

const DISPUTE_REASONS = [
  'Service not available',
  'Poor service quality',
  'Location closed/changed',
  'Safety concerns',
  'Merchant unresponsive',
  'Service not as described',
  'Technical issues',
  'Other'
];

export function RefundDispute({ 
  tourPackage, 
  onRefundIssued, 
  onServiceSkipped,
  walletConnected 
}: RefundDisputeProps) {
  const [disputes, setDisputes] = useState<DisputeCase[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [disputeDescription, setDisputeDescription] = useState<string>('');
  const [serviceTimeouts, setServiceTimeouts] = useState<Record<number, number>>({});
  const { ethToUsd } = useCurrencyConverter();

  // Initialize service timeouts (simulate 2-hour timeout for demo)
  useEffect(() => {
    const timeouts: Record<number, number> = {};
    tourPackage.services.forEach((service) => {
      if (service.status === 'pending') {
        timeouts[service.id] = 120; // 2 hours in minutes
      }
    });
    setServiceTimeouts(timeouts);

    // Countdown timer
    const interval = setInterval(() => {
      setServiceTimeouts(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(serviceIdStr => {
          const serviceId = parseInt(serviceIdStr);
          const service = tourPackage.services.find(s => s.id === serviceId);
          if (service?.status === 'pending' && updated[serviceId] > 0) {
            updated[serviceId] -= 1;
          }
        });
        return updated;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [tourPackage.services]);

  const submitDispute = (): void => {
    if (!selectedService || !disputeReason || !disputeDescription.trim()) return;

    const service = tourPackage.services.find(s => s.id === selectedService);
    if (!service) return;

    const newDispute: DisputeCase = {
      id: Date.now().toString(),
      serviceId: selectedService,
      serviceName: service.name,
      reason: disputeReason,
      description: disputeDescription,
      submittedAt: new Date(),
      status: 'pending',
      resolution: null,
      refundAmount: service.amount,
      timeoutHours: Math.floor(serviceTimeouts[selectedService] / 60)
    };

    setDisputes(prev => [...prev, newDispute]);
    setSelectedService(null);
    setDisputeReason('');
    setDisputeDescription('');

    // Simulate dispute processing
    setTimeout(() => {
      setDisputes(prev => prev.map(dispute =>
        dispute.id === newDispute.id
          ? { ...dispute, status: 'investigating' }
          : dispute
      ));
    }, 2000);

    // Auto-resolve for demo (normally would be manual process)
    setTimeout(() => {
      setDisputes(prev => prev.map(dispute =>
        dispute.id === newDispute.id
          ? { 
              ...dispute, 
              status: Math.random() > 0.2 ? 'resolved' : 'rejected',
              resolution: Math.random() > 0.2 
                ? 'Dispute validated. Service provider confirmed unavailability. Full refund approved.' 
                : 'Insufficient evidence provided. Dispute cannot be resolved in favor of traveler.'
            }
          : dispute
      ));
    }, 8000);
  };

  const processRefund = (dispute: DisputeCase): void => {
    onRefundIssued(dispute.serviceId, dispute.refundAmount);
    setDisputes(prev => prev.filter(d => d.id !== dispute.id));
  };

  const skipService = (serviceId: number): void => {
    onServiceSkipped(serviceId);
  };

  const getTimeoutColor = (minutes: number): string => {
    if (minutes > 60) return 'text-green-400';
    if (minutes > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTimeout = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getDisputeStatusColor = (status: DisputeCase['status']): string => {
    switch (status) {
      case 'pending':
        return 'bg-orange-500/10 text-orange-300 border-orange-500/30';
      case 'investigating':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'resolved':
        return 'bg-green-500/10 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/10 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-300 border-gray-500/30';
    }
  };

  const getDisputeStatusIcon = (status: DisputeCase['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'investigating':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
    }
  };

  const pendingDisputes = disputes.filter(d => d.status !== 'resolved' && d.status !== 'rejected');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          Refund & Dispute Protection
        </h2>
        <p className="text-gray-300 text-lg">
          Smart contract protection with automated refund and dispute resolution
        </p>
      </div>

      {/* Protection Overview */}
      <NeonCard glowColor="orange">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-orange-400" />
            <h3 className="text-2xl font-semibold text-white">Protection Status</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <Shield className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-400">{tourPackage.services.length}</p>
              <p className="text-sm text-orange-300">Protected Services</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">{tourPackage.totalAmount} ETH</p>
              <p className="text-sm text-green-300">Total Protected Amount</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-400">{disputes.length}</p>
              <p className="text-sm text-blue-300">Disputes Filed</p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              Protection Features
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">2-hour service timeout protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Automatic dispute resolution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Smart contract refund guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Evidence-based resolution</span>
              </div>
            </div>
          </div>
        </div>
      </NeonCard>

      {/* Services with Timeout Status */}
      <div className="grid gap-6">
        {tourPackage.services.map((service) => {
          const timeoutMinutes = serviceTimeouts[service.id] || 0;
          const isTimedOut = timeoutMinutes <= 0 && service.status === 'pending';
          const hasDispute = disputes.some(d => d.serviceId === service.id);
          
          return (
            <NeonCard
              key={service.id}
              glowColor={isTimedOut ? 'red' : service.status === 'completed' ? 'green' : 'orange'}
              className="transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                    <p className="text-gray-400 text-sm">{service.description}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={service.status === 'completed' ? getDisputeStatusColor('resolved') : getDisputeStatusColor('pending')}>
                      {service.status}
                    </Badge>
                    {service.status === 'pending' && (
                      <div className={`text-sm ${getTimeoutColor(timeoutMinutes)}`}>
                        <Timer className="h-3 w-3 inline mr-1" />
                        {formatTimeout(timeoutMinutes)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-sm text-gray-400">Service Fee</p>
                    <p className="text-lg font-bold text-cyan-400">{service.amount} ETH</p>
                    <p className="text-xs text-cyan-300">{ethToUsd(service.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Protection Status</p>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-300">Protected</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Timeout</p>
                    <p className={`text-sm ${getTimeoutColor(timeoutMinutes)}`}>
                      {isTimedOut ? 'Service Expired' : formatTimeout(timeoutMinutes)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {service.status === 'pending' && !hasDispute && (
                    <>
                      <NeonButton
                        variant="destructive"
                        size="sm"
                        onClick={() => setSelectedService(service.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        File Dispute
                      </NeonButton>
                      
                      {isTimedOut && (
                        <NeonButton
                          variant="secondary"
                          size="sm"
                          onClick={() => skipService(service.id)}
                        >
                          <Ban className="h-4 w-4" />
                          Skip Service
                        </NeonButton>
                      )}
                    </>
                  )}
                  
                  {hasDispute && (
                    <Badge className={getDisputeStatusColor(disputes.find(d => d.serviceId === service.id)?.status || 'pending')}>
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Dispute Filed
                    </Badge>
                  )}
                  
                  {service.status === 'completed' && (
                    <div className="flex items-center gap-2 text-green-300 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Service completed successfully
                    </div>
                  )}
                </div>
              </div>
            </NeonCard>
          );
        })}
      </div>

      {/* Dispute Form Modal */}
      {selectedService && (
        <NeonCard glowColor="red" className="border-2 border-red-500/50">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-red-400" />
                File Dispute
              </h3>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Service</Label>
                <p className="text-white font-medium">
                  {tourPackage.services.find(s => s.id === selectedService)?.name}
                </p>
              </div>

              <div>
                <Label htmlFor="dispute-reason" className="text-gray-300">Reason for Dispute</Label>
                <select
                  id="dispute-reason"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full mt-1 p-2 bg-black/50 border border-red-500/50 rounded text-white"
                >
                  <option value="">Select a reason...</option>
                  {DISPUTE_REASONS.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="dispute-description" className="text-gray-300">Description</Label>
                <Textarea
                  id="dispute-description"
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  placeholder="Please provide detailed information about the issue..."
                  className="mt-1 bg-black/50 border-red-500/50 text-white min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <NeonButton
                variant="destructive"
                onClick={submitDispute}
                disabled={!disputeReason || !disputeDescription.trim()}
              >
                <FileText className="h-4 w-4" />
                Submit Dispute
              </NeonButton>
              <NeonButton
                variant="secondary"
                onClick={() => setSelectedService(null)}
              >
                Cancel
              </NeonButton>
            </div>
          </div>
        </NeonCard>
      )}

      {/* Active Disputes */}
      {pendingDisputes.length > 0 && (
        <NeonCard glowColor="blue">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-400" />
              Active Disputes
            </h3>
            
            <div className="space-y-4">
              {pendingDisputes.map((dispute) => (
                <div key={dispute.id} className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{dispute.serviceName}</h4>
                      <p className="text-blue-300 text-sm">{dispute.reason}</p>
                    </div>
                    <Badge className={getDisputeStatusColor(dispute.status)}>
                      {getDisputeStatusIcon(dispute.status)}
                      {dispute.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{dispute.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Submitted: {dispute.submittedAt.toLocaleDateString()}
                    </span>
                    <span className="text-blue-300">
                      Refund Amount: {dispute.refundAmount} ETH
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </NeonCard>
      )}

      {/* Resolved Disputes */}
      {resolvedDisputes.length > 0 && (
        <NeonCard glowColor="green">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Resolved Disputes
            </h3>
            
            <div className="space-y-4">
              {resolvedDisputes.map((dispute) => (
                <div key={dispute.id} className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{dispute.serviceName}</h4>
                      <p className="text-green-300 text-sm">{dispute.reason}</p>
                    </div>
                    <NeonButton
                      variant="success"
                      size="sm"
                      onClick={() => processRefund(dispute)}
                    >
                      <DollarSign className="h-4 w-4" />
                      Claim Refund
                    </NeonButton>
                  </div>
                  
                  <div className="bg-green-500/5 rounded p-3 mb-3">
                    <p className="text-green-200 text-sm">{dispute.resolution}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Resolved: {new Date().toLocaleDateString()}
                    </span>
                    <span className="text-green-300 font-medium">
                      Refund: {dispute.refundAmount} ETH
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </NeonCard>
      )}
    </div>
  );
}