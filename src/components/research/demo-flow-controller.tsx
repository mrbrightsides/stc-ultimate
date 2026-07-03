'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  Presentation
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DemoStep {
  id: number;
  title: string;
  description: string;
  talkingPoints: string[];
  duration: number; // in seconds
  visualFocus: string;
  icon: React.ReactNode;
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: 'Opening: Research Context',
    description: 'Introduce STC Ultimate and research objectives',
    talkingPoints: [
      'Smart tourism platform leveraging blockchain, IoT, and AI',
      'Addresses SME transaction cost and latency challenges in Indonesian tourism',
      'Research question: Can blockchain reduce costs by 90%+ while improving reliability?'
    ],
    duration: 120,
    visualFocus: 'Overview Tab - Research Objectives',
    icon: <Presentation className="h-5 w-5" />
  },
  {
    id: 2,
    title: 'Methodology: DSRM Framework',
    description: 'Explain Design Science Research Methodology',
    talkingPoints: [
      'Following DSRM: Design → Build → Evaluate cycle',
      '30 independent runs per scenario (n=300 total)',
      'Dual-source data: Simulated IoT + Real Ethereum Sepolia transactions',
      'Statistical analysis: t-tests, ANOVA, effect sizes at α = 0.05'
    ],
    duration: 180,
    visualFocus: 'Overview Tab - Methodology Section',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 3,
    title: 'Statistics: t-Test Results',
    description: 'Present independent samples t-tests',
    talkingPoints: [
      'Transaction Latency: 18.5 days → 50 seconds (99.997% reduction, p < 0.001)',
      'Transaction Fees: 20% → 0.275% (98.6% reduction, p < 0.001)',
      'Success Rate: 67.5% → 96.5% (43% improvement, p < 0.001)',
      'All tests show Cohen\'s d > 2.0 (huge effect size)'
    ],
    duration: 240,
    visualFocus: 'Statistics Tab - t-Tests Section',
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    id: 4,
    title: 'ANOVA: Multi-Scenario Analysis',
    description: 'Show performance across 10 tourism scenarios',
    talkingPoints: [
      'F(9,290) = 24.52, p < 0.001 - significant differences exist',
      'Post-hoc analysis confirms STC superiority in ALL scenarios',
      'From hotel check-ins to multi-vendor packages - consistent results',
      'Demonstrates generalizability across diverse tourism contexts'
    ],
    duration: 180,
    visualFocus: 'Statistics Tab - ANOVA Section',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    id: 5,
    title: 'Visualizations: Correlations & Radar',
    description: 'Multi-metric performance comparison',
    talkingPoints: [
      'Radar chart shows STC outperforms traditional platforms in ALL dimensions',
      'Speed, Cost, Security, Reliability, Scalability, Success Rate',
      'Scatter plots reveal inverse correlation: faster = higher success rate',
      '95% confidence intervals demonstrate statistical robustness'
    ],
    duration: 150,
    visualFocus: 'Statistics Tab - Correlations Section',
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    id: 6,
    title: 'Enhanced Dataset: Geographic & Demographic',
    description: 'Detailed scenario analysis',
    talkingPoints: [
      '10 scenarios across Batam-Bintan-Lagoi regions',
      'Peak season, off-season, and special events coverage',
      'Diverse demographics: business travelers, families, corporate groups',
      'Multiple vendor types: SMEs, hotel chains, tour operators'
    ],
    duration: 120,
    visualFocus: 'Enhanced Dataset Tab - All Charts',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 7,
    title: 'Limitations: Transparent Acknowledgment',
    description: 'Discuss research constraints and mitigation',
    talkingPoints: [
      'Testnet vs Mainnet: Sepolia mirrors mainnet behavior (Medium impact)',
      'Sample size n=30 per scenario sufficient for CLT, large effect sizes',
      'IoT partially simulated - dual-source strategy balances control + realism',
      'All limitations have documented mitigation strategies'
    ],
    duration: 150,
    visualFocus: 'Limitations Tab',
    icon: <Clock className="h-5 w-5" />
  },
  {
    id: 8,
    title: 'Live Export Demo',
    description: 'Demonstrate data export and verification',
    talkingPoints: [
      'Export all research data to JSON/CSV/PDF',
      'Show Etherscan blockchain transaction verification',
      'Demonstrate reproducibility with version-controlled parameters',
      'External validation ready for SPSS/Python/R analysis'
    ],
    duration: 90,
    visualFocus: 'Statistics Tab - Export Dropdown',
    icon: <FileText className="h-5 w-5" />
  },
  {
    id: 9,
    title: 'Closing: Key Findings Summary',
    description: 'Recap major contributions',
    talkingPoints: [
      '✅ RQ1 Answered: 99%+ latency reduction, 98.6% cost reduction achieved',
      '✅ Statistical significance: All tests p < 0.001 with huge effect sizes',
      '✅ Practical significance: Immediate SME cost savings and faster payouts',
      '✅ Future work: Mainnet pilot, multi-country expansion, CBDC integration'
    ],
    duration: 120,
    visualFocus: 'Overview Tab - Key Findings',
    icon: <CheckCircle2 className="h-5 w-5" />
  }
];

