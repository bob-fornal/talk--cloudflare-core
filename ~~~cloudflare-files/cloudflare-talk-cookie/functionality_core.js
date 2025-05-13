
export function handleCookie(request, response, hostname) {
  const cookieDomain = hostname;
  const cookieExpiration = 86400;
  
  const city = request.cf.city || 'not captured';
  const state = request.cf.region || request.cf.regionCode || 'not captured';
  const zipcode = request.cf.postalCode || 'not captured';
  const cookieValue = JSON.stringify({ city, state, zipcode });

  response = new Response(response.body, response);
  response.headers.set(
    'Set-Cookie',
    `CloudflareDemo=${cookieValue}; Max-Age=${cookieExpiration};Domain=${cookieDomain};`,
  );

  return response;
}