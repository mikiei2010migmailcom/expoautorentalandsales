import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT - Update rental application status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: any = {};
    if (data.status) updateData.status = data.status;

    const application = await db.rentalApplication.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating rental application:', error);
    return NextResponse.json({ error: 'Failed to update rental application' }, { status: 500 });
  }
}

// DELETE - Delete rental application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.rentalApplication.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rental application:', error);
    return NextResponse.json({ error: 'Failed to delete rental application' }, { status: 500 });
  }
}
