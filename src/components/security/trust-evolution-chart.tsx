'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { TrustHistoryEntry } from '@/contexts/zero-trust-context';

type TrustEvolutionChartProps = {
  history: TrustHistoryEntry[];
};

export function TrustEvolutionChart({ history }: TrustEvolutionChartProps) {
  const chartData = useMemo(() => {
    return history.map((entry: TrustHistoryEntry) => ({
      time: new Date(entry.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      fullTime: entry.timestamp,
      device: entry.deviceTrustScore,
      wallet: entry.walletTrustScore,
      combined: entry.combinedTrustScore,
      event: entry.event,
    }));
  }, [history]);

  const latestEntry = history[history.length - 1];
  const firstEntry = history[0];
  
  const trustChange = latestEntry && firstEntry
    ? latestEntry.combinedTrustScore - firstEntry.combinedTrustScore
    : 0;

  const trendDirection = trustChange > 0 ? 'improving' : trustChange < 0 ? 'declining' : 'stable';

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5 text-blue-400" />
              Trust Evolution Graph
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time trust score tracking over the last {history.length} data points
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              {trendDirection === 'improving' && <TrendingUp className="h-5 w-5 text-green-400" />}
              {trendDirection === 'declining' && <TrendingDown className="h-5 w-5 text-red-400" />}
              {trendDirection === 'stable' && <Activity className="h-5 w-5 text-yellow-400" />}
              <span className={`text-sm font-semibold ${
                trendDirection === 'improving' ? 'text-green-400' :
                trendDirection === 'declining' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {Math.abs(trustChange).toFixed(1)} pts {trendDirection}
              </span>
            </div>
            <p className="text-xs text-gray-500">Since session start</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                labelStyle={{ color: '#9CA3AF' }}
                formatter={(value: number) => [`${value.toFixed(1)}`, '']}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              
              {/* Reference lines for risk thresholds */}
              <ReferenceLine 
                y={70} 
                stroke="#10B981" 
                strokeDasharray="5 5" 
                label={{ value: 'Secure (70+)', position: 'right', fill: '#10B981', fontSize: 12 }} 
              />
              <ReferenceLine 
                y={50} 
                stroke="#F59E0B" 
                strokeDasharray="5 5" 
                label={{ value: 'Medium (50)', position: 'right', fill: '#F59E0B', fontSize: 12 }} 
              />
              <ReferenceLine 
                y={30} 
                stroke="#EF4444" 
                strokeDasharray="5 5" 
                label={{ value: 'High Risk (30)', position: 'right', fill: '#EF4444', fontSize: 12 }} 
              />

              <Line 
                type="monotone" 
                dataKey="device" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                name="Device Trust"
              />
              <Line 
                type="monotone" 
                dataKey="wallet" 
                stroke="#A855F7" 
                strokeWidth={2}
                dot={{ fill: '#A855F7', r: 4 }}
                name="Wallet Trust"
              />
              <Line 
                type="monotone" 
                dataKey="combined" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 5 }}
                name="Combined Trust"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Event Markers */}
        {history.some((entry: TrustHistoryEntry) => entry.event) && (
          <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">Recent Events</h4>
            <div className="space-y-1">
              {history.filter((entry: TrustHistoryEntry) => entry.event).slice(-5).map((entry: TrustHistoryEntry, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-blue-300">{entry.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
