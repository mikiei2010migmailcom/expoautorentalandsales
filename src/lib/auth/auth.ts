import { cookies } from 'next/headers';
import crypto from 'crypto';

// Session secret for signing tokens
const SESSION_SECRET = process.env.SESSION_SECRET || 'expo-auto-rentals-secret-key-2024';

// Admin credentials - computed lazily to avoid build-time issues
function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash: process.env.ADMIN_PASSWORD_HASH || hashPassword('ExpoAuto2024!')
  };
}

// Hash password using SHA-256
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Create session token
export function createSessionToken(username: string): string {
  const payload = JSON.stringify({ 
    username, 
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}.${signature}`).toString('base64');
}

// Verify session token
export function verifySessionToken(token: string): { username: string; exp: number } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [payloadStr, signature] = decoded.split('.');
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadStr)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(payloadStr);
    
    // Check expiration
    if (payload.exp < Date.now()) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

// Verify credentials
export function verifyCredentials(username: string, password: string): boolean {
  const creds = getAdminCredentials();
  return username === creds.username && hashPassword(password) === creds.passwordHash;
}

// Get current session from cookies
export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  
  if (!token) {
    return null;
  }
  
  const payload = verifySessionToken(token);
  return payload ? { username: payload.username } : null;
}

// Check if request is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

// Set session cookie
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
}

// Clear session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}
