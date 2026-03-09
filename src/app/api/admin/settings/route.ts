import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyCredentials, hashPassword, isAuthenticated } from '@/lib/auth/auth';

// GET - List admin users (for authenticated admins)
export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admins = await db.adminUser.findMany({
      select: { id: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

// POST - Handle settings actions
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'changePassword': {
        const { currentPassword, newPassword } = body;
        
        // Verify current password
        const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
        if (!verifyCredentials(defaultUsername, currentPassword)) {
          // Check if there's a custom admin in database
          const admins = await db.adminUser.findMany();
          let validPassword = false;
          
          for (const admin of admins) {
            if (admin.email === defaultUsername && admin.password === hashPassword(currentPassword)) {
              validPassword = true;
              break;
            }
          }
          
          if (!validPassword) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
          }
        }

        // Update or create admin user with new password
        const hashedPassword = hashPassword(newPassword);
        await db.adminUser.upsert({
          where: { email: defaultUsername },
          update: { password: hashedPassword },
          create: { email: defaultUsername, password: hashedPassword }
        });

        return NextResponse.json({ success: true, message: 'Password changed successfully' });
      }

      case 'addAdmin': {
        const { username, password } = body;

        if (!username || !password) {
          return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        if (password.length < 6) {
          return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Check if admin already exists
        const existing = await db.adminUser.findUnique({
          where: { email: username }
        });

        if (existing) {
          return NextResponse.json({ error: 'Admin user already exists' }, { status: 400 });
        }

        // Create new admin
        const hashedPassword = hashPassword(password);
        await db.adminUser.create({
          data: { email: username, password: hashedPassword }
        });

        return NextResponse.json({ success: true, message: 'Admin user created successfully' });
      }

      case 'deleteAdmin': {
        const { adminId } = body;

        if (!adminId) {
          return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
        }

        await db.adminUser.delete({
          where: { id: adminId }
        });

        return NextResponse.json({ success: true, message: 'Admin user deleted successfully' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin settings error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
