import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch single vehicle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json({ error: 'Failed to fetch vehicle' }, { status: 500 });
  }
}

// PUT - Update vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: any = {};
    if (data.year) updateData.year = parseInt(data.year);
    if (data.make) updateData.make = data.make;
    if (data.model) updateData.model = data.model;
    if (data.trim !== undefined) updateData.trim = data.trim || null;
    if (data.price) updateData.price = parseFloat(data.price);
    if (data.mileage) updateData.mileage = parseInt(data.mileage);
    if (data.color) updateData.color = data.color;
    if (data.vin !== undefined) updateData.vin = data.vin || null;
    if (data.engine !== undefined) updateData.engine = data.engine || null;
    if (data.transmission !== undefined) updateData.transmission = data.transmission || null;
    if (data.fuelType !== undefined) updateData.fuelType = data.fuelType || null;
    if (data.condition !== undefined) updateData.condition = data.condition || null;
    if (data.vehicleType) updateData.vehicleType = data.vehicleType;
    if (data.status) updateData.status = data.status;
    if (data.dailyRate !== undefined) updateData.dailyRate = data.dailyRate ? parseFloat(data.dailyRate) : null;
    if (data.weeklyRate !== undefined) updateData.weeklyRate = data.weeklyRate ? parseFloat(data.weeklyRate) : null;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.images) updateData.images = JSON.stringify(data.images);
    if (data.description !== undefined) updateData.description = data.description || null;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
  }
}

// DELETE - Delete vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.vehicle.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
}
