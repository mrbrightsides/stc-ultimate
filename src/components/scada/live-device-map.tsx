'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Radio, Wifi, Thermometer, Camera, Lock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface DeviceMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'sensor' | 'actuator' | 'gateway';
  status: 'active' | 'inactive' | 'warning';
  category: string;
  lastPing: number;
}

export function LiveDeviceMap() {
  const [devices, setDevices] = useState<DeviceMarker[]>([
    { id: 'gps-001', name: 'Entrance GPS Tracker', lat: -6.2088, lng: 106.8456, type: 'sensor', status: 'active', category: 'GPS', lastPing: Date.now() },
    { id: 'rfid-001', name: 'Lobby RFID Scanner', lat: -6.2090, lng: 106.8458, type: 'sensor', status: 'active', category: 'RFID', lastPing: Date.now() - 2000 },
    { id: 'rfid-002', name: 'Restaurant RFID', lat: -6.2085, lng: 106.8460, type: 'sensor', status: 'active', category: 'RFID', lastPing: Date.now() - 5000 },
    { id: 'temp-001', name: 'Room Temperature Sensor', lat: -6.2092, lng: 106.8454, type: 'sensor', status: 'active', category: 'Temperature', lastPing: Date.now() - 1000 },
    { id: 'cam-001', name: 'Security Camera 1', lat: -6.2087, lng: 106.8462, type: 'sensor', status: 'active', category: 'Security', lastPing: Date.now() - 3000 },
    { id: 'cam-002', name: 'Security Camera 2', lat: -6.2094, lng: 106.8452, type: 'sensor', status: 'warning', category: 'Security', lastPing: Date.now() - 30000 },
    { id: 'lock-001', name: 'Smart Lock - Main Gate', lat: -6.2089, lng: 106.8457, type: 'actuator', status: 'active', category: 'Access', lastPing: Date.now() - 4000 },
    { id: 'gateway-001', name: 'IoT Gateway Central', lat: -6.2091, lng: 106.8459, type: 'gateway', status: 'active', category: 'Network', lastPing: Date.now() - 500 }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<DeviceMarker | null>(null);
  const [mapCenter] = useState({ lat: -6.2089, lng: 106.8457 });

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prevDevices =>
        prevDevices.map(device => ({
          ...device,
          lastPing: device.status === 'active' ? Date.now() : device.lastPing
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getDeviceIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      GPS: <Navigation className="h-4 w-4" />,
      RFID: <Radio className="h-4 w-4" />,
      Temperature: <Thermometer className="h-4 w-4" />,
      Security: <Camera className="h-4 w-4" />,
      Access: <Lock className="h-4 w-4" />,
      Network: <Wifi className="h-4 w-4" />
    };
    return iconMap[category] || <MapPin className="h-4 w-4" />;
  };

  const activeDevices = devices.filter(d => d.status === 'active').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-400">{activeDevices}</p>
                <p className="text-xs text-gray-500">Active Devices</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-400">{warningDevices}</p>
                <p className="text-xs text-gray-500">Warning</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-400">{devices.length}</p>
                <p className="text-xs text-gray-500">Total Devices</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Visualization */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cyan-400" />
              Live Device Map
            </CardTitle>
            <CardDescription>Real-time GPS tracking of IoT devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[400px] bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
              {/* Simulated Map Grid */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-gray-700/30" />
                ))}
              </div>

              {/* Map Center Indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-cyan-500/30 rounded-full animate-ping" />
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Device Markers */}
              {devices.map((device, index) => {
                const x = 50 + (device.lng - mapCenter.lng) * 10000;
                const y = 50 + (mapCenter.lat - device.lat) * 10000;
                
                return (
                  <div
                    key={device.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`
                    }}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className={`relative ${selectedDevice?.id === device.id ? 'z-50' : 'z-10'}`}>
                      {/* Ping Animation for Active Devices */}
                      {device.status === 'active' && (
                        <div className={`absolute -inset-2 ${getStatusColor(device.status)} rounded-full opacity-30 animate-ping`} />
                      )}
                      
                      {/* Device Marker */}
                      <div className={`relative w-8 h-8 ${getStatusColor(device.status)} rounded-full flex items-center justify-center shadow-lg border-2 border-white/30`}>
                        {getDeviceIcon(device.category)}
                      </div>

                      {/* Device Label */}
                      {selectedDevice?.id === device.id && (
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-gray-900 border border-cyan-500 rounded-lg px-3 py-2 shadow-xl">
                            <p className="text-xs font-semibold text-white">{device.name}</p>
                            <p className="text-xs text-gray-400">{device.category}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-gray-900/90 border border-gray-700 rounded-lg p-3 text-xs">
                <p className="font-semibold text-white mb-2">Status Legend</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-gray-400">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span className="text-gray-400">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-gray-400">Inactive</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device List */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm">Device List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {devices.map(device => (
                <button
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedDevice?.id === device.id
                      ? 'bg-cyan-500/20 border-cyan-500 border'
                      : 'bg-gray-800/50 border-gray-700 border hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.category)}
                      <span className="text-sm font-medium text-white">{device.name}</span>
                    </div>
                    {getStatusIcon(device.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{device.category}</span>
                    <Badge variant="outline" className="text-xs">
                      {device.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Last ping: {Math.floor((Date.now() - device.lastPing) / 1000)}s ago
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
