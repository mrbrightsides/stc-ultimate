'use client';

import { useState, useEffect } from 'react';
import { NeonCard } from '@/components/ui/neon-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Wifi, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Zap, 
  QrCode, 
  Radio,
  Satellite,
  Shield,
  Activity,
  Loader2
} from 'lucide-react';

interface IoTSimulationProps {
  serviceName: string;
  serviceType: string;
  onComplete: () => void;
  isActive: boolean;
}

const getIoTDevicesByService = (serviceType: string) => {
  const devices = {
    'flight': [
      { name: 'Airport RFID Gate', icon: Radio, description: 'Boarding pass validation' },
      { name: 'GPS Location Tracker', icon: Satellite, description: 'Airport location verified' },
      { name: 'NFC Check-in Kiosk', icon: Smartphone, description: 'Self-service check-in' }
    ],
    'hotel': [
      { name: 'Hotel Key Card Reader', icon: Radio, description: 'Room access authentication' },
      { name: 'GPS Geo-fence', icon: MapPin, description: 'Hotel premises detected' },
      { name: 'QR Code Scanner', icon: QrCode, description: 'Digital check-in confirmation' }
    ],
    'transport': [
      { name: 'Vehicle IoT Sensor', icon: Activity, description: 'Ride start detection' },
      { name: 'GPS Route Tracker', icon: Satellite, description: 'Journey route validation' },
      { name: 'NFC Payment Terminal', icon: Smartphone, description: 'Contactless payment' }
    ],
    'restaurant': [
      { name: 'Table QR Scanner', icon: QrCode, description: 'Menu access & ordering' },
      { name: 'IoT Ordering System', icon: Wifi, description: 'Order placement confirmed' },
      { name: 'Payment RFID Reader', icon: Radio, description: 'Meal payment processed' }
    ],
    'shopping': [
      { name: 'Store Beacon', icon: Wifi, description: 'Shop entry detected' },
      { name: 'POS Terminal', icon: Smartphone, description: 'Purchase transaction' },
      { name: 'Receipt Scanner', icon: QrCode, description: 'Digital receipt generated' }
    ]
  };
  
  return devices[serviceType as keyof typeof devices] || devices['transport'];
};

// Enhanced IoT simulation sequence with more detailed steps and real-time feedback
const simulationSteps = [
  { 
    step: 1, 
    title: 'RFID/NFC Detection', 
    message: 'Scanning for IoT devices...', 
    details: 'Detecting RFID tags, NFC terminals, and Bluetooth beacons in proximity',
    duration: 1500,
    progress: 15,
    animations: ['Scanning...', 'Device found!', 'Signal strength: Strong']
  },
  { 
    step: 2, 
    title: 'GPS Verification', 
    message: 'Verifying location accuracy...', 
    details: 'Cross-referencing GPS coordinates with service location database',
    duration: 1200,
    progress: 30,
    animations: ['Getting location...', 'Precision: ±2m', 'Location confirmed!']
  },
  { 
    step: 3, 
    title: 'Biometric Authentication', 
    message: 'Authenticating user identity...', 
    details: 'Multi-factor authentication using biometric and wallet signatures',
    duration: 1800,
    progress: 50,
    animations: ['Scanning biometrics...', 'Wallet signature required', 'Identity verified!']
  },
  { 
    step: 4, 
    title: 'Smart Contract Execution', 
    message: 'Executing blockchain transaction...', 
    details: 'Deploying payment transaction to Sepolia testnet with gas optimization',
    duration: 2500,
    progress: 70,
    animations: ['Preparing transaction...', 'Calculating gas fees...', 'Broadcasting to network...']
  },
  { 
    step: 5, 
    title: 'Blockchain Confirmation', 
    message: 'Awaiting network confirmations...', 
    details: 'Monitoring block confirmations and finality on Sepolia network',
    duration: 3500,
    progress: 90,
    animations: ['Block confirmation 1/3...', 'Block confirmation 2/3...', 'Block confirmation 3/3 ✓']
  },
  { 
    step: 6, 
    title: 'Service Activation', 
    message: 'Notifying merchants and activating service...', 
    details: 'Triggering merchant notifications and unlocking service access',
    duration: 1000,
    progress: 100,
    animations: ['Notifying merchant...', 'Service unlocking...', 'Activation complete!']
  }
];

