import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample vehicles
  const vehicles = [
    {
      year: 2022,
      make: 'Toyota',
      model: 'Camry',
      trim: 'XLE',
      price: 28500,
      mileage: 25000,
      color: 'Silver',
      vin: '4T1BZ1HK0NU123456',
      engine: '2.5L 4-Cylinder',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      condition: 'Excellent',
      vehicleType: 'Sedan',
      status: 'For Sale',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800']),
      description: 'Well-maintained Toyota Camry with low mileage. Perfect for daily commuting.'
    },
    {
      year: 2023,
      make: 'Honda',
      model: 'CR-V',
      trim: 'EX-L',
      price: 35000,
      mileage: 15000,
      color: 'Black',
      vin: '2HKRW2H59PH123789',
      engine: '1.5L Turbo',
      transmission: 'CVT',
      fuelType: 'Gasoline',
      condition: 'Excellent',
      vehicleType: 'SUV',
      status: 'Both',
      dailyRate: 75,
      weeklyRate: 450,
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1568844293986-8c3a2ed6c22?w=800']),
      description: 'Spacious SUV perfect for families. Available for sale or rent.'
    },
    {
      year: 2021,
      make: 'Ford',
      model: 'F-150',
      trim: 'XLT',
      price: 42000,
      mileage: 35000,
      color: 'White',
      vin: '1FTEW1E53MF123456',
      engine: '3.3L V6',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      condition: 'Good',
      vehicleType: 'Truck',
      status: 'For Sale',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800']),
      description: 'Reliable Ford F-150 truck, perfect for work or personal use.'
    },
    {
      year: 2023,
      make: 'Nissan',
      model: 'Altima',
      trim: 'SV',
      price: 26000,
      mileage: 12000,
      color: 'Blue',
      vin: '1N4AL3AP4HN123456',
      engine: '2.5L 4-Cylinder',
      transmission: 'CVT',
      fuelType: 'Gasoline',
      condition: 'Excellent',
      vehicleType: 'Sedan',
      status: 'For Rent',
      dailyRate: 55,
      weeklyRate: 320,
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800']),
      description: 'Comfortable sedan available for daily or weekly rental.'
    },
    {
      year: 2020,
      make: 'Chevrolet',
      model: 'Corvette',
      trim: 'Stingray',
      price: 65000,
      mileage: 18000,
      color: 'Red',
      vin: '1G1YY22G9L5123456',
      engine: '6.2L V8',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      condition: 'Excellent',
      vehicleType: 'Sports',
      status: 'For Sale',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800']),
      description: 'Stunning Corvette Stingray in pristine condition. A true sports car experience.'
    },
    {
      year: 2022,
      make: 'Jeep',
      model: 'Wrangler',
      trim: 'Sport',
      price: 38000,
      mileage: 28000,
      color: 'Green',
      vin: '1C4HJXDG6NW123456',
      engine: '3.6L V6',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      condition: 'Good',
      vehicleType: 'SUV',
      status: 'Both',
      dailyRate: 95,
      weeklyRate: 575,
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800']),
      description: 'Adventure-ready Jeep Wrangler. Great for off-road or city driving.'
    }
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.create({ data: vehicle });
  }

  // Create sample reviews
  const reviews = [
    {
      name: 'John D.',
      rating: 5,
      text: 'Excellent service! Found the perfect car for my family. The staff was very helpful and professional.',
      status: 'approved'
    },
    {
      name: 'Sarah M.',
      rating: 5,
      text: 'Rented a car for my vacation and it was a great experience. The vehicle was clean and well-maintained.',
      status: 'approved'
    },
    {
      name: 'Mike T.',
      rating: 4,
      text: 'Good selection of vehicles at fair prices. The financing process was smooth and quick.',
      status: 'approved'
    }
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
