'use client';

/**
 * STC Ultimate - Photo Mode Component
 * Screenshot capture with filters and effects
 */

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Camera, Download, Sparkles, Sun, Moon, Palette, X } from 'lucide-react';

interface PhotoModeProps {
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  locationName: string;
}

type FilterType = 'none' | 'vintage' | 'vivid' | 'bw' | 'sepia' | 'cool' | 'warm';

export function PhotoMode({ onClose, canvasRef, locationName }: PhotoModeProps): JSX.Element {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  // Apply filters to canvas
  const applyFilters = useCallback((ctx: CanvasRenderingContext2D) => {
    let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    switch (selectedFilter) {
      case 'vintage':
        filterString += ' sepia(40%) hue-rotate(-10deg)';
        break;
      case 'vivid':
        filterString += ' saturate(150%) contrast(110%)';
        break;
      case 'bw':
        filterString += ' grayscale(100%)';
        break;
      case 'sepia':
        filterString += ' sepia(100%)';
        break;
      case 'cool':
        filterString += ' hue-rotate(180deg) saturate(120%)';
        break;
      case 'warm':
        filterString += ' hue-rotate(-20deg) saturate(120%)';
        break;
    }

    ctx.filter = filterString;
  }, [selectedFilter, brightness, contrast, saturation]);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!canvasRef.current || !hiddenCanvasRef.current) return;

    const sourceCanvas = canvasRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    const ctx = hiddenCanvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    hiddenCanvas.width = sourceCanvas.width;
    hiddenCanvas.height = sourceCanvas.height;

    // Apply filters
    applyFilters(ctx);

    // Draw source canvas with filters
    ctx.drawImage(sourceCanvas, 0, 0);

    // Add watermark
    ctx.filter = 'none';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`STC Ultimate - ${locationName}`, hiddenCanvas.width - 20, hiddenCanvas.height - 20);
    ctx.font = '16px Arial';
    ctx.fillText(new Date().toLocaleDateString(), hiddenCanvas.width - 20, hiddenCanvas.height - 50);

    // Get image data
    const imageData = hiddenCanvas.toDataURL('image/png');
    setCapturedImage(imageData);
  }, [canvasRef, applyFilters, locationName]);

  // Download photo
  const downloadPhoto = useCallback(() => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    link.download = `stc-ultimate-${locationName.toLowerCase().replace(/\s/g, '-')}-${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
  }, [capturedImage, locationName]);

  const filters: Array<{ type: FilterType; name: string; icon: JSX.Element }> = [
    { type: 'none', name: 'Original', icon: <Camera className="h-4 w-4" /> },
    { type: 'vintage', name: 'Vintage', icon: <Palette className="h-4 w-4" /> },
    { type: 'vivid', name: 'Vivid', icon: <Sparkles className="h-4 w-4" /> },
    { type: 'bw', name: 'B&W', icon: <Moon className="h-4 w-4" /> },
    { type: 'sepia', name: 'Sepia', icon: <Sun className="h-4 w-4" /> },
    { type: 'cool', name: 'Cool', icon: <Palette className="h-4 w-4" /> },
    { type: 'warm', name: 'Warm', icon: <Sun className="h-4 w-4" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-900 border-purple-500/50 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Camera className="h-6 w-6 text-purple-400" />
              Photo Mode
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Preview Area */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="max-w-full max-h-full" />
            ) : (
              <p className="text-gray-400">Preview will appear here after capture</p>
            )}
          </div>

          {/* Filters */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-400" />
              Filters
            </h3>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <Badge
                  key={filter.type}
                  className={`cursor-pointer px-4 py-2 ${
                    selectedFilter === filter.type
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedFilter(filter.type)}
                >
                  <span className="flex items-center gap-2">
                    {filter.icon}
                    {filter.name}
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-800" />

          {/* Adjustments */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              Adjustments
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-300">Brightness</label>
                  <span className="text-sm text-purple-400">{brightness}%</span>
                </div>
                <Slider
                  value={[brightness]}
                  onValueChange={(value) => setBrightness(value[0])}
                  min={50}
                  max={150}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-300">Contrast</label>
                  <span className="text-sm text-purple-400">{contrast}%</span>
                </div>
                <Slider
                  value={[contrast]}
                  onValueChange={(value) => setContrast(value[0])}
                  min={50}
                  max={150}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-300">Saturation</label>
                  <span className="text-sm text-purple-400">{saturation}%</span>
                </div>
                <Slider
                  value={[saturation]}
                  onValueChange={(value) => setSaturation(value[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-gray-800" />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-purple-500 hover:bg-purple-600"
              onClick={capturePhoto}
            >
              <Camera className="h-4 w-4 mr-2" />
              Capture Photo
            </Button>
            <Button
              className="flex-1 bg-cyan-500 hover:bg-cyan-600"
              onClick={downloadPhoto}
              disabled={!capturedImage}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Hidden canvas for processing */}
          <canvas ref={hiddenCanvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
}
