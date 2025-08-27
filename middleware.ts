// Simple middleware for Next.js i18n
export { default } from 'next-intl/middleware';

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
