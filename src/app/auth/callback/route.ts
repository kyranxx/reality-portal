import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Firebase handles authentication redirects client-side
  // This route is kept for compatibility and to handle any redirects

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
