// ========================================
// GRPC IOT SERVICE - SERVER IMPLEMENTATION
// Handles real-time IoT device monitoring and control
// ========================================

export interface IoTDevice {
  deviceId: string;
  name: string;
  type: 'sensor' | 'actuator' | 'controller';
  category: 'hvac' | 'lighting' | 'security' | 'access' | 'environment' | 'network';
  status: 'online' | 'offline' | 'warning' | 'error';
  value?: number;
  unit?: string;
  location: string;
  timestamp: number;
  isActive: boolean;
  isControllable: boolean;
  metadata?: Record<string, string>;
}

export interface DeviceAlert {
  alertId: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: number;
  deviceId?: string;
  deviceName?: string;
  acknowledged: boolean;
  operatorId?: string;
}

export interface DeviceStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  warningDevices: number;
  errorDevices: number;
  systemUptime: number;
  avgResponseTime: number;
  lastUpdated: number;
  devicesByCategory: Record<string, number>;
}

/**
 * In-memory storage for IoT devices (in production, this would be a database)
 */
class IoTDeviceStorage {
  private static devices: IoTDevice[] = [
    {
      deviceId: 'hvac-001',
      name: 'Hotel Lobby HVAC',
      type: 'actuator',
      category: 'hvac',
      status: 'online',
      value: 22.5,
      unit: '°C',
      location: 'Hotel Lobby - Floor 1',
      timestamp: Date.now(),
      isActive: true,
      isControllable: true,
    },
    {
      deviceId: 'light-001',
      name: 'Main Entrance Lights',
      type: 'actuator',
      category: 'lighting',
      status: 'online',
      value: 100,
      unit: '%',
      location: 'Main Entrance',
      timestamp: Date.now(),
      isActive: true,
      isControllable: true,
    },
    {
      deviceId: 'sec-001',
      name: 'Main Gate Camera',
      type: 'sensor',
      category: 'security',
      status: 'online',
      location: 'Main Gate',
      timestamp: Date.now(),
      isActive: true,
      isControllable: false,
    },
    {
      deviceId: 'env-001',
      name: 'Temperature Sensor - Lobby',
      type: 'sensor',
      category: 'environment',
      status: 'online',
      value: 24.5,
      unit: '°C',
      location: 'Hotel Lobby',
      timestamp: Date.now(),
      isActive: true,
      isControllable: false,
    },
    {
      deviceId: 'net-001',
      name: 'WiFi Router - Lobby',
      type: 'controller',
      category: 'network',
      status: 'online',
      value: 125,
      unit: 'devices',
      location: 'Hotel Lobby',
      timestamp: Date.now(),
      isActive: true,
      isControllable: true,
    },
  ];

  private static alerts: DeviceAlert[] = [
    {
      alertId: 'alert-001',
      severity: 'warning',
      title: 'High Temperature Detected',
      message: 'HVAC Zone A temperature exceeded threshold (26.5°C)',
      timestamp: Date.now() - 300000,
      deviceId: 'hvac-003',
      deviceName: 'Guest Room HVAC Zone A',
      acknowledged: false,
    },
  ];

  static getAll(): IoTDevice[] {
    return this.devices;
  }

  static getById(deviceId: string): IoTDevice | undefined {
    return this.devices.find((d) => d.deviceId === deviceId);
  }

  static updateDevice(deviceId: string, updates: Partial<IoTDevice>): boolean {
    const index = this.devices.findIndex((d) => d.deviceId === deviceId);
    if (index !== -1) {
      this.devices[index] = {
        ...this.devices[index],
        ...updates,
        timestamp: Date.now(),
      };
      return true;
    }
    return false;
  }

  static controlDevice(deviceId: string, action: string, value?: number): boolean {
    const device = this.getById(deviceId);
    if (!device || !device.isControllable) {
      return false;
    }

    switch (action) {
      case 'on':
        this.updateDevice(deviceId, { isActive: true });
        break;
      case 'off':
        this.updateDevice(deviceId, { isActive: false });
        break;
      case 'set_value':
        if (value !== undefined) {
          this.updateDevice(deviceId, { value });
        }
        break;
      case 'reset':
        this.updateDevice(deviceId, { status: 'online', isActive: false });
        break;
      default:
        return false;
    }

    return true;
  }

  static getAllAlerts(): DeviceAlert[] {
    return this.alerts;
  }

  static addAlert(alert: DeviceAlert): void {
    this.alerts.unshift(alert);
  }

  static acknowledgeAlert(alertId: string, operatorId: string): boolean {
    const index = this.alerts.findIndex((a) => a.alertId === alertId);
    if (index !== -1) {
      this.alerts[index] = {
        ...this.alerts[index],
        acknowledged: true,
        operatorId,
      };
      return true;
    }
    return false;
  }

  static getStats(): DeviceStats {
    const devices = this.getAll();
    const devicesByCategory: Record<string, number> = {};

    devices.forEach((device) => {
      devicesByCategory[device.category] = (devicesByCategory[device.category] || 0) + 1;
    });

    return {
      totalDevices: devices.length,
      onlineDevices: devices.filter((d) => d.status === 'online').length,
      offlineDevices: devices.filter((d) => d.status === 'offline').length,
      warningDevices: devices.filter((d) => d.status === 'warning').length,
      errorDevices: devices.filter((d) => d.status === 'error').length,
      systemUptime: 99.8,
      avgResponseTime: 45.3,
      lastUpdated: Date.now(),
      devicesByCategory,
    };
  }

  // Simulate real-time device updates
  static simulateDeviceUpdates(): void {
    setInterval(() => {
      this.devices = this.devices.map((device) => {
        if (device.type === 'sensor' || device.category === 'hvac') {
          const variation = (Math.random() - 0.5) * 2;
          const newValue = device.value ? Math.max(0, device.value + variation) : undefined;
          
          return {
            ...device,
            value: newValue,
            timestamp: Date.now(),
          };
        }
        return device;
      });
    }, 5000);
  }
}

// Start device simulation
if (typeof window === 'undefined') {
  IoTDeviceStorage.simulateDeviceUpdates();
}

export { IoTDeviceStorage };
