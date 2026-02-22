'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Car,
  Gauge,
  Fuel,
  Cog,
  Palette,
  Calendar,
  CheckCircle2,
  Phone,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import PurchaseAgreementModal from './PurchaseAgreementModal';
import RentalApplicationModal from './RentalApplicationModal';

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  price: number;
  mileage: number;
  color: string;
  vin: string | null;
  engine: string | null;
  transmission: string | null;
  fuelType: string | null;
  condition: string | null;
  vehicleType: string;
  status: string;
  dailyRate: number | null;
  weeklyRate: number | null;
  images: string;
  description: string | null;
}

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VehicleDetailModal({
  vehicle,
  open,
  onOpenChange,
}: VehicleDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showRentalModal, setShowRentalModal] = useState(false);

  const images = JSON.parse(vehicle.images || '[]');
  const hasImages = images.length > 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const canPurchase = vehicle.status === 'For Sale' || vehicle.status === 'Both';
  const canRent = vehicle.status === 'For Rent' || vehicle.status === 'Both';

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.trim && <span className="text-gray-400"> - {vehicle.trim}</span>}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image Carousel */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
              {hasImages ? (
                <>
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-red-500' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Car className="w-20 h-20 text-gray-600" />
                </div>
              )}
            </div>

            {/* Price and Status */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-3xl font-bold text-red-500">
                  {formatPrice(vehicle.price)}
                </div>
                {vehicle.dailyRate && (
                  <div className="text-sm text-gray-400">
                    Rental: ${vehicle.dailyRate}/day
                    {vehicle.weeklyRate && ` | $${vehicle.weeklyRate}/week`}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Badge className="bg-red-600 text-white">{vehicle.vehicleType}</Badge>
                {vehicle.condition && (
                  <Badge variant="outline" className="border-zinc-600 text-gray-300">
                    {vehicle.condition}
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <Calendar className="w-5 h-5 text-red-500 mx-auto mb-2" />
                <div className="text-white font-semibold">{vehicle.year}</div>
                <div className="text-xs text-gray-400">Year</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <Gauge className="w-5 h-5 text-red-500 mx-auto mb-2" />
                <div className="text-white font-semibold">{formatMileage(vehicle.mileage)}</div>
                <div className="text-xs text-gray-400">Miles</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <Palette className="w-5 h-5 text-red-500 mx-auto mb-2" />
                <div className="text-white font-semibold">{vehicle.color}</div>
                <div className="text-xs text-gray-400">Color</div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <Fuel className="w-5 h-5 text-red-500 mx-auto mb-2" />
                <div className="text-white font-semibold">{vehicle.fuelType || 'N/A'}</div>
                <div className="text-xs text-gray-400">Fuel Type</div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-zinc-800 border-zinc-700 w-full">
                <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-red-600">
                  Details
                </TabsTrigger>
                <TabsTrigger value="specs" className="flex-1 data-[state=active]:bg-red-600">
                  Specifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-400 text-sm">
                      {vehicle.description || 'No description available for this vehicle.'}
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['Clean Title', 'Inspected', 'CarFax Available', 'Warranty Available'].map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="mt-4">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">VIN:</span>
                        <span className="text-white font-mono text-sm">{vehicle.vin || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Engine:</span>
                        <span className="text-white">{vehicle.engine || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transmission:</span>
                        <span className="text-white">{vehicle.transmission || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fuel Type:</span>
                        <span className="text-white">{vehicle.fuelType || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Condition:</span>
                        <span className="text-white">{vehicle.condition || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Vehicle Type:</span>
                        <span className="text-white">{vehicle.vehicleType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-800">
              {canPurchase && (
                <Button
                  onClick={() => setShowPurchaseModal(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Purchase This Vehicle
                </Button>
              )}
              {canRent && (
                <Button
                  onClick={() => setShowRentalModal(true)}
                  variant="outline"
                  className="flex-1 border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                >
                  Apply for Rental
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
              >
                <a href="tel:337-706-7863">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Purchase Agreement Modal */}
      <PurchaseAgreementModal
        vehicle={vehicle}
        open={showPurchaseModal}
        onOpenChange={setShowPurchaseModal}
      />

      {/* Rental Application Modal */}
      <RentalApplicationModal
        vehicle={vehicle}
        open={showRentalModal}
        onOpenChange={setShowRentalModal}
      />
    </>
  );
}
