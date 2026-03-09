import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update wholesale vehicle
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
    if (data.price) updateData.price = parseFloat(data.price);
    if (data.mileage) updateData.mileage = parseInt(data.mileage);
    if (data.location) updateData.location = data.location;
    if (data.radius) updateData.radius = parseInt(data.radius);
    if (data.images) updateData.images = JSON.stringify(data.images);
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.status) updateData.status = data.status;

    const vehicle = await prisma.wholesaleVehicle.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error updating wholesale vehicle:', error);
    return NextResponse.json({ error: 'Failed to update wholesale vehicle' }, { status: 500 });
  }
}

// DELETE - Delete wholesale vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.wholesaleVehicle.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wholesale vehicle:', error);
    return NextResponse.json({ error: 'Failed to delete wholesale vehicle' }, { status: 500 });
  }
}
