import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all purchase applications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const applications = await db.purchaseApplication.findMany({
      where,
      include: {
        vehicle: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching purchase applications:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase applications' }, { status: 500 });
  }
}

// POST create new purchase application
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const application = await db.purchaseApplication.create({
      data: {
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail,
        customerAddress: body.customerAddress,
        vehicleId: body.vehicleId,
        agreedToTerms: body.agreedToTerms,
        status: 'pending',
      }
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error creating purchase application:', error);
    return NextResponse.json({ error: 'Failed to create purchase application' }, { status: 500 });
  }
}
