import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes using createRouteMatcher
const isPublicRoute = createRouteMatcher([
  '/', '/sign-in(.*)',
  '/sign-up(.*)' // Root route is public
  // Add other public routes here if needed
]);

export default clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect()
    }
  })
  

export const config = {
  matcher: [
    // Match all routes except for static files and Next.js internals
    '/((?!_next|static|favicon.ico|.*\\..*).*)',
    // Include API routes
    '/(api|trpc)(.*)',
  ],
};
