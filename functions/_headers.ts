// Cloudflare Pages Functions - Custom Headers
// This file adds security headers to all responses

export const onRequest: PagesFunction = async ({ request, next }) => {
  const response = await next();
  
  // Clone response to modify headers
  const newHeaders = new Headers(response.headers);
  
  // Security headers
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-Frame-Options', 'DENY');
  newHeaders.set('X-XSS-Protection', '1; mode=block');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Cache headers for static assets
  const url = new URL(request.url);
  if (url.pathname.match(/\.(css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    newHeaders.set('Cache-Control', 'public, max-age=3600');
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};
