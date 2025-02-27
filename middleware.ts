// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default clerkMiddleware((_authFn, _req: NextRequest) => {
  // Just allow all requests
  return NextResponse.next();
});

export const config = {
  matcher: [
    // If you want it to run on all routes except static files:
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
};
