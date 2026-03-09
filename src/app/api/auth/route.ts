import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSessionToken, setSessionCookie, isAuthenticated, clearSessionCookie } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password, action } = await request.json();

    // Handle logout
    if (action === 'logout') {
      await clearSessionCookie();
      return NextResponse.json({ success: true, message: 'Logged out successfully' });
    }

    // Handle login
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (await verifyCredentials(username, password)) {
      const token = createSessionToken(username);
      await setSessionCookie(token);
      return NextResponse.json({ success: true, message: 'Login successful' });
    }

    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    return NextResponse.json({ authenticated });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