const DemoFlowController: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const totalDuration = demoSteps.reduce((acc, step) => acc + step.duration, 0);
  const currentStepData = demoSteps[currentStep];
  const progress = ((currentStep + 1) / demoSteps.length) * 100;

  const handleNext = (): void => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setElapsedTime(0);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setElapsedTime(0);
    }
  };

  const handleReset = (): void => {
    setCurrentStep(0);
    setElapsedTime(0);
    setIsPlaying(false);
  };

  const handlePlayPause = (): void => {
    setIsPlaying(prev => !prev);
  };

  // Auto-advance timer (optional - can be enabled during practice)
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        if (prev >= currentStepData.duration) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Presentation className="h-6 w-6 text-purple-600" />
            Defense Presentation Flow Controller
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Guided defense script with timing and talking points for each section
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-gray-700">
              <span>Overall Progress</span>
              <span>Step {currentStep + 1} of {demoSteps.length}</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Total Duration: ~{Math.ceil(totalDuration / 60)} minutes</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transport Controls */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              disabled={currentStep === 0}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              size="lg"
              onClick={handlePlayPause}
              className="w-32 bg-purple-600 hover:bg-purple-700"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  {currentStep === 0 ? 'Start' : 'Resume'}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              disabled={currentStep === demoSteps.length - 1}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Card */}
      <Card className="border-2 border-purple-300 bg-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                {currentStepData.icon}
              </div>
              <div>
                <Badge className="bg-purple-100 text-purple-800 mb-2">
                  Step {currentStep + 1}
                </Badge>
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                <CardDescription className="mt-1">{currentStepData.description}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {formatTime(elapsedTime)} / {formatTime(currentStepData.duration)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ~{Math.ceil(currentStepData.duration / 60)} min suggested
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visual Focus */}
          <Alert className="border-blue-300 bg-blue-50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="font-semibold text-blue-900">
              <strong>Navigate to:</strong> {currentStepData.visualFocus}
            </AlertDescription>
          </Alert>

          {/* Talking Points */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              💬 Talking Points:
            </h3>
            <ul className="space-y-3">
              {currentStepData.talkingPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-700">{idx + 1}</span>
                  </div>
                  <span className="font-semibold text-gray-900 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timer Progress */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Step Timer</span>
              <span>{Math.round((elapsedTime / currentStepData.duration) * 100)}%</span>
            </div>
            <Progress 
              value={(elapsedTime / currentStepData.duration) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* All Steps Overview */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Complete Defense Flow</CardTitle>
          <CardDescription>
            Click any step to jump directly to that section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {demoSteps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  idx === currentStep
                    ? 'border-purple-400 bg-purple-50'
                    : idx < currentStep
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
                onClick={() => {
                  setCurrentStep(idx);
                  setElapsedTime(0);
                }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  idx === currentStep
                    ? 'bg-purple-500'
                    : idx < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}>
                  {idx < currentStep ? (
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-sm font-bold text-white">{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.visualFocus}</div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  ~{Math.ceil(step.duration / 60)}m
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Alert className="border-purple-300 bg-purple-50">
        <Presentation className="h-5 w-5 text-purple-600" />
        <AlertDescription className="font-semibold text-purple-900">
          <strong>Pro Tips:</strong> Practice with auto-advance timer OFF. Use manual controls to pace naturally. Reference talking points but speak conversationally. Keep eye contact with examiners. Pause for questions after each major section. Total defense: ~20 minutes presentation + Q&A.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DemoFlowController;
