/**
 * Phase 1: IoT Device Network
 * Real-time sensor data management and streaming
 */

export interface IoTDevice {
  id: string;
  name: string;
  type: 'temperature' | 'crowd' | 'air_quality' | 'energy' | 'access_control';
  location: string;
  coordinates: { lat: number; lng: number };
  status: 'online' | 'offline' | 'error';
  lastUpdate: number;
  data: IoTSensorData;
}

export interface IoTSensorData {
  value: number;
  unit: string;
  threshold?: { min: number; max: number };
  alert?: boolean;
}

/**
 * Simulated IoT device network
 * In production, this would connect to real IoT devices via gRPC
 */
export const IOT_DEVICES: IoTDevice[] = [
  {
    id: 'temp-001',
    name: 'Borobudur Temple - Temperature Sensor',
    type: 'temperature',
    location: 'Borobudur Temple, Central Java',
    coordinates: { lat: -7.6079, lng: 110.2038 },
    status: 'online',
    lastUpdate: Date.now(),
    data: {
      value: 28.5,
      unit: '°C',
      threshold: { min: 20, max: 35 },
      alert: false
    }
  },
  {
    id: 'crowd-001',
    name: 'Borobudur - Crowd Density',
    type: 'crowd',
    location: 'Borobudur Temple, Central Java',
    coordinates: { lat: -7.6079, lng: 110.2038 },
    status: 'online',
    lastUpdate: Date.now(),
    data: {
      value: 450,
      unit: 'people',
      threshold: { min: 0, max: 1000 },
      alert: false
    }
  },
  {
    id: 'air-001',
    name: 'Prambanan - Air Quality Index',
    type: 'air_quality',
    location: 'Prambanan Temple, Yogyakarta',
    coordinates: { lat: -7.7520, lng: 110.4914 },
    status: 'online',
    lastUpdate: Date.now(),
    data: {
      value: 42,
      unit: 'AQI',
      threshold: { min: 0, max: 100 },
      alert: false
    }
  },
  {
    id: 'temp-002',
    name: 'Raja Ampat - Water Temperature',
    type: 'temperature',
    location: 'Raja Ampat, West Papua',
    coordinates: { lat: -0.2349, lng: 130.5203 },
    status: 'online',
    lastUpdate: Date.now(),
    data: {
      value: 27.8,
      unit: '°C',
      threshold: { min: 25, max: 30 },
      alert: false
    }
  },
  {
    id: 'crowd-002',
    name: 'Tanah Lot - Visitor Count',
    type: 'crowd',
    location: 'Tanah Lot Temple, Bali',
    coordinates: { lat: -8.6211, lng: 115.0868 },
    status: 'online',
    lastUpdate: Date.now(),
    data: {
      value: 820,
      unit: 'people',
      threshold: { min: 0, max: 1500 },
      alert: false
    }
  },
  {
    id: 'air-002',
    name: 'Ubud - Air Quality Monitor',
    type: 'air_quality',
    location: 'Ubud, Bali',
    coordinates: { lat: -8.5069, lng: 115.2625 },
    status: 'online',
    lastUpdate: Date.now(),
    data: {
      value: 38,
      unit: 'AQI',
      threshold: { min: 0, max: 100 },
      alert: false
    }
  },
  {
    id: 'energy-001',
    name: 'Komodo National Park - Solar Panel',
    type: 'energy',
    location: 'Komodo National Park, NTT',
    coordinates: { lat: -8.5569, lng: 119.4872 },
    status: 'online',
    lastUpdate: Date.now(),
    data: {
      value: 4.2,
      unit: 'kW',
      threshold: { min: 0, max: 6 },
      alert: false
    }
  },
  {
    id: 'access-001',
    name: 'Rinjani Base Camp - Access Control',
    type: 'access_control',
    location: 'Mount Rinjani, Lombok',
    coordinates: { lat: -8.4111, lng: 116.4572 },
    status: 'online',
    lastUpdate: Date.now(),
    data: {
      value: 45,
      unit: 'entries/hour',
      threshold: { min: 0, max: 100 },
      alert: false
    }
  }
];

/**
 * Simulate real-time IoT data updates
 */
export function generateSensorUpdate(device: IoTDevice): IoTDevice {
  const { type, data } = device;
  let newValue = data.value;
  
  switch (type) {
    case 'temperature':
      // Random fluctuation ±2°C
      newValue = data.value + (Math.random() - 0.5) * 4;
      break;
    case 'crowd':
      // Random change ±50 people
      newValue = Math.max(0, data.value + (Math.random() - 0.5) * 100);
      break;
    case 'air_quality':
      // Random change ±5 AQI
      newValue = Math.max(0, Math.min(500, data.value + (Math.random() - 0.5) * 10));
      break;
    case 'energy':
      // Random change ±0.5 kW
      newValue = Math.max(0, data.value + (Math.random() - 0.5) * 1);
      break;
    case 'access_control':
      // Random change ±10 entries
      newValue = Math.max(0, data.value + (Math.random() - 0.5) * 20);
      break;
  }

  // Check for threshold alerts
  const alert = data.threshold
    ? newValue < data.threshold.min || newValue > data.threshold.max
    : false;

  return {
    ...device,
    lastUpdate: Date.now(),
    data: {
      ...data,
      value: parseFloat(newValue.toFixed(2)),
      alert
    }
  };
}

/**
 * Get device icon based on type
 */
export function getDeviceIcon(type: IoTDevice['type']): string {
  const icons: Record<IoTDevice['type'], string> = {
    temperature: 'Thermometer',
    crowd: 'Users',
    air_quality: 'Wind',
    energy: 'Zap',
    access_control: 'Shield'
  };
  return icons[type];
}

/**
 * Get device status color
 */
export function getDeviceStatusColor(status: IoTDevice['status']): string {
  const colors: Record<IoTDevice['status'], string> = {
    online: 'green',
    offline: 'gray',
    error: 'red'
  };
  return colors[status];
}

/**
 * Get alert level based on data
 */
export function getAlertLevel(device: IoTDevice): 'normal' | 'warning' | 'critical' {
  if (!device.data.threshold || !device.data.alert) return 'normal';
  
  const { value } = device.data;
  const { min, max } = device.data.threshold;
  const range = max - min;
  
  // Critical if > 20% outside threshold
  if (value < min - range * 0.2 || value > max + range * 0.2) {
    return 'critical';
  }
  
  // Warning if outside threshold
  if (value < min || value > max) {
    return 'warning';
  }
  
  return 'normal';
}

/**
 * Export IoT data for research purposes
 */
export function exportIoTData(devices: IoTDevice[]): string {
  const data = devices.map(device => ({
    id: device.id,
    name: device.name,
    type: device.type,
    location: device.location,
    status: device.status,
    timestamp: new Date(device.lastUpdate).toISOString(),
    value: device.data.value,
    unit: device.data.unit,
    alert: device.data.alert,
    alertLevel: getAlertLevel(device)
  }));
  
  return JSON.stringify(data, null, 2);
}
