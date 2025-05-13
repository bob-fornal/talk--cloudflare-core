import { handleCookie } from './assets/functionality_core.js';

export default {
  async fetch(request, env, ctx) {
    const urlObject = new URL(request.url);
    const domain = urlObject.hostname;
    const response = await fetch(request);

    const cookieResponse = handleCookie(request, response, domain);
    return cookieResponse;
  },
};
