'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  Users, 
  Wind, 
  Zap, 
  Shield,
  MapPin,
  Activity,
  Download,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import type { IoTDevice } from '@/lib/phase1-iot-network';
import { 
  IOT_DEVICES, 
  generateSensorUpdate, 
  getAlertLevel,
  exportIoTData
} from '@/lib/phase1-iot-network';

export function IoTNetworkMonitor() {
  const [devices, setDevices] = useState<IoTDevice[]>(IOT_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);

  useEffect(() => {
    // Simulate real-time updates every 3 seconds
    const interval = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => generateSensorUpdate(device))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleExportData = (): void => {
    const data = exportIoTData(devices);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iot-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDeviceIcon = (type: IoTDevice['type']): JSX.Element => {
    const icons: Record<IoTDevice['type'], JSX.Element> = {
      temperature: <Thermometer className="h-5 w-5" />,
      crowd: <Users className="h-5 w-5" />,
      air_quality: <Wind className="h-5 w-5" />,
      energy: <Zap className="h-5 w-5" />,
      access_control: <Shield className="h-5 w-5" />
    };
    return icons[type];
  };

  const getAlertColor = (device: IoTDevice): string => {
    const level = getAlertLevel(device);
    if (level === 'critical') return 'red';
    if (level === 'warning') return 'orange';
    return 'green';
  };

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const devicesWithAlerts = devices.filter(d => d.data.alert).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <NeonCard glowColor="blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Devices</p>
              <p className="text-3xl font-bold text-blue-400">{devices.length}</p>
            </div>
            <Activity className="h-12 w-12 text-blue-400" />
          </div>
        </NeonCard>

        <NeonCard glowColor="green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Online</p>
              <p className="text-3xl font-bold text-green-400">{onlineDevices}</p>
            </div>
            <CheckCircle2 className="h-12 w-12 text-green-400" />
          </div>
        </NeonCard>

        <NeonCard glowColor={devicesWithAlerts > 0 ? "orange" : "green"}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Alerts</p>
              <p className={`text-3xl font-bold ${devicesWithAlerts > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                {devicesWithAlerts}
              </p>
            </div>
            {devicesWithAlerts > 0 ? (
              <AlertTriangle className="h-12 w-12 text-orange-400" />
            ) : (
              <CheckCircle2 className="h-12 w-12 text-green-400" />
            )}
          </div>
        </NeonCard>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-white">Live IoT Devices</h3>
        <NeonButton variant="secondary" onClick={handleExportData}>
          <Download className="h-4 w-4" />
          Export Data
        </NeonButton>
      </div>

      {/* Device Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <NeonCard 
            key={device.id} 
            glowColor={getAlertColor(device)}
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedDevice(device)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${getAlertColor(device)}-500/20`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">{device.name}</h4>
                    <p className="text-xs text-gray-400">{device.location}</p>
                  </div>
                </div>
                <Badge 
                  className={`bg-${device.status === 'online' ? 'green' : 'gray'}-500/20 text-${device.status === 'online' ? 'green' : 'gray'}-400 border-${device.status === 'online' ? 'green' : 'gray'}-500/50`}
                >
                  {device.status}
                </Badge>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-400 text-sm">Current Reading</span>
                  <div className="text-right">
                    <span className={`text-2xl font-bold text-${getAlertColor(device)}-400`}>
                      {device.data.value}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">{device.data.unit}</span>
                  </div>
                </div>

                {device.data.threshold && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className={`bg-${getAlertColor(device)}-500 h-2 rounded-full transition-all`}
                        style={{ 
                          width: `${Math.min(100, (device.data.value / device.data.threshold.max) * 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{device.data.threshold.min}</span>
                      <span>{device.data.threshold.max}</span>
                    </div>
                  </div>
                )}

                {device.data.alert && (
                  <div className="mt-3 flex items-center gap-2 text-orange-400 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Threshold exceeded</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>Updated {Math.floor((Date.now() - device.lastUpdate) / 1000)}s ago</span>
              </div>
            </div>
          </NeonCard>
        ))}
      </div>

      {/* Device Detail Modal */}
      {selectedDevice && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedDevice(null)}
        >
          <NeonCard 
            glowColor={getAlertColor(selectedDevice)} 
            className="max-w-2xl w-full"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-${getAlertColor(selectedDevice)}-500/20`}>
                    {getDeviceIcon(selectedDevice.type)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedDevice.name}</h3>
                    <p className="text-gray-400">{selectedDevice.location}</p>
                  </div>
                </div>
                <NeonButton 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setSelectedDevice(null)}
                >
                  Close
                </NeonButton>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Device Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Device ID:</span>
                      <span className="text-gray-300">{selectedDevice.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-gray-300 capitalize">{selectedDevice.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <Badge className={`bg-${selectedDevice.status === 'online' ? 'green' : 'gray'}-500/20 text-${selectedDevice.status === 'online' ? 'green' : 'gray'}-400`}>
                        {selectedDevice.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Coordinates:</span>
                      <span className="text-gray-300 text-xs">
                        {selectedDevice.coordinates.lat.toFixed(4)}, {selectedDevice.coordinates.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Current Reading</h4>
                  <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-800 text-center">
                    <p className={`text-5xl font-bold text-${getAlertColor(selectedDevice)}-400`}>
                      {selectedDevice.data.value}
                    </p>
                    <p className="text-gray-400 mt-2">{selectedDevice.data.unit}</p>
                  </div>
                  {selectedDevice.data.threshold && (
                    <div className="text-sm text-gray-400">
                      <p>Safe Range: {selectedDevice.data.threshold.min} - {selectedDevice.data.threshold.max} {selectedDevice.data.unit}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedDevice.data.alert && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-orange-400" />
                    <div>
                      <h5 className="font-semibold text-orange-400">Alert: Threshold Exceeded</h5>
                      <p className="text-sm text-gray-400">
                        Current reading is outside the safe operating range. Please check the device and take appropriate action.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </NeonCard>
        </div>
      )}
    </div>
  );
}
