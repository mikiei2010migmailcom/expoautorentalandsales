import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all wholesale vehicles
export async function GET(request: NextRequest) {
  try {
    const vehicles = await prisma.wholesaleVehicle.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching wholesale vehicles:', error);
    return NextResponse.json({ error: 'Failed to fetch wholesale vehicles' }, { status: 500 });
  }
}

// POST - Create new wholesale vehicle
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const vehicle = await prisma.wholesaleVehicle.create({
      data: {
        year: parseInt(data.year),
        make: data.make,
        model: data.model,
        price: parseFloat(data.price),
        mileage: parseInt(data.mileage),
        location: data.location,
        radius: parseInt(data.radius),
        images: JSON.stringify(data.images || []),
        description: data.description || null,
        status: 'available'
      }
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error creating wholesale vehicle:', error);
    return NextResponse.json({ error: 'Failed to create wholesale vehicle' }, { status: 500 });
  }
}
