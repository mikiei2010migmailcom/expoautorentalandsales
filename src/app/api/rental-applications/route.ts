import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all rental applications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const applications = await db.rentalApplication.findMany({
      where,
      include: {
        vehicle: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching rental applications:', error);
    return NextResponse.json({ error: 'Failed to fetch rental applications' }, { status: 500 });
  }
}

// POST create new rental application
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const application = await db.rentalApplication.create({
      data: {
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail,
        customerAddress: body.customerAddress,
        driverLicense: body.driverLicense || null,
        vehicleId: body.vehicleId,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        hasInsurance: body.hasInsurance,
        insuranceDoc: body.insuranceDoc || null,
        dealerInsurance: body.dealerInsurance ? parseFloat(body.dealerInsurance) : null,
        agreedToTerms: body.agreedToTerms,
        status: 'pending',
      }
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error creating rental application:', error);
    return NextResponse.json({ error: 'Failed to create rental application' }, { status: 500 });
  }
}
