'use client';

import { useState, useEffect } from 'react';
import { useBlockchainEvents } from '@/contexts/blockchain-events-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity,
  CheckCircle2,
  ExternalLink,
  Lock,
  Unlock,
  Wallet,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface BlockchainEvent {
  id: string;
  timestamp: number;
  txHash: string;
  blockNumber: number;
  eventName: string;
  contractName: string;
  params: Record<string, string | number>;
  gasUsed: number;
  status: 'confirmed' | 'pending' | 'failed';
}

export function SmartContractFeed() {
  // Get real blockchain events from context
  const { events: blockchainRecords, stats } = useBlockchainEvents();
  
  // Transform blockchain records to display format
  const [events, setEvents] = useState<BlockchainEvent[]>([]);
  
  useEffect(() => {
    const transformed = blockchainRecords.flatMap((record) => {
      // Create event for each parsed event in the transaction
      return record.events.map((evt, idx) => ({
        id: `${record.id}-${idx}`,
        timestamp: record.timestamp,
        txHash: record.txHash,
        blockNumber: record.blockNumber,
        eventName: evt.eventName,
        contractName: record.serviceName || 'STC Contract',
        params: {
          serviceId: record.serviceId || 'N/A',
          amount: parseFloat(record.value) / 1e18 || 0,
          from: record.from.substring(0, 10) + '...',
          gasUsed: record.gasUsed,
        },
        gasUsed: parseInt(record.gasUsed),
        status: record.status,
      }));
    });
    
    setEvents(transformed);
  }, [blockchainRecords]);

  const [filter, setFilter] = useState<string>('all');

  // Real blockchain events are automatically updated via context

  const getEventIcon = (eventName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      EscrowReleased: <Unlock className="h-5 w-5 text-green-400" />,
      BookingValidated: <FileCheck className="h-5 w-5 text-blue-400" />,
      TokenMinted: <DollarSign className="h-5 w-5 text-yellow-400" />,
      MilestoneTriggered: <Activity className="h-5 w-5 text-purple-400" />,
      PaymentProcessed: <Wallet className="h-5 w-5 text-cyan-400" />
    };
    return iconMap[eventName] || <Activity className="h-5 w-5 text-gray-400" />;
  };

  const getEventColor = (eventName: string): string => {
    const colorMap: Record<string, string> = {
      EscrowReleased: 'border-green-500/30 bg-green-500/10',
      BookingValidated: 'border-blue-500/30 bg-blue-500/10',
      TokenMinted: 'border-yellow-500/30 bg-yellow-500/10',
      MilestoneTriggered: 'border-purple-500/30 bg-purple-500/10',
      PaymentProcessed: 'border-cyan-500/30 bg-cyan-500/10'
    };
    return colorMap[eventName] || 'border-gray-500/30 bg-gray-500/10';
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.contractName === filter);

  const uniqueContracts = Array.from(new Set(events.map(e => e.contractName)));
  const totalGasUsed = events.reduce((sum, e) => sum + e.gasUsed, 0);
  const avgGasPerTx = events.length > 0 ? Math.floor(totalGasUsed / events.length) : 0;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-cyan-400">{events.length}</p>
                <p className="text-xs text-gray-500">Events Tracked</p>
              </div>
              <Activity className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-400">{events.filter(e => e.status === 'confirmed').length}</p>
                <p className="text-xs text-gray-500">Confirmed</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-400">{avgGasPerTx.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Avg Gas/Tx</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-400">{uniqueContracts.length}</p>
                <p className="text-xs text-gray-500">Contracts</p>
              </div>
              <FileCheck className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
                Smart Contract Activity Feed
              </CardTitle>
              <CardDescription>Real-time blockchain events from STC ecosystem contracts</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              {uniqueContracts.map(contract => (
                <Button
                  key={contract}
                  size="sm"
                  variant={filter === contract ? 'default' : 'outline'}
                  onClick={() => setFilter(contract)}
                >
                  {contract}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id}
                  className={`${getEventColor(event.eventName)} border transition-all hover:scale-[1.01]`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getEventIcon(event.eventName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-white text-lg">{event.eventName}</span>
                            <Badge variant="outline">{event.contractName}</Badge>
                            <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                              {event.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {Object.entries(event.params).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="text-gray-400">{key}:</span>
                                <span className="text-cyan-400 ml-2 font-mono">
                                  {typeof value === 'number' ? value.toFixed(2) : value}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Block: #{event.blockNumber}</span>
                            <span>Gas: {event.gasUsed.toLocaleString()}</span>
                            <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <code className="text-xs bg-gray-900 px-2 py-1 rounded text-gray-400 font-mono">
                              {event.txHash.substring(0, 20)}...
                            </code>
                            <Button size="sm" variant="ghost" className="h-6 px-2">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
