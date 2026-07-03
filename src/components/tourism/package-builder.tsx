'use client';

import { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { NeonCard } from '@/components/ui/neon-card';
import { NeonButton } from '@/components/ui/neon-button';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Plane, 
  Hotel, 
  Car, 
  Utensils, 
  ShoppingBag, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Clock
} from 'lucide-react';
import type { TourPackage, TourService } from '@/app/types/contracts';
import { 
  DESTINATIONS, 
  calculatePackagePrice, 
  getPackageMilestones,
  getDestinationTierColor,
  getDestinationTierLabel,
  type Destination 
} from '@/lib/destinations-config';

interface PackageBuilderProps {
  onPackageCreated: (tourPackage: TourPackage) => void;
}

const getServiceIcon = (iconName: string) => {
  const icons = {
    'plane': Plane,
    'hotel': Hotel,
    'car': Car,
    'utensils': Utensils,
    'shopping-bag': ShoppingBag,
    'activity': Sparkles,
  };
  return icons[iconName as keyof typeof icons] || Sparkles;
};

export function PackageBuilder({ onPackageCreated }: PackageBuilderProps) {
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  const calculateNumberOfDays = (): number => {
    if (!startDate || !endDate) return 3;
    const days = differenceInDays(endDate, startDate) + 1;
    return days > 0 ? days : 3;
  };

  const getCurrentDestination = (): Destination | undefined => {
    return DESTINATIONS.find(d => d.id === selectedDestination);
  };

  const calculateTotal = (): string => {
    if (!selectedDestination) return '0.00';
    const numberOfDays = calculateNumberOfDays();
    return calculatePackagePrice(selectedDestination, numberOfDays);
  };

  const handleCreatePackage = (): void => {
    if (!selectedDestination || !startDate || !endDate) {
      return;
    }

    const numberOfDays = calculateNumberOfDays();
    const destination = getCurrentDestination();
    if (!destination) return;

    // Get all milestones with calculated prices
    const milestones = getPackageMilestones(selectedDestination, numberOfDays);

    // Convert milestones to TourService format
    const services: TourService[] = milestones.map((milestone, index) => ({
      id: index + 1,
      name: milestone.serviceName || milestone.name || 'Service',
      merchant: milestone.vendorAddress,
      amount: milestone.amount,
      status: 'pending' as const,
      description: milestone.description || `${milestone.serviceType} service`,
      icon: milestone.icon || 'sparkles',
    }));

    const tourPackage: TourPackage = {
      id: Date.now().toString(),
      destination: `${destination.emoji} ${destination.name}, ${destination.country}`,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : '',
      services,
      totalAmount: calculateTotal(),
      status: 'draft',
    };

    onPackageCreated(tourPackage);
  };

  const isFormValid = selectedDestination && startDate && endDate;
  const currentDestination = getCurrentDestination();
  const numberOfDays = calculateNumberOfDays();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Pilih Paket Perjalanan Lengkap
        </h2>
        <p className="text-gray-300 text-lg">
          Semua paket sudah termasuk penerbangan, hotel, transportasi, makanan, dan aktivitas wisata
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Destination & Dates Selection */}
        <div className="space-y-6">
          <NeonCard glowColor="purple" className="h-fit">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Pilih Destinasi & Tanggal</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="destination" className="text-gray-300">Destinasi Wisata</Label>
                  <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                    <SelectTrigger className="mt-1 bg-black/50 border-purple-500/50 text-white">
                      <SelectValue placeholder="Pilih tujuan wisata" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-purple-500/50">
                      {DESTINATIONS.map(dest => (
                        <SelectItem 
                          key={dest.id} 
                          value={dest.id} 
                          className="text-white hover:bg-purple-500/20"
                        >
                          <div className="flex items-center justify-between gap-3 w-full">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{dest.emoji}</span>
                              <span className="font-medium">{dest.name}</span>
                            </div>
                            <span className="text-xs text-cyan-400 font-semibold whitespace-nowrap">
                              {dest.basePrice} ETH
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date" className="text-gray-300">Tanggal Mulai</Label>
                    <DatePicker
                      id="start-date"
                      value={startDate}
                      onChange={setStartDate}
                      placeholder="Pilih tanggal mulai"
                      disablePastDates={true}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date" className="text-gray-300">Tanggal Selesai</Label>
                    <DatePicker
                      id="end-date"
                      value={endDate}
                      onChange={setEndDate}
                      placeholder="Pilih tanggal selesai"
                      disablePastDates={true}
                      className="mt-1"
                    />
                  </div>
                </div>

                {startDate && endDate && (
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-300 font-medium">
                        Durasi Perjalanan: {numberOfDays} hari
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </NeonCard>

          {/* Total Price Summary */}
          <NeonCard glowColor="cyan" intense>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Total Paket</h3>
                {currentDestination && (
                  <Badge className={`bg-${getDestinationTierColor(currentDestination.tier)}-500/20 text-${getDestinationTierColor(currentDestination.tier)}-300 border-${getDestinationTierColor(currentDestination.tier)}-500/50`}>
                    {getDestinationTierLabel(currentDestination.tier)}
                  </Badge>
                )}
              </div>
              
              <div className="text-center py-6">
                <p className="text-4xl font-bold text-cyan-400">{calculateTotal()} ETH</p>
                <p className="text-gray-400 mt-2">
                  {selectedDestination && startDate && endDate
                    ? `Paket lengkap ${numberOfDays} hari`
                    : 'Pilih destinasi dan tanggal'
                  }
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>✈️ Penerbangan PP (Pergi-Pulang)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>🏨 Hotel Mewah {numberOfDays} malam</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>🚗 Transportasi Darat Lengkap</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>🍽️ Semua Makanan (3x sehari)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>🎭 Aktivitas Wisata Premium</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>🎁 Voucher Belanja Oleh-oleh</span>
                </div>
              </div>
            </div>
          </NeonCard>
        </div>

        {/* Package Details Preview */}
        <NeonCard glowColor="cyan" className="h-fit">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-cyan-400" />
              <h3 className="text-xl font-semibold text-white">Yang Termasuk Dalam Paket</h3>
            </div>

            {currentDestination ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {currentDestination.emoji} {currentDestination.name}
                  </h4>
                  <p className="text-gray-300 text-sm mb-4">{currentDestination.description}</p>
                  
                  {(() => {
                    // Extract and validate highlights safely
                    const highlights = currentDestination?.highlights || [];
                    const validHighlights = Array.isArray(highlights) ? highlights.filter((h: unknown) => typeof h === 'string' && h.length > 0) : [];
                    const displayHighlights = validHighlights.length > 0 ? validHighlights.slice(0, 6) : [];
                    
                    if (displayHighlights.length === 0) return null;
                    
                    return (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">Highlights:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {displayHighlights.map((highlight: string, index: number) => (
                            <div key={`highlight-${currentDestination.id}-${index}`} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-300">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <h4 className="text-sm font-semibold text-purple-300 mb-3">📋 Layanan Termasuk:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-gray-300">2x Penerbangan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hotel className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-gray-300">{numberOfDays}x Hotel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-gray-300">{numberOfDays}x Transport</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-gray-300">{numberOfDays * 3}x Meals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-gray-300">{numberOfDays * 2}x Activities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-gray-300">1x Shopping</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-cyan-300 font-medium text-sm">Paket All-Inclusive</h4>
                      <p className="text-cyan-200 text-xs mt-1">
                        Semua layanan sudah termasuk dalam harga. Tidak ada biaya tersembunyi. Pembayaran di-hold di escrow dan dirilis per milestone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Pilih destinasi untuk melihat detail paket
                </p>
              </div>
            )}
          </div>
        </NeonCard>
      </div>

      {/* Create Package Button */}
      <div className="text-center">
        <NeonButton
          size="lg"
          disabled={!isFormValid}
          onClick={handleCreatePackage}
          className="min-w-64"
        >
          <span>Buat Paket Perjalanan</span>
          <ArrowRight className="h-5 w-5" />
        </NeonButton>
        
        {!isFormValid && (
          <p className="text-gray-400 text-sm mt-4">
            Lengkapi destinasi dan tanggal perjalanan untuk melanjutkan
          </p>
        )}
      </div>
    </div>
  );
}
