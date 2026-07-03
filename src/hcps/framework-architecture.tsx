'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Server,
  Users,
  MapPin,
  Shield,
  Layers,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { HCPS_LAYERS, INTEGRATION_POINTS } from '@/lib/hcps-config';
import type { HCPSLayer } from '@/lib/hcps-config';

export default function FrameworkArchitecture() {
  const [selectedLayer, setSelectedLayer] = useState<HCPSLayer | null>(null);

  const layerIcons: Record<string, JSX.Element> = {
    physical: <MapPin className="h-6 w-6" />,
    cyber: <Server className="h-6 w-6" />,
    human: <Users className="h-6 w-6" />,
    governance: <Shield className="h-6 w-6" />
  };

  const layerColorClasses: Record<string, { bg: string; border: string; text: string }> = {
    green: { 
      bg: 'bg-green-500/10', 
      border: 'border-green-500/30', 
      text: 'text-green-400' 
    },
    blue: { 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/30', 
      text: 'text-blue-400' 
    },
    purple: { 
      bg: 'bg-purple-500/10', 
      border: 'border-purple-500/30', 
      text: 'text-purple-400' 
    },
    orange: { 
      bg: 'bg-orange-500/10', 
      border: 'border-orange-500/30', 
      text: 'text-orange-400' 
    }
  };

  return (
    <div className="space-y-8">
      {/* Architecture Overview */}
      <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Layers className="h-8 w-8 text-cyan-400" />
            <div>
              <CardTitle className="text-3xl text-white">HCPS Architecture</CardTitle>
              <CardDescription className="text-gray-400">
                Four-Layer System Architecture for Tourism 5.0
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Layer Stack Visualization */}
          <div className="space-y-4">
            {HCPS_LAYERS.slice().reverse().map((layer, index) => {
              const colors = layerColorClasses[layer.color];
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer)}
                  className={`w-full p-6 rounded-lg border-2 transition-all hover:scale-[1.02] ${colors.bg} ${colors.border} ${
                    selectedLayer?.id === layer.id ? 'ring-2 ring-offset-2 ring-offset-black' : ''
                  }`}
                  style={{
                    ...(selectedLayer?.id === layer.id && {
                      ringColor: `var(--${layer.color}-500)`
                    })
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${colors.bg}`}>
                        {layerIcons[layer.id]}
                      </div>
                      <div className="text-left">
                        <h3 className={`text-xl font-bold ${colors.text}`}>
                          Layer {HCPS_LAYERS.length - index}: {layer.name}
                        </h3>
                        <p className="text-gray-400 text-sm">{layer.description}</p>
                      </div>
                    </div>
                    <ArrowRight className={`h-6 w-6 ${colors.text}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Layer Details */}
          {selectedLayer && (
            <Alert className="bg-gradient-to-r from-gray-900 to-black border-gray-700">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-4 mt-2">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Components</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLayer.components.map((component, idx) => (
                        <Badge
                          key={idx}
                          className={`${layerColorClasses[selectedLayer.color].bg} ${layerColorClasses[selectedLayer.color].text} border-${selectedLayer.color}-500/50`}
                        >
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLayer.technologies.map((tech, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className={`${layerColorClasses[selectedLayer.color].text} border-${selectedLayer.color}-500/50`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Integration Points */}
      <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-purple-400" />
            <div>
              <CardTitle className="text-2xl text-white">Integration Points</CardTitle>
              <CardDescription className="text-gray-400">
                How HCPS Components Connect with Tourism 5.0 Features
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {INTEGRATION_POINTS.map((point, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-900 transition-colors"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">HCPS Component</div>
                    <div className="font-semibold text-cyan-400">{point.hcpsComponent}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Tourism 5.0 Feature</div>
                    <div className="font-semibold text-purple-400">{point.tourism5Feature}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">
                    <strong className="text-white">Benefit:</strong> {point.benefit}
                  </div>
                  <div className="text-sm text-gray-500">
                    <strong className="text-gray-400">Example:</strong> {point.example}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Flow Diagram */}
      <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">System Data Flow</CardTitle>
          <CardDescription className="text-gray-400">
            End-to-end data flow in the HCPS-Tourism 5.0 system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Flow visualization */}
            <div className="relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {[
                  {
                    step: 1,
                    title: 'Tourist Input',
                    icon: <Users className="h-6 w-6" />,
                    color: 'purple',
                    description: 'User books tour via Web3 interface'
                  },
                  {
                    step: 2,
                    title: 'Blockchain Processing',
                    icon: <Server className="h-6 w-6" />,
                    color: 'blue',
                    description: 'Smart contract validates and locks payment'
                  },
                  {
                    step: 3,
                    title: 'IoT Verification',
                    icon: <MapPin className="h-6 w-6" />,
                    color: 'green',
                    description: 'Sensors verify service consumption'
                  },
                  {
                    step: 4,
                    title: 'Automated Settlement',
                    icon: <Zap className="h-6 w-6" />,
                    color: 'orange',
                    description: 'Payment released to service provider'
                  }
                ].map((item, index, array) => (
                  <div key={item.step} className="flex flex-col items-center">
                    <div className={`relative p-6 rounded-xl bg-${item.color}-500/10 border-2 border-${item.color}-500/30`}>
                      <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-${item.color}-500 flex items-center justify-center text-white font-bold text-sm`}>
                        {item.step}
                      </div>
                      <div className={`text-${item.color}-400 mb-3`}>
                        {item.icon}
                      </div>
                      <h4 className={`font-bold text-${item.color}-300 mb-1`}>{item.title}</h4>
                      <p className="text-xs text-gray-400 max-w-xs">{item.description}</p>
                    </div>
                    {index < array.length - 1 && (
                      <ArrowRight className="hidden md:block absolute top-1/2 left-[calc(25%+6rem)] transform -translate-y-1/2 text-gray-600 h-8 w-8" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional details */}
            <Alert className="bg-gray-900/50 border-gray-800">
              <Info className="h-4 w-4 text-cyan-400" />
              <AlertDescription className="text-gray-400">
                <strong className="text-white">Real-time Monitoring:</strong> Throughout this flow, 
                gRPC streams provide live updates to all stakeholders. SCADA dashboard displays 
                system health, while researchers can export transaction data for analysis.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
