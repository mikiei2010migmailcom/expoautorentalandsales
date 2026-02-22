import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all contact inquiries
export async function GET(request: NextRequest) {
  try {
    const inquiries = await prisma.contactInquiry.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

// POST - Create new contact inquiry
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        vehicleId: data.vehicleId || null,
        message: data.message
      }
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 });
  }
}
