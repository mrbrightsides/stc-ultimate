'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi,
  Shield,
  Zap,
  MapPin,
  Eye,
  Fingerprint,
  CreditCard,
  Smartphone,
  Camera,
  Lock,
  Thermometer,
  Volume2,
  Lightbulb,
  Car,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';

// Enhanced IoT Device Types
export type IoTDeviceType = 
  | 'nfc-reader'
  | 'rfid-scanner' 
  | 'qr-scanner'
  | 'biometric-scanner'
  | 'gps-tracker'
  | 'motion-sensor'
  | 'proximity-sensor'
  | 'voice-assistant'
  | 'smart-lock'
  | 'environmental-sensor'
  | 'vehicle-sensor'
  | 'payment-terminal'
  | 'facial-recognition'
  | 'smart-thermostat'
  | 'beacon-transmitter';

export type IoTScenario = 
  | 'hotel-checkin'
  | 'hotel-room-access'
  | 'hotel-service-request'
  | 'hotel-checkout'
  | 'airport-checkin'
  | 'flight-boarding'
  | 'restaurant-ordering'
  | 'transport-boarding'
  | 'attraction-entry'
  | 'emergency-assistance';

export interface IoTDevice {
  id: string;
  name: string;
  type: IoTDeviceType;
  status: 'idle' | 'active' | 'processing' | 'completed' | 'error';
  responseTime: number;
  accuracy: number;
  batteryLevel?: number;
  signalStrength: number;
  lastActivity: Date;
  location: string;
  icon: React.ReactNode;
  description: string;
}

export interface IoTScenarioConfig {
  id: string;
  name: string;
  scenario: IoTScenario;
  devices: IoTDevice[];
  steps: IoTStep[];
  estimatedDuration: number;
  complexity: 'low' | 'medium' | 'high';
  description: string;
}

export interface IoTStep {
  id: string;
  name: string;
  deviceId: string;
  duration: number;
  description: string;
  requiredData?: string[];
  failureRate: number;
}

export interface IoTSimulationResult {
  scenarioId: string;
  totalDuration: number;
  stepResults: Array<{
    stepId: string;
    success: boolean;
    duration: number;
    deviceResponse: number;
    errorMessage?: string;
  }>;
  overallSuccess: boolean;
  dataCollected: Record<string, any>;
}

interface EnhancedIoTDeviceSystemProps {
  onScenarioComplete?: (result: IoTSimulationResult) => void;
  onDeviceInteraction?: (deviceId: string, data: any) => void;
  selectedScenario?: IoTScenario;
  autoStart?: boolean;
}

