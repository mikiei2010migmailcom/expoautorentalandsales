import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT update purchase application (approve/reject)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const application = await db.purchaseApplication.update({
      where: { id },
      data: {
        status: body.status,
      }
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating purchase application:', error);
    return NextResponse.json({ error: 'Failed to update purchase application' }, { status: 500 });
  }
}

// DELETE purchase application
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.purchaseApplication.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting purchase application:', error);
    return NextResponse.json({ error: 'Failed to delete purchase application' }, { status: 500 });
  }
}
