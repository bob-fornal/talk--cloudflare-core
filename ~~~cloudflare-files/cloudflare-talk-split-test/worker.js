import { doABTest } from "./functionality_core.js";

export default {
  async fetch(request, env, ctx) {
    const active = await env.ADMIN_KV.get('redirect-on');
    if (active === 'false') {
      const response = await fetch(request);
      return response;
    }

    const urlObject = new URL(request.url);
    const params = new URLSearchParams(urlObject.search);
    const rootUrl = urlObject.protocol + urlObject.hostname;
    const page = params.get('page');
    const vanityUrl = `${rootUrl}/pages/page/?page=${page}`;

    const destinationString = await env.KV.get(vanityUrl);
    if (destinationString === null) {
      const response = await fetch(request);
      return response;
    }
    const action = JSON.parse(destinationString);

    return doABTest(rootUrl, action.redirects, urlObject.search);
  },
};
