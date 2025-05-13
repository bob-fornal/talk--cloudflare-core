import { do301Redirect } from "./functionality_core.js";

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
    const redirect = `${rootUrl}/pages/page/?page=${page}`;

    return do301Redirect(redirect);
  },
};
