export function do301Redirect(redirectTo, queryString = '') {
  const urlRedirect = new URL(redirectTo);

  const response = new Response('', {
    status: 301,
    statusText: 'Moved Permanently',
    headers: new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check',
      'Pragma': 'no-cache',
      'Expires': 'Sun, 01 Jan 2014 00:00:00 GMT',
      'Location': urlRedirect.toString(),
      'X-Location': urlRedirect.toString(),
    }),
  });

  // Redirects do not need a content type
  // myResponse.headers.delete("Content-Type");
  return response;
}
