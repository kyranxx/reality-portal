import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware handles client-side navigation for protected routes
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Check if the request is for a protected route
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/admin');

  // If it's a protected route, rewrite to the client component
  if (isProtectedRoute) {
    // For dashboard routes
    if (pathname === '/dashboard') {
      url.pathname = '/dashboard/client';
      return NextResponse.rewrite(url);
    }
    
    // For dashboard/profile routes
    if (pathname === '/dashboard/profile') {
      url.pathname = '/dashboard/profile/client';
      return NextResponse.rewrite(url);
    }
    
    // For admin routes
    if (pathname === '/admin') {
      url.pathname = '/admin/client';
      return NextResponse.rewrite(url);
    }
  }

  // Continue to the requested page for non-protected routes
  return NextResponse.next();
}

// Match all routes except static files and API routes
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
