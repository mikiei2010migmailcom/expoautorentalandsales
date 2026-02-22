import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT update rental application (approve/reject)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const application = await db.rentalApplication.update({
      where: { id },
      data: {
        status: body.status,
      }
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating rental application:', error);
    return NextResponse.json({ error: 'Failed to update rental application' }, { status: 500 });
  }
}

// DELETE rental application
export async function DELETE(
  request: Request,
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
