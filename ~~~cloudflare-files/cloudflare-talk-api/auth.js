const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
  };
  
  export const statuses = {
    OK: { headers, status: 200, },
    NO_CONTENT: { headers, status: 204, },
  
    MOVED_PERMANENTLY: { headers, status: 301, },
    FOUND: { headers, status: 302, },
  
    BAD_REQUEST: { headers, status: 400, },
    UNAUTHORIZED: { headers, status: 401 },
    NOT_FOUND: { headers, status: 404, },
  
    INTERNAL_SERVER_ERROR: { headers, status: 500, },
  };
  
  const pingPaths = [
    '/api/ping',
  ];
  
  export function handleAuth(request, path, env) {
    const X_API_KEYS = JSON.parse(env.AUTH_KEY);
    const method = request.method.toUpperCase();
  
    if (method === 'GET' && pingPaths.includes(path)) {
      return new Response('Pong', statuses.OK);
    }
  
    if (method === 'OPTIONS') {
      return new Response('Options', { headers });
    }
  
    const authHeader = request.headers.get('x-api-key');
    if (X_API_KEYS.includes(authHeader) === false) {
      return new Response('Unauthorized', statuses.UNAUTHORIZED );
    }
    return 'pass-through';
  }
  