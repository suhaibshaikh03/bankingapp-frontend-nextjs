import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
// Banking routes are handled by ProtectedRoute component instead of middleware
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
];

export function middleware(request: NextRequest) {
  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Get the token from cookies or headers
  const token = request.cookies.get('accessToken')?.value ||
                request.headers.get('Authorization')?.replace('Bearer ', '');

  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !token) {
    // Store the original destination URL for redirect after login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('return', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If user is on login page but already has a token, redirect to dashboard
  if (request.nextUrl.pathname.startsWith('/login') && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Continue to the requested page
  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};