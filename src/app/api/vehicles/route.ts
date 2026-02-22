import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all vehicles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const vehicleType = searchParams.get('vehicleType');
    const featured = searchParams.get('featured');

    const where: any = {};
    if (status) where.status = status;
    if (vehicleType) where.vehicleType = vehicleType;
    if (featured === 'true') where.featured = true;

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

// POST - Create new vehicle
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const vehicle = await prisma.vehicle.create({
      data: {
        year: parseInt(data.year),
        make: data.make,
        model: data.model,
        trim: data.trim || null,
        price: parseFloat(data.price),
        mileage: parseInt(data.mileage),
        color: data.color,
        vin: data.vin || null,
        engine: data.engine || null,
        transmission: data.transmission || null,
        fuelType: data.fuelType || null,
        condition: data.condition || null,
        vehicleType: data.vehicleType,
        status: data.status,
        dailyRate: data.dailyRate ? parseFloat(data.dailyRate) : null,
        weeklyRate: data.weeklyRate ? parseFloat(data.weeklyRate) : null,
        featured: data.featured || false,
        images: JSON.stringify(data.images || []),
        description: data.description || null,
      }
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}
