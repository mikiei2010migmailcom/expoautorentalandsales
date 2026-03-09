import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all rental applications
export async function GET(request: NextRequest) {
  try {
    const applications = await prisma.rentalApplication.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching rental applications:', error);
    return NextResponse.json({ error: 'Failed to fetch rental applications' }, { status: 500 });
  }
}

// POST - Create new rental application
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const application = await prisma.rentalApplication.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        customerAddress: data.customerAddress,
        driverLicense: data.driverLicense || null,
        vehicleId: data.vehicleId,
        startDate: data.startDate,
        endDate: data.endDate,
        hasInsurance: data.hasInsurance,
        insuranceDoc: data.insuranceDoc || null,
        dealerInsurance: data.dealerInsurance ? parseFloat(data.dealerInsurance) : null,
        agreedToTerms: data.agreedToTerms,
        status: 'pending'
      }
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error creating rental application:', error);
    return NextResponse.json({ error: 'Failed to create rental application' }, { status: 500 });
  }
}
