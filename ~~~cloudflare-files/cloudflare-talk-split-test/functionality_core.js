
export function doABTest(abOptions, queryString) {
  const randomPercent = Math.round(Math.random() * 100);
  var percentStep = 0;

  for (let option of abOptions) {
    percentStep += +option.percent || 0; // add value or 0 if value is not set

    if (percentStep === 100 || randomPercent < percentStep) {
      return do302RedirectForSplitTest(option.url, queryString);
    }
  }

  // If we made it this far, we need to redirect with the last test option...
  const abOptionsLastValue = abOptions[abOptions.length - 1].url;
  return do302RedirectForSplitTest(abOptionsLastValue, queryString);
}

export function do302RedirectForSplitTest(redirectTo, queryString = '') {
  const urlRedirect = new URL(redirectTo);
  urlRedirect.search = fixUrlRedirectSearch(urlRedirect.search, queryString);

  const response = new Response('', {
    status: 302,
    statusText: 'Found',
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

export function fixUrlRedirectSearch(search, queryString) {
  if (queryString === '') return search;

  let adjustQueryString = queryString[0] === '?' ? queryString.slice(1) : queryString;
  adjustQueryString.replaceAll('%3D', '=').replaceAll('%26', '&');

  return search.length === 0 ? adjustQueryString : search + '&' + adjustQueryString;
}
