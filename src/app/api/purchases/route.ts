import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all purchase applications
export async function GET(request: NextRequest) {
  try {
    const applications = await db.purchaseApplication.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching purchase applications:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase applications' }, { status: 500 });
  }
}

// POST - Create new purchase application
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const application = await db.purchaseApplication.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        customerAddress: data.customerAddress,
        vehicleId: data.vehicleId,
        agreedToTerms: data.agreedToTerms,
        status: 'pending'
      }
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error creating purchase application:', error);
    return NextResponse.json({ error: 'Failed to create purchase application' }, { status: 500 });
  }
}