export function IoTSimulation({ serviceName, serviceType, onComplete, isActive }: IoTSimulationProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentStepDetails, setCurrentStepDetails] = useState<typeof simulationSteps[0] | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string>('0.001 ETH');
  const [blockConfirmations, setBlockConfirmations] = useState<number>(0);
  const [realTimeData, setRealTimeData] = useState<string[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<string>('');
  const [transactionSpeed, setTransactionSpeed] = useState<number>(0);
  const [networkCongestion, setNetworkCongestion] = useState<'low' | 'medium' | 'high'>('low');
  const [estimatedTime, setEstimatedTime] = useState<string>('~3 minutes');

  const devices = getIoTDevicesByService(serviceType);

  useEffect(() => {
    if (isActive && !isSimulating) {
      setIsSimulating(true);
      setCurrentStep(0);
      setProgress(0);
      setConnectedDevices([]);
      
      // Enhanced IoT device connection sequence with detailed animations
      const simulation = async () => {
        for (let i = 0; i < simulationSteps.length; i++) {
          const stepData = simulationSteps[i];
          setCurrentStep(i);
          setCurrentStepDetails(stepData);
          
          // Update progress with smooth transitions
          setProgress(stepData.progress);
          
          // Connect devices progressively
          if (i < devices.length) {
            setConnectedDevices(prev => [...prev, devices[i].name]);
          }
          
          // Animate through each step's sub-animations
          for (let animIdx = 0; animIdx < stepData.animations.length; animIdx++) {
            const animation = stepData.animations[animIdx];
            setCurrentAnimation(animation);
            
            const timestamp = new Date().toLocaleTimeString();
            setRealTimeData(prev => [
              `${timestamp} - ${animation}`,
              ...prev.slice(0, 6) // Keep last 7 entries
            ]);
            
            // Step-specific enhancements
            if (i === 1) { // GPS Verification
              const locations = ['Checking satellites...', 'Triangulating position...', 'Precision verified!'];
              setCurrentAnimation(locations[animIdx] || animation);
            }
            
            if (i === 3) { // Smart Contract Execution
              // Enhanced gas fee calculation simulation
              if (animIdx === 0) {
                setGasEstimate('Calculating...');
                setNetworkCongestion('medium');
                setTransactionSpeed(45); // TPS simulation
              } else if (animIdx === 1) {
                setGasEstimate('0.0018 ETH');
                setEstimatedTime('~2.5 minutes');
                // Optimize gas fee
                setTimeout(() => {
                  setGasEstimate('0.0014 ETH');
                  setNetworkCongestion('low');
                  setEstimatedTime('~90 seconds');
                }, 800);
              } else if (animIdx === 2) {
                setGasEstimate('0.0012 ETH (optimized)');
                setTransactionSpeed(62); // Faster TPS
                setEstimatedTime('~60 seconds');
              }
            }
            
            if (i === 4) { // Blockchain Confirmation
              // Enhanced block confirmation tracking
              if (animIdx < 3) {
                const confNumber = animIdx + 1;
                setBlockConfirmations(confNumber);
                setRealTimeData(prev => [
                  `${timestamp} - Block #${12345670 + confNumber} confirmed (${confNumber}/3)`,
                  ...prev.slice(0, 6)
                ]);
                
                // Add block time simulation
                if (confNumber === 3) {
                  setTimeout(() => {
                    setRealTimeData(prev => [
                      `${new Date().toLocaleTimeString()} - Transaction finalized! Gas used: 142,857`,
                      ...prev.slice(0, 6)
                    ]);
                  }, 500);
                }
              }
            }
            
            if (i === 5) { // Service Activation
              if (animIdx === 0) {
                setRealTimeData(prev => [
                  `${timestamp} - Merchant notification sent via webhook`,
                  ...prev.slice(0, 6)
                ]);
              } else if (animIdx === 1) {
                setRealTimeData(prev => [
                  `${timestamp} - Access token generated: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                  ...prev.slice(0, 6)
                ]);
              }
            }
            
            await new Promise(resolve => setTimeout(resolve, stepData.duration / stepData.animations.length));
          }
        }
        
        // Complete simulation
        await new Promise(resolve => setTimeout(resolve, 500));
        onComplete();
        setIsSimulating(false);
        
        // Reset state after completion
        setTimeout(() => {
          setCurrentStep(0);
          setProgress(0);
          setConnectedDevices([]);
          setCurrentStepDetails(null);
          setGasEstimate('0.001 ETH');
          setBlockConfirmations(0);
          setRealTimeData([]);
        }, 3000);
      };

      simulation();
    }
  }, [isActive, isSimulating, devices, onComplete]);

  if (!isActive) {
    return (
      <NeonCard glowColor="gray" className="opacity-60">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center">
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-400">IoT Simulation Ready</h3>
          <p className="text-sm text-gray-500">Trigger service to start simulation</p>
        </div>
      </NeonCard>
    );
  }

  return (
    <NeonCard glowColor="cyan" intense className="transition-all duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-cyan-400" />
              </div>
              {isSimulating && (
                <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-cyan-400 animate-spin border-t-transparent" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">IoT Service Activation</h3>
              <p className="text-sm text-gray-400">{serviceName}</p>
            </div>
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
            {isSimulating ? 'ACTIVE' : 'READY'}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Simulation Progress</span>
            <span className="text-sm font-medium text-cyan-400">{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500"
          />
        </div>

        {/* Current Step */}
        <div className="p-4 rounded-lg bg-black/30 border border-cyan-500/30">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {isSimulating ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-cyan-400">STEP {currentStep + 1}/6</span>
                </div>
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              )}
              <span className="text-sm text-white font-medium">
                {currentStepDetails ? currentStepDetails.title : 'Ready to start'}
              </span>
            </div>
            
            {currentStepDetails && (
              <div className="ml-5">
                <p className="text-xs text-cyan-300 font-medium">
                  {currentStepDetails.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {currentStepDetails.details}
                </p>
              </div>
            )}
            
            {/* Enhanced Gas Fee Display during Contract Execution */}
            {currentStep === 3 && isSimulating && (
              <div className="ml-5 space-y-2">
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-purple-300">Gas Estimate:</span>
                      <p className="text-purple-400 font-mono text-sm">{gasEstimate}</p>
                    </div>
                    <div>
                      <span className="text-purple-300">Network TPS:</span>
                      <p className="text-purple-400 font-mono text-sm">{transactionSpeed}/sec</p>
                    </div>
                    <div>
                      <span className="text-purple-300">Congestion:</span>
                      <p className={`text-sm font-medium ${
                        networkCongestion === 'low' ? 'text-green-400' :
                        networkCongestion === 'medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {networkCongestion.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <span className="text-purple-300">Est. Time:</span>
                      <p className="text-purple-400 font-mono text-sm">{estimatedTime}</p>
                    </div>
                  </div>
                  
                  {gasEstimate.includes('optimized') && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-300 text-xs">Gas optimization complete!</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Enhanced Block Confirmations during Blockchain step */}
            {currentStep === 4 && isSimulating && (
              <div className="ml-5 space-y-3">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-green-300">Block Confirmations:</span>
                    <span className="text-green-400 font-mono text-sm">{blockConfirmations}/3</span>
                  </div>
                  
                  {/* Visual confirmation progress */}
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3].map((conf) => (
                      <div
                        key={conf}
                        className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                          blockConfirmations >= conf 
                            ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Block Height:</span>
                      <p className="text-green-400 font-mono">#{12345670 + blockConfirmations}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Block Time:</span>
                      <p className="text-green-400 font-mono">~12s avg</p>
                    </div>
                  </div>
                  
                  {blockConfirmations === 3 && (
                    <div className="mt-2 flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-400" />
                      <span className="text-green-300 text-xs font-medium">Transaction finalized!</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Connected Devices */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Connected IoT Devices
          </h4>
          <div className="grid gap-3">
            {devices.map((device, index) => {
              const IconComponent = device.icon;
              const isConnected = connectedDevices.includes(device.name);
              const isPending = index === connectedDevices.length && isSimulating;
              
              return (
                <div 
                  key={device.name}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                    isConnected 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : isPending
                      ? 'bg-cyan-500/10 border-cyan-500/30 animate-pulse'
                      : 'bg-gray-500/5 border-gray-500/20'
                  }`}
                >
                  <div className={`p-2 rounded ${
                    isConnected 
                      ? 'bg-green-500/20' 
                      : isPending
                      ? 'bg-cyan-500/20'
                      : 'bg-gray-500/20'
                  }`}>
                    <IconComponent className={`h-4 w-4 ${
                      isConnected 
                        ? 'text-green-400' 
                        : isPending
                        ? 'text-cyan-400'
                        : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isConnected ? 'text-green-300' : isPending ? 'text-cyan-300' : 'text-gray-400'
                    }`}>
                      {device.name}
                    </p>
                    <p className="text-xs text-gray-500">{device.description}</p>
                  </div>
                  {isConnected && (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  )}
                  {isPending && (
                    <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Real-time Data Stream with Current Animation */}
        {isSimulating && (realTimeData.length > 0 || currentAnimation) && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Live IoT Data Stream
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs animate-pulse">
                LIVE
              </Badge>
            </h4>
            
            {/* Current Animation Display */}
            {currentAnimation && (
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/50">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                  <span className="text-cyan-300 text-sm font-medium">{currentAnimation}</span>
                </div>
              </div>
            )}
            
            <div className="p-3 rounded-lg bg-black/30 border border-cyan-500/30 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
              {realTimeData.map((log, index) => (
                <div 
                  key={`${log}-${index}`} 
                  className={`transition-all duration-300 flex items-center gap-2 ${
                    index === 0 ? 'text-cyan-400' : 
                    index === 1 ? 'text-green-400' : 
                    index === 2 ? 'text-purple-400' : 
                    index === 3 ? 'text-yellow-400' :
                    'text-gray-400'
                  }`}
                  style={{ opacity: Math.max(0.3, 1 - (index * 0.15)) }}
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    index === 0 ? 'bg-cyan-400 animate-pulse' :
                    index === 1 ? 'bg-green-400' :
                    index === 2 ? 'bg-purple-400' :
                    index === 3 ? 'bg-yellow-400' :
                    'bg-gray-400'
                  }`} />
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Success Animation */}
        {!isSimulating && progress === 100 && (
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-green-300 font-semibold">Service Activation Complete!</p>
            <p className="text-xs text-gray-400">Payment processed and merchant notified</p>
          </div>
        )}
      </div>
    </NeonCard>
  );
}