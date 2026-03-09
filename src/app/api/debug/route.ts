import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Dynamic import to check Prisma client
    const { db } = await import('@/lib/db');

    // Try a simple query
    const result = await db.$queryRaw`SELECT 1 as test`;

    return NextResponse.json({
      status: 'connected',
      result,
      env: {
        hasVehicleDbUrl: !!process.env.vehicle_DATABASE_URL,
        hasDbUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack,
      env: {
        hasVehicleDbUrl: !!process.env.vehicle_DATABASE_URL,
        hasDbUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
}
