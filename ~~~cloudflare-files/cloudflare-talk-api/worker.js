import { handleAuth, statuses } from './auth.js';
import { handleGetRequest, handlePostRequest } from './functionality_core.js';

export default {
  async fetch(request, env, ctx) {
    const urlObject = new URL(request.url);
    const pathname = urlObject.pathname.toLowerCase();
    const params = urlObject.searchParams;

    const auth = handleAuth(request, pathname, env);
    if (auth !== 'pass-through') {
      return auth;
    }

    switch (request.method.toUpperCase()) {
      case 'GET':
        return await handleGetRequest(env.DB, env.ADMIN_KV, pathname, params);
      case 'POST':
        return await handlePostRequest(env.DB, env.KV, env.ADMIN_KV, request, ctx, pathname);
      default:
        return new Response('Api call not found', statuses.NOT_FOUND);
    }
  },
};
