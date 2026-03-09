import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all wholesale vehicles
export async function GET(request: NextRequest) {
  try {
    const vehicles = await db.wholesaleVehicle.findMany({
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
    
    const vehicle = await db.wholesaleVehicle.create({
      data: {
        year: parseInt(data.year),
        make: data.make,
        model: data.model,
        price: parseFloat(data.price),
        mileage: parseInt(data.mileage),
        location: data.location,
        radius: parseInt(data.radius) || 250,
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