const EnhancedIoTDeviceSystem: React.FC<EnhancedIoTDeviceSystemProps> = ({
  onScenarioComplete,
  onDeviceInteraction,
  selectedScenario = 'hotel-checkin',
  autoStart = false
}) => {
  // Device configurations
  const deviceConfigs: Record<IoTDeviceType, Partial<IoTDevice>> = {
    'nfc-reader': {
      name: 'NFC Reader',
      icon: <CreditCard className="h-4 w-4" />,
      description: 'Near-field communication reader for contactless interactions'
    },
    'rfid-scanner': {
      name: 'RFID Scanner',
      icon: <Shield className="h-4 w-4" />,
      description: 'Radio frequency identification scanner'
    },
    'qr-scanner': {
      name: 'QR Scanner',
      icon: <Camera className="h-4 w-4" />,
      description: 'Quick response code scanner'
    },
    'biometric-scanner': {
      name: 'Biometric Scanner',
      icon: <Fingerprint className="h-4 w-4" />,
      description: 'Fingerprint and biometric authentication'
    },
    'gps-tracker': {
      name: 'GPS Tracker',
      icon: <MapPin className="h-4 w-4" />,
      description: 'Global positioning system tracker'
    },
    'motion-sensor': {
      name: 'Motion Sensor',
      icon: <Activity className="h-4 w-4" />,
      description: 'Motion detection and tracking sensor'
    },
    'proximity-sensor': {
      name: 'Proximity Sensor',
      icon: <Zap className="h-4 w-4" />,
      description: 'Proximity detection sensor'
    },
    'voice-assistant': {
      name: 'Voice Assistant',
      icon: <Volume2 className="h-4 w-4" />,
      description: 'Voice recognition and response system'
    },
    'smart-lock': {
      name: 'Smart Lock',
      icon: <Lock className="h-4 w-4" />,
      description: 'Electronic lock with remote control'
    },
    'environmental-sensor': {
      name: 'Environmental Sensor',
      icon: <Thermometer className="h-4 w-4" />,
      description: 'Temperature, humidity, air quality monitoring'
    },
    'vehicle-sensor': {
      name: 'Vehicle Sensor',
      icon: <Car className="h-4 w-4" />,
      description: 'Vehicle identification and tracking'
    },
    'payment-terminal': {
      name: 'Payment Terminal',
      icon: <CreditCard className="h-4 w-4" />,
      description: 'Contactless payment processing'
    },
    'facial-recognition': {
      name: 'Facial Recognition',
      icon: <Eye className="h-4 w-4" />,
      description: 'AI-powered facial recognition system'
    },
    'smart-thermostat': {
      name: 'Smart Thermostat',
      icon: <Thermometer className="h-4 w-4" />,
      description: 'Climate control automation'
    },
    'beacon-transmitter': {
      name: 'Beacon Transmitter',
      icon: <Wifi className="h-4 w-4" />,
      description: 'Location beacon for proximity services'
    }
  };

  // Scenario configurations
  const scenarioConfigs: Record<IoTScenario, Omit<IoTScenarioConfig, 'devices'> & { deviceTypes: IoTDeviceType[] }> = {
    'hotel-checkin': {
      id: 'hotel-checkin',
      name: 'Hotel Check-in Process',
      scenario: 'hotel-checkin',
      deviceTypes: ['qr-scanner', 'facial-recognition', 'rfid-scanner', 'payment-terminal'],
      steps: [
        { id: 'arrival', name: 'Guest Arrival Detection', deviceId: 'proximity-1', duration: 1000, description: 'Detect guest approach', failureRate: 0.02 },
        { id: 'identity', name: 'Identity Verification', deviceId: 'facial-recognition-1', duration: 2000, description: 'Verify guest identity', failureRate: 0.05 },
        { id: 'booking', name: 'Booking Confirmation', deviceId: 'qr-scanner-1', duration: 1500, description: 'Scan booking QR code', failureRate: 0.03 },
        { id: 'keycard', name: 'Key Card Programming', deviceId: 'rfid-scanner-1', duration: 2500, description: 'Program room access card', failureRate: 0.01 },
        { id: 'payment', name: 'Payment Authorization', deviceId: 'payment-terminal-1', duration: 3000, description: 'Process payment hold', failureRate: 0.04 }
      ],
      estimatedDuration: 10000,
      complexity: 'medium',
      description: 'Complete hotel check-in with identity verification and key card programming'
    },
    'hotel-room-access': {
      id: 'hotel-room-access',
      name: 'Hotel Room Access',
      scenario: 'hotel-room-access',
      deviceTypes: ['nfc-reader', 'smart-lock', 'motion-sensor', 'smart-thermostat'],
      steps: [
        { id: 'approach', name: 'Room Approach', deviceId: 'motion-sensor-1', duration: 500, description: 'Detect guest approach to room', failureRate: 0.01 },
        { id: 'card-scan', name: 'Key Card Scan', deviceId: 'nfc-reader-1', duration: 1000, description: 'Scan NFC key card', failureRate: 0.03 },
        { id: 'unlock', name: 'Door Unlock', deviceId: 'smart-lock-1', duration: 1500, description: 'Unlock room door', failureRate: 0.02 },
        { id: 'environment', name: 'Environment Setup', deviceId: 'smart-thermostat-1', duration: 2000, description: 'Set room temperature and lighting', failureRate: 0.01 }
      ],
      estimatedDuration: 5000,
      complexity: 'low',
      description: 'Automated room access with environmental controls'
    },
    'hotel-service-request': {
      id: 'hotel-service-request',
      name: 'Hotel Service Request',
      scenario: 'hotel-service-request',
      deviceTypes: ['voice-assistant', 'beacon-transmitter', 'payment-terminal'],
      steps: [
        { id: 'voice-activation', name: 'Voice Command', deviceId: 'voice-assistant-1', duration: 1500, description: 'Process voice service request', failureRate: 0.08 },
        { id: 'location-verify', name: 'Location Verification', deviceId: 'beacon-transmitter-1', duration: 1000, description: 'Verify guest room location', failureRate: 0.02 },
        { id: 'service-dispatch', name: 'Service Dispatch', deviceId: 'beacon-transmitter-1', duration: 2000, description: 'Route to service team', failureRate: 0.03 },
        { id: 'payment-process', name: 'Service Payment', deviceId: 'payment-terminal-1', duration: 2500, description: 'Process service payment', failureRate: 0.04 }
      ],
      estimatedDuration: 7000,
      complexity: 'medium',
      description: 'Voice-activated hotel service requests with automated routing'
    },
    'hotel-checkout': {
      id: 'hotel-checkout',
      name: 'Hotel Checkout Process',
      scenario: 'hotel-checkout',
      deviceTypes: ['rfid-scanner', 'environmental-sensor', 'payment-terminal', 'facial-recognition'],
      steps: [
        { id: 'keycard-return', name: 'Key Card Return', deviceId: 'rfid-scanner-1', duration: 1000, description: 'Return and deactivate key card', failureRate: 0.02 },
        { id: 'room-inspection', name: 'Room Status Check', deviceId: 'environmental-sensor-1', duration: 3000, description: 'Automated room condition check', failureRate: 0.05 },
        { id: 'bill-calculation', name: 'Final Bill Processing', deviceId: 'payment-terminal-1', duration: 2000, description: 'Calculate and process final bill', failureRate: 0.03 },
        { id: 'departure-confirm', name: 'Departure Confirmation', deviceId: 'facial-recognition-1', duration: 1500, description: 'Confirm guest departure', failureRate: 0.02 }
      ],
      estimatedDuration: 7500,
      complexity: 'medium',
      description: 'Automated checkout with room inspection and billing'
    },
    'airport-checkin': {
      id: 'airport-checkin',
      name: 'Airport Check-in',
      scenario: 'airport-checkin',
      deviceTypes: ['qr-scanner', 'biometric-scanner', 'rfid-scanner'],
      steps: [
        { id: 'ticket-scan', name: 'Ticket Scanning', deviceId: 'qr-scanner-1', duration: 1500, description: 'Scan boarding pass QR code', failureRate: 0.03 },
        { id: 'biometric-check', name: 'Biometric Verification', deviceId: 'biometric-scanner-1', duration: 3000, description: 'Verify passenger biometrics', failureRate: 0.06 },
        { id: 'baggage-tag', name: 'Baggage Tagging', deviceId: 'rfid-scanner-1', duration: 2000, description: 'RFID baggage tag assignment', failureRate: 0.04 }
      ],
      estimatedDuration: 6500,
      complexity: 'high',
      description: 'Automated airport check-in with biometric verification'
    },
    'flight-boarding': {
      id: 'flight-boarding',
      name: 'Flight Boarding',
      scenario: 'flight-boarding',
      deviceTypes: ['qr-scanner', 'facial-recognition', 'beacon-transmitter'],
      steps: [
        { id: 'boarding-pass', name: 'Boarding Pass Scan', deviceId: 'qr-scanner-1', duration: 1000, description: 'Scan boarding pass', failureRate: 0.02 },
        { id: 'face-match', name: 'Facial Recognition', deviceId: 'facial-recognition-1', duration: 2000, description: 'Match face to ID', failureRate: 0.04 },
        { id: 'seat-guidance', name: 'Seat Guidance', deviceId: 'beacon-transmitter-1', duration: 1500, description: 'Guide to seat location', failureRate: 0.01 }
      ],
      estimatedDuration: 4500,
      complexity: 'medium',
      description: 'Automated flight boarding with seat guidance'
    },
    'restaurant-ordering': {
      id: 'restaurant-ordering',
      name: 'Restaurant Ordering',
      scenario: 'restaurant-ordering',
      deviceTypes: ['qr-scanner', 'beacon-transmitter', 'payment-terminal'],
      steps: [
        { id: 'table-detection', name: 'Table Detection', deviceId: 'beacon-transmitter-1', duration: 800, description: 'Detect customer seating', failureRate: 0.02 },
        { id: 'menu-scan', name: 'Menu QR Scan', deviceId: 'qr-scanner-1', duration: 1200, description: 'Scan table menu QR code', failureRate: 0.03 },
        { id: 'order-payment', name: 'Order Payment', deviceId: 'payment-terminal-1', duration: 2500, description: 'Process order payment', failureRate: 0.04 }
      ],
      estimatedDuration: 4500,
      complexity: 'low',
      description: 'Table-based restaurant ordering system'
    },
    'transport-boarding': {
      id: 'transport-boarding',
      name: 'Transport Boarding',
      scenario: 'transport-boarding',
      deviceTypes: ['nfc-reader', 'vehicle-sensor', 'gps-tracker'],
      steps: [
        { id: 'ticket-tap', name: 'Ticket Tap', deviceId: 'nfc-reader-1', duration: 800, description: 'NFC ticket validation', failureRate: 0.02 },
        { id: 'vehicle-detect', name: 'Vehicle Detection', deviceId: 'vehicle-sensor-1', duration: 1500, description: 'Detect transport vehicle', failureRate: 0.03 },
        { id: 'route-tracking', name: 'Route Tracking', deviceId: 'gps-tracker-1', duration: 1000, description: 'Track vehicle route', failureRate: 0.01 }
      ],
      estimatedDuration: 3300,
      complexity: 'low',
      description: 'Public transport boarding and tracking'
    },
    'attraction-entry': {
      id: 'attraction-entry',
      name: 'Attraction Entry',
      scenario: 'attraction-entry',
      deviceTypes: ['qr-scanner', 'beacon-transmitter', 'motion-sensor'],
      steps: [
        { id: 'ticket-validate', name: 'Ticket Validation', deviceId: 'qr-scanner-1', duration: 1200, description: 'Validate entry ticket', failureRate: 0.03 },
        { id: 'crowd-management', name: 'Crowd Detection', deviceId: 'motion-sensor-1', duration: 1800, description: 'Monitor crowd density', failureRate: 0.02 },
        { id: 'guide-beacon', name: 'Guide Beacon', deviceId: 'beacon-transmitter-1', duration: 1000, description: 'Provide location-based info', failureRate: 0.01 }
      ],
      estimatedDuration: 4000,
      complexity: 'medium',
      description: 'Tourist attraction entry with crowd management'
    },
    'emergency-assistance': {
      id: 'emergency-assistance',
      name: 'Emergency Assistance',
      scenario: 'emergency-assistance',
      deviceTypes: ['voice-assistant', 'gps-tracker', 'beacon-transmitter', 'motion-sensor'],
      steps: [
        { id: 'distress-detection', name: 'Distress Detection', deviceId: 'voice-assistant-1', duration: 1000, description: 'Detect emergency call', failureRate: 0.01 },
        { id: 'location-pinpoint', name: 'Location Identification', deviceId: 'gps-tracker-1', duration: 1500, description: 'Pinpoint exact location', failureRate: 0.02 },
        { id: 'alert-broadcast', name: 'Emergency Alert', deviceId: 'beacon-transmitter-1', duration: 800, description: 'Broadcast emergency alert', failureRate: 0.01 },
        { id: 'response-dispatch', name: 'Response Dispatch', deviceId: 'motion-sensor-1', duration: 2000, description: 'Guide emergency response', failureRate: 0.01 }
      ],
      estimatedDuration: 5300,
      complexity: 'high',
      description: 'Emergency assistance with rapid response coordination'
    }
  };

  const [currentScenario, setCurrentScenario] = useState<IoTScenario>(selectedScenario);
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [simulationResults, setSimulationResults] = useState<IoTSimulationResult | null>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState<Date>(new Date());

  // Initialize devices based on selected scenario
  useEffect(() => {
    const config = scenarioConfigs[currentScenario];
    if (!config) return;

    const newDevices: IoTDevice[] = config.deviceTypes.map((deviceType, index) => ({
      id: `${deviceType}-${index + 1}`,
      type: deviceType,
      status: 'idle',
      responseTime: Math.random() * 500 + 100,
      accuracy: Math.random() * 15 + 85,
      batteryLevel: Math.random() * 30 + 70,
      signalStrength: Math.random() * 30 + 70,
      lastActivity: new Date(),
      location: `Zone ${String.fromCharCode(65 + index)}`,
      ...deviceConfigs[deviceType]
    })) as IoTDevice[];

    setDevices(newDevices);
    setCurrentStep(-1);
    setSimulationProgress(0);
    setSimulationResults(null);
  }, [currentScenario]);

  // Auto-start simulation
  useEffect(() => {
    if (autoStart && !simulationActive && devices.length > 0) {
      handleStartSimulation();
    }
  }, [autoStart, devices, simulationActive]);

  const handleStartSimulation = async (): Promise<void> => {
    if (simulationActive || devices.length === 0) return;

    const config = scenarioConfigs[currentScenario];
    if (!config) return;

    setSimulationActive(true);
    setSimulationResults(null);
    setCurrentStep(0);

    const stepResults: IoTSimulationResult['stepResults'] = [];
    const startTime = Date.now();

    try {
      for (let i = 0; i < config.steps.length; i++) {
        const step = config.steps[i];
        setCurrentStep(i);
        
        // Update progress
        setSimulationProgress((i / config.steps.length) * 100);

        // Find corresponding device
        const device = devices.find(d => d.id.includes(step.deviceId.split('-')[0]));
        if (!device) continue;

        // Update device status
        setDevices(prev => prev.map(d => 
          d.id === device.id 
            ? { ...d, status: 'processing', lastActivity: new Date() }
            : d
        ));

        // Simulate step execution
        await new Promise(resolve => setTimeout(resolve, step.duration));

        // Simulate potential failure
        const failed = Math.random() < step.failureRate;
        const stepDuration = step.duration + (Math.random() * 500 - 250);

        stepResults.push({
          stepId: step.id,
          success: !failed,
          duration: stepDuration,
          deviceResponse: device.responseTime,
          errorMessage: failed ? `${device.name} communication timeout` : undefined
        });

        // Update device status
        setDevices(prev => prev.map(d => 
          d.id === device.id 
            ? { 
                ...d, 
                status: failed ? 'error' : 'completed',
                lastActivity: new Date(),
                responseTime: device.responseTime + (Math.random() * 100 - 50)
              }
            : d
        ));

        // Handle device interaction callback
        if (onDeviceInteraction && !failed) {
          onDeviceInteraction(device.id, {
            stepId: step.id,
            deviceType: device.type,
            responseTime: device.responseTime,
            timestamp: new Date()
          });
        }

        // If step failed and it's critical, stop simulation
        if (failed && step.failureRate > 0.05) {
          break;
        }
      }

      const totalDuration = Date.now() - startTime;
      const overallSuccess = stepResults.every(result => result.success);

      const result: IoTSimulationResult = {
        scenarioId: config.id,
        totalDuration,
        stepResults,
        overallSuccess,
        dataCollected: {
          devicePerformance: devices.map(d => ({
            deviceId: d.id,
            responseTime: d.responseTime,
            accuracy: d.accuracy,
            batteryLevel: d.batteryLevel
          })),
          scenarioMetrics: {
            complexity: config.complexity,
            estimatedDuration: config.estimatedDuration,
            actualDuration: totalDuration
          }
        }
      };

      setSimulationResults(result);
      setSimulationProgress(100);

      // Callback with results
      if (onScenarioComplete) {
        onScenarioComplete(result);
      }

    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setSimulationActive(false);
      setCurrentStep(-1);
      
      // Reset device statuses after a delay
      setTimeout(() => {
        setDevices(prev => prev.map(d => ({ ...d, status: 'idle' })));
      }, 2000);
    }
  };

  const getStatusColor = (status: IoTDevice['status']): string => {
    switch (status) {
      case 'idle': return 'text-gray-400';
      case 'active': return 'text-blue-400';
      case 'processing': return 'text-orange-400';
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadgeVariant = (status: IoTDevice['status']) => {
    switch (status) {
      case 'idle': return 'secondary';
      case 'active': return 'default';
      case 'processing': return 'default';
      case 'completed': return 'default';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const currentConfig = scenarioConfigs[currentScenario];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-neon-blue mb-1">IoT Device System</h3>
          <p className="text-gray-400">
            {currentConfig?.name} - {devices.length} connected devices
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="border-neon-green/50 text-neon-green">
            {currentConfig?.complexity.toUpperCase()} COMPLEXITY
          </Badge>
          <Badge variant={simulationActive ? "default" : "secondary"}>
            {simulationActive ? 'RUNNING' : 'READY'}
          </Badge>
        </div>
      </div>

      {/* Simulation Progress */}
      {(simulationActive || simulationResults) && (
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-neon-blue flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Simulation Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(simulationProgress)}%</span>
                </div>
                <Progress value={simulationProgress} className="h-2" />
              </div>
              
              {currentStep >= 0 && currentConfig && (
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-orange-400">
                    <Clock className="h-4 w-4" />
                    Current: {currentConfig.steps[currentStep]?.name}
                  </div>
                </div>
              )}
              
              {simulationResults && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-neon-green">
                      {simulationResults.totalDuration}ms
                    </div>
                    <div className="text-xs text-gray-400">Total Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-neon-blue">
                      {simulationResults.stepResults.filter(r => r.success).length}
                    </div>
                    <div className="text-xs text-gray-400">Successful Steps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">
                      {Math.round(simulationResults.stepResults.reduce((sum, r) => sum + r.deviceResponse, 0) / simulationResults.stepResults.length)}ms
                    </div>
                    <div className="text-xs text-gray-400">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${simulationResults.overallSuccess ? 'text-green-400' : 'text-red-400'}`}>
                      {simulationResults.overallSuccess ? 'SUCCESS' : 'FAILED'}
                    </div>
                    <div className="text-xs text-gray-400">Status</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.map((device) => (
          <Card key={device.id} className="bg-black/40 border-gray-700 hover:border-neon-blue/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`${getStatusColor(device.status)}`}>
                  {device.icon}
                </div>
                <Badge variant={getStatusBadgeVariant(device.status)} className="text-xs">
                  {device.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-white text-sm">{device.name}</h4>
                <p className="text-xs text-gray-400 line-clamp-2">{device.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-gray-400">Response</div>
                    <div className="text-neon-green">{Math.round(device.responseTime)}ms</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Accuracy</div>
                    <div className="text-neon-blue">{Math.round(device.accuracy)}%</div>
                  </div>
                  {device.batteryLevel && (
                    <div>
                      <div className="text-gray-400">Battery</div>
                      <div className={`${device.batteryLevel > 50 ? 'text-green-400' : device.batteryLevel > 20 ? 'text-orange-400' : 'text-red-400'}`}>
                        {Math.round(device.batteryLevel)}%
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-400">Signal</div>
                    <div className="text-neon-green">{Math.round(device.signalStrength)}%</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Location: {device.location}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scenario Steps */}
      {currentConfig && (
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-neon-blue">Scenario Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentConfig.steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    index === currentStep 
                      ? 'border-orange-500/50 bg-orange-500/10' 
                      : index < currentStep 
                        ? 'border-green-500/50 bg-green-500/10'
                        : 'border-gray-700 bg-black/20'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : index === currentStep ? (
                      <Clock className="h-5 w-5 text-orange-400" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-white">{step.name}</h5>
                        <p className="text-sm text-gray-400">{step.description}</p>
                      </div>
                      <div className="text-xs text-gray-500 ml-4">
                        {step.duration}ms
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleStartSimulation}
                disabled={simulationActive || devices.length === 0}
                className="px-6 py-2 bg-neon-green hover:bg-neon-green/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
              >
                {simulationActive ? 'Simulation Running...' : 'Start IoT Simulation'}
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedIoTDeviceSystem;