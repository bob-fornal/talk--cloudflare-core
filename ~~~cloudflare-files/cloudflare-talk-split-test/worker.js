import { doABTest } from "./functionality_core.js";

export default {
  async fetch(request, env, ctx) {
    const active = await env.ADMIN_KV.get('split-test-on');
    if (active === 'false') {
      const response = await fetch(request);
      return response;
    }

    const urlObject = new URL(request.url);
    const params = new URLSearchParams(urlObject.search);
    const key = params.get('page');

    const destinationString = await env.KV.get(key);
    if (destinationString === null) {
      const response = await fetch(request);
      return response;
    }
    const action = JSON.parse(destinationString);

    return doABTest(action.redirects, urlObject.search);
  },
};
