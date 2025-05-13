
export function getCookie(request, name) {
  const cookieString = request.headers.get('Cookie') || ''
  const cookies = cookieString.split(';').map(cookie => cookie.trim())
  const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`))
  return cookie ? cookie.split('=')[1] : null
}

export function handleCookie(request, response, hostname) {
  const cookieName = 'clientIPAddress';
  const cookieDomain = hostname;
  const cookieValue = request.headers.get('CF-Connecting-IP');
  const cookieExpiration = 86400; // 1 day in seconds
  
  // Check if the cookie exists
  const cookie = getCookie(request, cookieName);
  
  if (!cookie && cookieValue) {
    // Create a new response with the Set-Cookie header
    response = new Response(response.body, response);
    response.headers.set(
      'Set-Cookie',
      `${cookieName}=${cookieValue}; Max-Age=${cookieExpiration};Domain=${cookieDomain};`,
    );
  }

  return response;
}