'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Hotel,
  Key,
  CreditCard,
  Wifi,
  Thermometer,
  Volume2,
  Camera,
  Lock,
  Shield,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Users,
  Utensils,
  Car,
  Luggage,
  PhoneCall,
  Bell
} from 'lucide-react';
import EnhancedIoTDeviceSystem, { type IoTScenario, type IoTSimulationResult } from '../iot/enhanced-iot-device-system';

// Hotel Journey Types
export type HotelJourneyPhase = 
  | 'pre-arrival'
  | 'check-in'
  | 'room-access'
  | 'in-room-services'
  | 'amenities'
  | 'service-requests'
  | 'check-out'
  | 'post-departure';

export interface HotelService {
  id: string;
  name: string;
  phase: HotelJourneyPhase;
  iotScenario: IoTScenario;
  description: string;
  duration: number;
  devices: string[];
  icon: React.ReactNode;
  status: 'available' | 'in-progress' | 'completed' | 'failed';
  cost?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface HotelGuest {
  id: string;
  name: string;
  roomNumber: string;
  checkInDate: Date;
  checkOutDate: Date;
  preferences: {
    temperature: number;
    lighting: 'dim' | 'normal' | 'bright';
    wakeUpCall?: Date;
    housekeeping: 'daily' | 'every-other-day' | 'weekly';
  };
  loyaltyTier: 'standard' | 'silver' | 'gold' | 'platinum';
  services: string[];
}

export interface HotelJourneyMetrics {
  totalDuration: number;
  serviceCompletions: number;
  guestSatisfactionScore: number;
  iotDeviceEfficiency: number;
  paymentProcessingTime: number;
  energyOptimization: number;
  staffEfficiency: number;
  errorRate: number;
}

interface HotelJourneyScenariosProps {
  guestData?: Partial<HotelGuest>;
  onServiceComplete?: (serviceId: string, result: IoTSimulationResult) => void;
  onJourneyComplete?: (metrics: HotelJourneyMetrics) => void;
  autoProgressJourney?: boolean;
}

const HotelJourneyScenarios: React.FC<HotelJourneyScenariosProps> = ({
  guestData,
  onServiceComplete,
  onJourneyComplete,
  autoProgressJourney = false
}) => {
  // Default guest data
  const defaultGuest: HotelGuest = {
    id: 'guest-001',
    name: 'Alex Johnson',
    roomNumber: '1205',
    checkInDate: new Date(),
    checkOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
    preferences: {
      temperature: 22,
      lighting: 'normal',
      housekeeping: 'daily'
    },
    loyaltyTier: 'gold',
    services: []
  };

  const [guest, setGuest] = useState<HotelGuest>({ ...defaultGuest, ...guestData });
  const [currentPhase, setCurrentPhase] = useState<HotelJourneyPhase>('pre-arrival');
  const [activeService, setActiveService] = useState<string | null>(null);
  const [journeyProgress, setJourneyProgress] = useState<number>(0);
  const [journeyStartTime, setJourneyStartTime] = useState<Date>(new Date());
  const [journeyMetrics, setJourneyMetrics] = useState<HotelJourneyMetrics>({
    totalDuration: 0,
    serviceCompletions: 0,
    guestSatisfactionScore: 85,
    iotDeviceEfficiency: 92,
    paymentProcessingTime: 0,
    energyOptimization: 78,
    staffEfficiency: 89,
    errorRate: 0.03
  });

  // Define all hotel services
  const [hotelServices, setHotelServices] = useState<HotelService[]>([
    {
      id: 'mobile-checkin',
      name: 'Mobile Check-in',
      phase: 'pre-arrival',
      iotScenario: 'hotel-checkin',
      description: 'Complete check-in process remotely before arrival',
      duration: 120000, // 2 minutes
      devices: ['smartphone', 'qr-scanner', 'facial-recognition'],
      icon: <Wifi className="h-4 w-4" />,
      status: 'available',
      priority: 'medium'
    },
    {
      id: 'arrival-checkin',
      name: 'Hotel Reception Check-in',
      phase: 'check-in',
      iotScenario: 'hotel-checkin',
      description: 'Traditional front desk check-in with digital enhancements',
      duration: 300000, // 5 minutes
      devices: ['qr-scanner', 'facial-recognition', 'rfid-scanner', 'payment-terminal'],
      icon: <Hotel className="h-4 w-4" />,
      status: 'available',
      priority: 'critical'
    },
    {
      id: 'keycard-programming',
      name: 'Key Card Programming',
      phase: 'check-in',
      iotScenario: 'hotel-checkin',
      description: 'Program NFC key card with room access and amenity permissions',
      duration: 60000, // 1 minute
      devices: ['rfid-scanner', 'nfc-reader'],
      icon: <Key className="h-4 w-4" />,
      status: 'available',
      priority: 'critical'
    },
    {
      id: 'room-entry',
      name: 'Room Access',
      phase: 'room-access',
      iotScenario: 'hotel-room-access',
      description: 'Unlock room and initialize personalized environment',
      duration: 45000, // 45 seconds
      devices: ['nfc-reader', 'smart-lock', 'motion-sensor', 'smart-thermostat'],
      icon: <Lock className="h-4 w-4" />,
      status: 'available',
      priority: 'critical'
    },
    {
      id: 'room-personalization',
      name: 'Room Environment Setup',
      phase: 'room-access',
      iotScenario: 'hotel-room-access',
      description: 'Automatically adjust room settings based on guest preferences',
      duration: 90000, // 1.5 minutes
      devices: ['smart-thermostat', 'smart-lighting', 'voice-assistant'],
      icon: <Thermometer className="h-4 w-4" />,
      status: 'available',
      priority: 'medium'
    },
    {
      id: 'concierge-service',
      name: 'Digital Concierge',
      phase: 'in-room-services',
      iotScenario: 'hotel-service-request',
      description: 'Voice-activated concierge for recommendations and bookings',
      duration: 180000, // 3 minutes
      devices: ['voice-assistant', 'beacon-transmitter'],
      icon: <Volume2 className="h-4 w-4" />,
      status: 'available',
      priority: 'medium'
    },
    {
      id: 'room-service-order',
      name: 'Room Service Ordering',
      phase: 'in-room-services',
      iotScenario: 'hotel-service-request',
      description: 'Order room service through IoT interface',
      duration: 240000, // 4 minutes
      devices: ['voice-assistant', 'payment-terminal', 'beacon-transmitter'],
      icon: <Utensils className="h-4 w-4" />,
      status: 'available',
      cost: 0.008, // 0.008 ETH
      priority: 'low'
    },
    {
      id: 'housekeeping-request',
      name: 'Housekeeping Service',
      phase: 'service-requests',
      iotScenario: 'hotel-service-request',
      description: 'Request housekeeping service with specific preferences',
      duration: 120000, // 2 minutes
      devices: ['voice-assistant', 'motion-sensor', 'beacon-transmitter'],
      icon: <Users className="h-4 w-4" />,
      status: 'available',
      priority: 'low'
    },
    {
      id: 'spa-booking',
      name: 'Spa & Wellness Booking',
      phase: 'amenities',
      iotScenario: 'hotel-service-request',
      description: 'Book spa treatments and wellness services',
      duration: 180000, // 3 minutes
      devices: ['payment-terminal', 'beacon-transmitter', 'biometric-scanner'],
      icon: <Activity className="h-4 w-4" />,
      status: 'available',
      cost: 0.025, // 0.025 ETH
      priority: 'low'
    },
    {
      id: 'valet-parking',
      name: 'Valet Parking Service',
      phase: 'amenities',
      iotScenario: 'hotel-service-request',
      description: 'Automated valet parking with vehicle tracking',
      duration: 300000, // 5 minutes
      devices: ['vehicle-sensor', 'gps-tracker', 'beacon-transmitter'],
      icon: <Car className="h-4 w-4" />,
      status: 'available',
      cost: 0.012, // 0.012 ETH
      priority: 'medium'
    },
    {
      id: 'luggage-assistance',
      name: 'Luggage Assistance',
      phase: 'service-requests',
      iotScenario: 'hotel-service-request',
      description: 'Automated luggage pickup and delivery service',
      duration: 240000, // 4 minutes
      devices: ['rfid-scanner', 'beacon-transmitter', 'motion-sensor'],
      icon: <Luggage className="h-4 w-4" />,
      status: 'available',
      cost: 0.005, // 0.005 ETH
      priority: 'medium'
    },
    {
      id: 'wake-up-call',
      name: 'Smart Wake-up Service',
      phase: 'in-room-services',
      iotScenario: 'hotel-service-request',
      description: 'Personalized wake-up call with room environment adjustment',
      duration: 60000, // 1 minute
      devices: ['voice-assistant', 'smart-lighting', 'smart-thermostat'],
      icon: <PhoneCall className="h-4 w-4" />,
      status: 'available',
      priority: 'medium'
    },
    {
      id: 'express-checkout',
      name: 'Express Checkout',
      phase: 'check-out',
      iotScenario: 'hotel-checkout',
      description: 'Fast checkout with automated billing and key card deactivation',
      duration: 180000, // 3 minutes
      devices: ['rfid-scanner', 'payment-terminal', 'environmental-sensor'],
      icon: <CreditCard className="h-4 w-4" />,
      status: 'available',
      priority: 'high'
    },
    {
      id: 'room-inspection',
      name: 'Automated Room Inspection',
      phase: 'check-out',
      iotScenario: 'hotel-checkout',
      description: 'IoT-powered room condition assessment',
      duration: 240000, // 4 minutes
      devices: ['environmental-sensor', 'motion-sensor', 'camera'],
      icon: <Camera className="h-4 w-4" />,
      status: 'available',
      priority: 'medium'
    },
    {
      id: 'departure-assistance',
      name: 'Departure Assistance',
      phase: 'post-departure',
      iotScenario: 'hotel-checkout',
      description: 'Final departure confirmation and loyalty program updates',
      duration: 120000, // 2 minutes
      devices: ['facial-recognition', 'beacon-transmitter'],
      icon: <Shield className="h-4 w-4" />,
      status: 'available',
      priority: 'low'
    }
  ]);

  // Journey phases configuration
  const journeyPhases: Record<HotelJourneyPhase, { name: string; description: string; icon: React.ReactNode; order: number }> = {
    'pre-arrival': {
      name: 'Pre-Arrival',
      description: 'Mobile check-in and travel preparation',
      icon: <MapPin className="h-4 w-4" />,
      order: 0
    },
    'check-in': {
      name: 'Check-In',
      description: 'Reception and key card programming',
      icon: <Hotel className="h-4 w-4" />,
      order: 1
    },
    'room-access': {
      name: 'Room Access',
      description: 'Room entry and environment setup',
      icon: <Key className="h-4 w-4" />,
      order: 2
    },
    'in-room-services': {
      name: 'In-Room Services',
      description: 'Room service and digital concierge',
      icon: <Bell className="h-4 w-4" />,
      order: 3
    },
    'amenities': {
      name: 'Hotel Amenities',
      description: 'Spa, parking, and facility bookings',
      icon: <Activity className="h-4 w-4" />,
      order: 4
    },
    'service-requests': {
      name: 'Service Requests',
      description: 'Housekeeping and assistance services',
      icon: <Users className="h-4 w-4" />,
      order: 5
    },
    'check-out': {
      name: 'Check-Out',
      description: 'Express checkout and room inspection',
      icon: <CreditCard className="h-4 w-4" />,
      order: 6
    },
    'post-departure': {
      name: 'Post-Departure',
      description: 'Departure confirmation and follow-up',
      icon: <Shield className="h-4 w-4" />,
      order: 7
    }
  };

  // Calculate journey progress
  useEffect(() => {
    const completedServices = hotelServices.filter(s => s.status === 'completed');
    const progress = (completedServices.length / hotelServices.length) * 100;
    setJourneyProgress(progress);

    // Update journey metrics
    if (completedServices.length > journeyMetrics.serviceCompletions) {
      setJourneyMetrics(prev => ({
        ...prev,
        serviceCompletions: completedServices.length,
        totalDuration: Date.now() - journeyStartTime.getTime(),
        guestSatisfactionScore: Math.min(100, prev.guestSatisfactionScore + (Math.random() * 4 - 2)),
        iotDeviceEfficiency: Math.max(80, Math.min(98, prev.iotDeviceEfficiency + (Math.random() * 6 - 3))),
        errorRate: Math.max(0, Math.min(0.1, prev.errorRate + (Math.random() * 0.02 - 0.01)))
      }));
    }

    // Auto-advance phase based on completed services
    const currentPhaseServices = hotelServices.filter(s => s.phase === currentPhase);
    const completedInPhase = currentPhaseServices.filter(s => s.status === 'completed');
    
    if (completedInPhase.length === currentPhaseServices.length && currentPhaseServices.length > 0) {
      const phases = Object.keys(journeyPhases) as HotelJourneyPhase[];
      const currentIndex = phases.indexOf(currentPhase);
      if (currentIndex < phases.length - 1) {
        setCurrentPhase(phases[currentIndex + 1]);
      }
    }

    // Check for journey completion
    if (progress === 100 && onJourneyComplete) {
      onJourneyComplete({
        ...journeyMetrics,
        totalDuration: Date.now() - journeyStartTime.getTime(),
        serviceCompletions: completedServices.length
      });
    }
  }, [hotelServices, currentPhase, journeyStartTime, journeyMetrics.serviceCompletions, onJourneyComplete]);

  const handleServiceStart = (serviceId: string): void => {
    setActiveService(serviceId);
    setHotelServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, status: 'in-progress' }
        : service
    ));
  };

  const handleServiceComplete = (result: IoTSimulationResult): void => {
    if (!activeService) return;

    const success = result.overallSuccess;
    setHotelServices(prev => prev.map(service => 
      service.id === activeService
        ? { ...service, status: success ? 'completed' : 'failed' }
        : service
    ));

    // Update guest services
    if (success) {
      setGuest(prev => ({
        ...prev,
        services: [...prev.services, activeService]
      }));
    }

    // Callback
    if (onServiceComplete) {
      onServiceComplete(activeService, result);
    }

    setActiveService(null);

    // Update metrics
    setJourneyMetrics(prev => ({
      ...prev,
      paymentProcessingTime: prev.paymentProcessingTime + result.totalDuration
    }));
  };

  const getPhaseServices = (phase: HotelJourneyPhase): HotelService[] => {
    return hotelServices
      .filter(service => service.phase === phase)
      .sort((a, b) => {
        // Sort by priority and then by status
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const statusOrder = { available: 0, 'in-progress': 1, completed: 2, failed: 3 };
        
        return priorityOrder[a.priority] - priorityOrder[b.priority] ||
               statusOrder[a.status] - statusOrder[b.status];
      });
  };

  const getStatusColor = (status: HotelService['status']): string => {
    switch (status) {
      case 'available': return 'text-blue-400';
      case 'in-progress': return 'text-orange-400';
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityBadge = (priority: HotelService['priority']) => {
    const colors = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      low: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };

    return (
      <Badge variant="outline" className={`text-xs ${colors[priority]}`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  // Auto progress journey if enabled
  useEffect(() => {
    if (autoProgressJourney && !activeService) {
      const availableServices = hotelServices.filter(s => s.status === 'available');
      if (availableServices.length > 0) {
        const nextService = availableServices[0];
        setTimeout(() => {
          handleServiceStart(nextService.id);
        }, 2000);
      }
    }
  }, [autoProgressJourney, activeService, hotelServices]);

  return (
    <div className="space-y-6">
      {/* Journey Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neon-blue mb-1">Hotel Journey Experience</h2>
          <p className="text-gray-400">
            Guest: {guest.name} | Room: {guest.roomNumber} | {guest.loyaltyTier.toUpperCase()} Member
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="border-neon-green/50 text-neon-green">
            {Math.round(journeyProgress)}% COMPLETE
          </Badge>
          <Badge variant="outline" className="border-neon-blue/50 text-neon-blue">
            {currentPhase.toUpperCase().replace('-', ' ')}
          </Badge>
        </div>
      </div>

      {/* Journey Progress */}
      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-neon-blue flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Journey Progress & Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Journey Progress</span>
                <span>{Math.round(journeyProgress)}%</span>
              </div>
              <Progress value={journeyProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-neon-green">
                  {journeyMetrics.serviceCompletions}
                </div>
                <div className="text-xs text-gray-400">Services Completed</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-neon-blue">
                  {Math.round(journeyMetrics.guestSatisfactionScore)}%
                </div>
                <div className="text-xs text-gray-400">Satisfaction Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">
                  {Math.round(journeyMetrics.iotDeviceEfficiency)}%
                </div>
                <div className="text-xs text-gray-400">IoT Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">
                  {Math.round((Date.now() - journeyStartTime.getTime()) / 60000)}min
                </div>
                <div className="text-xs text-gray-400">Journey Duration</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Navigation */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(journeyPhases)
          .sort(([, a], [, b]) => a.order - b.order)
          .map(([phase, config]) => {
            const phaseServices = getPhaseServices(phase as HotelJourneyPhase);
            const completedInPhase = phaseServices.filter(s => s.status === 'completed').length;
            const isActive = phase === currentPhase;
            const isCompleted = completedInPhase === phaseServices.length && phaseServices.length > 0;
            
            return (
              <Button
                key={phase}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPhase(phase as HotelJourneyPhase)}
                className={`flex items-center gap-2 ${
                  isActive 
                    ? 'bg-neon-blue hover:bg-neon-blue/80 text-black' 
                    : isCompleted 
                      ? 'border-green-500/50 text-green-400 hover:bg-green-500/10'
                      : 'border-gray-600 hover:bg-gray-700'
                }`}
              >
                {config.icon}
                {config.name}
                {phaseServices.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {completedInPhase}/{phaseServices.length}
                  </Badge>
                )}
              </Button>
            );
          })}
      </div>

      {/* Current Phase Services */}
      <div>
        <h3 className="text-xl font-semibold text-neon-blue mb-4 flex items-center gap-2">
          {journeyPhases[currentPhase].icon}
          {journeyPhases[currentPhase].name}
          <span className="text-sm font-normal text-gray-400">
            - {journeyPhases[currentPhase].description}
          </span>
        </h3>

        <div className="grid gap-4">
          {getPhaseServices(currentPhase).map((service) => (
            <Card 
              key={service.id} 
              className={`bg-black/40 border-gray-700 transition-colors ${
                service.id === activeService ? 'border-orange-500/50' : 'hover:border-neon-blue/30'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(service.status)}>
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{service.name}</h4>
                      <p className="text-sm text-gray-400">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(service.priority)}
                    <Badge 
                      variant={service.status === 'completed' ? 'default' : 'secondary'}
                      className={
                        service.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        service.status === 'in-progress' ? 'bg-orange-500/20 text-orange-400' :
                        service.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }
                    >
                      {service.status.toUpperCase().replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {Math.round(service.duration / 1000)}s
                    </div>
                    {service.cost && (
                      <div className="flex items-center gap-1 text-neon-green">
                        <CreditCard className="h-4 w-4" />
                        {service.cost} ETH
                      </div>
                    )}
                    <div className="text-xs">
                      {service.devices.length} IoT devices
                    </div>
                  </div>
                  
                  {service.status === 'available' && service.id !== activeService && (
                    <Button
                      size="sm"
                      onClick={() => handleServiceStart(service.id)}
                      className="bg-neon-green hover:bg-neon-green/80 text-black"
                    >
                      Start Service
                    </Button>
                  )}
                  
                  {service.status === 'in-progress' && (
                    <div className="flex items-center gap-2 text-orange-400">
                      <Activity className="h-4 w-4 animate-spin" />
                      In Progress...
                    </div>
                  )}
                  
                  {service.status === 'completed' && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </div>
                  )}
                  
                  {service.status === 'failed' && (
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      Failed
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Active IoT Simulation */}
      {activeService && (
        <Card className="bg-black/60 border-orange-500/50">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Active Service: {hotelServices.find(s => s.id === activeService)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedIoTDeviceSystem
              selectedScenario={hotelServices.find(s => s.id === activeService)?.iotScenario || 'hotel-checkin'}
              onScenarioComplete={handleServiceComplete}
              autoStart={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HotelJourneyScenarios;