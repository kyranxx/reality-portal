import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware for handling global application concerns like CORS and security headers
 * This runs before any route or API handler
 */
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname, origin } = request.nextUrl;
  
  // Get the host from the request
  const hostName = request.headers.get('host') || '';
  
  // Initialize response with forwarded request
  const response = NextResponse.next();

  // Extract Vercel environment information from headers
  const isVercelEnv = process.env.VERCEL === '1' || request.headers.has('x-vercel-deployment-url');
  const isPreviewDeployment = !!request.headers.get('x-vercel-deployment-url')?.includes('preview');
  
  /**
   * CORS Headers Configuration
   * Set headers conditionally based on resource type and environment
   */ 
  
  // Set basic CORS headers for all responses
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  // Set extra security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // For static assets, add caching headers
  if (
    pathname.includes('/_next/static') ||
    pathname.includes('/images/') ||
    pathname.includes('/fonts/') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|ico|svg)$/)
  ) {
    // Cache static assets for up to 1 year (far-future expiry)
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    // Set stricter CORS for static resources (allow all origins for assets)
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    // Allow credentials for cross-origin requests
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  // For API routes, customize CORS differently
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 200,
        headers: response.headers,
      });
    }
  }
  
  // Add monitoring headers to track deployments and environments
  if (isVercelEnv) {
    response.headers.set('X-Deployment-Environment', isPreviewDeployment ? 'preview' : 'production');
  }
  
  // Special handling for root domain vs. preview deployments
  if (isVercelEnv && hostName.includes('vercel.app')) {
    const isPreviewUrl = /-[a-z0-9]+-[a-z0-9]+\.vercel\.app$/.test(hostName);
    if (isPreviewUrl) {
      // This is a preview deployment
      response.headers.set('X-Preview-Deployment', 'true');
      
      // Allow cross-domain access between preview and production
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
  }
  
  return response;
}

/**
 * Configure which paths this middleware is run for
 * This middleware will run for all paths
 */
export const config = {
  matcher: [
    // Match all paths except for:
    // - API routes that handle their own CORS
    // - Static files with extensions (handled by Vercel Edge config)
    // - Next.js internal paths
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
