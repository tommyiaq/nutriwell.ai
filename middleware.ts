/**
 * Next.js Middleware for NutriWell.ai
 * 
 * Handles internationalization (i18n) routing and language detection.
 * This middleware runs before every request to determine the appropriate
 * locale and redirect users to the correct language version.
 * 
 * Features:
 * - Automatic language detection from browser preferences
 * - URL-based locale routing (/en/*, /it/*)
 * - Fallback to default locale (English)
 * - Excludes API routes and static assets
 */

import createMiddleware from 'next-intl/middleware';

/**
 * Create internationalization middleware with configuration
 */
const intlMiddleware = createMiddleware({
  // List of supported locales
  locales: ['en', 'it'],
  
  // Default locale when none is specified
  defaultLocale: 'en',
  
  // Enable automatic locale detection from Accept-Language header
  localeDetection: true,
});

/**
 * Export the configured middleware
 */
export default intlMiddleware;

/**
 * Middleware configuration
 * 
 * The matcher pattern excludes:
 * - API routes (/api/*)
 * - Next.js internal files (/_next/*)
 * - Static files with extensions (images, fonts, etc.)
 * - Favicon and other root-level assets
 */
export const config = {
  matcher: [
    // Match all pathnames except for:
    // - API routes
    // - Next.js internals
    // - Static files (including images, fonts, etc.)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
