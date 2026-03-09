'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Fuel, Gauge, Calendar, ArrowRight, Eye } from 'lucide-react';
import Image from 'next/image';
import VehicleDetailModal from '@/components/modals/VehicleDetailModal';

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  price: number;
  mileage: number;
  color: string;
  images: string;
  vehicleType: string;
  status: string;
  dailyRate: number | null;
  weeklyRate: number | null;
}

export default function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedVehicles();
  }, []);

  const fetchFeaturedVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles?featured=true');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching featured vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getMainImage = (images: string) => {
    try {
      const parsed = JSON.parse(images);
      return parsed[0] || '/images/placeholder-car.png';
    } catch {
      return '/images/placeholder-car.png';
    }
  };

  const scrollToInventory = () => {
    const element = document.querySelector('#inventory');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Vehicles</h2>
            <p className="text-gray-400">Loading inventory...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-red-600/20 text-red-400 border-red-600/30 mb-4">
            Premium Selection
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Vehicles
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our hand-picked selection of premium vehicles, each inspected and certified for quality and performance.
          </p>
        </div>

        {/* Vehicles Grid */}
        {vehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="group bg-zinc-900/50 border-zinc-800 hover:border-red-600/50 transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={getMainImage(vehicle.images)}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-red-600 text-white text-xs">
                        {vehicle.vehicleType}
                      </Badge>
                      {vehicle.status === 'Both' && (
                        <Badge className="bg-green-600 text-white text-xs">
                          Sale & Rent
                        </Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                          {vehicle.year} {vehicle.make}
                        </h3>
                        <p className="text-gray-400 text-sm">{vehicle.model} {vehicle.trim}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-red-500">
                          {formatPrice(vehicle.price)}
                        </div>
                        {vehicle.dailyRate && (
                          <div className="text-xs text-gray-500">
                            or ${vehicle.dailyRate}/day
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Gauge className="w-4 h-4" />
                        {formatMileage(vehicle.mileage)} mi
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="w-4 h-4" />
                        {vehicle.color}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-10">
              <Button
                onClick={scrollToInventory}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 group"
              >
                View All Inventory
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Vehicles Listed Yet</h3>
            <p className="text-gray-400 mb-6">Check back soon for our updated inventory!</p>
            <Button
              onClick={() => scrollToInventory()}
              className="bg-red-600 hover:bg-red-700"
            >
              Browse All Vehicles
            </Button>
          </div>
        )}
      </div>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          open={!!selectedVehicle}
          onOpenChange={(open) => !open && setSelectedVehicle(null)}
        />
      )}
    </section>
  );
}
