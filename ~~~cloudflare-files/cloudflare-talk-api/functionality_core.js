import { statuses } from './auth.js';
import { trackEventDB, trackEventKV, trackAdminKV, trackSplitTestKV } from './functionality_track.js';

export async function handleGetRequest(database, adminKeyvault, path, params) {
  switch (true) {
    case path === '/api/get-admin-states': {
        const redirect = await adminKeyvault.get('redirect-on');
        const splitTest = await adminKeyvault.get('split-test-on');
        const result = { redirect, splitTest };

        return new Response(JSON.stringify(result), statuses.OK);
      }
    case path === '/api/get-users-registered-today': {
        const today = new Date();
        const data = await database
          .prepare('SELECT * FROM "user-data"')
          .run();
        const result = data.results.filter((item) => {
          const date = new Date(item.datetimestamp);
          return today.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0);
        });

        return new Response(JSON.stringify(result), statuses.OK);
      }
    default:
      return new Response('Invalid Request', statuses.BAD_REQUEST);
  }
}

export async function handlePostRequest(database, keyvault, adminKeyvault, request, ctx, path) {
  const { value: bodyIntArray } = await request.body.getReader().read();
  const bodyString = new TextDecoder().decode(bodyIntArray);
  let body = JSON.parse(bodyString);
  if (typeof body === 'string') {
    body = JSON.parse(body);
  }
  console.log(path);
  
  switch (true) {
    case path === '/api/post-admin-states': {
        const redirect = body.redirect;
        const splitTest = body.splitTest;

        await trackAdminKV(adminKeyvault, redirect, splitTest);
        // ctx.waitUntil(trackAdminKV(adminKeyvault, redirect, splitTest));
        return new Response('Success', statuses.OK);
      }
    case path === '/api/post-user-data':
      const city = request.cf.city || 'not captured';
      const state = request.cf.region || request.cf.regionCode || 'not captured';
      const zipcode = request.cf.postalCode || 'not captured';
      const ip = request.headers.get('cf-connecting-ip') || 'not captured';
    
      const hasValidProperties = body.hasOwnProperty('username') === true
        && body.hasOwnProperty('email') === true
        && body.hasOwnProperty('bannerText') === true
        && body.hasOwnProperty('imagePath') === true;

      if (hasValidProperties === true) {
        const username = body.username;
        const email = body.email;
        const bannerText = body.bannerText;
        const imagePath = body.imagePath;
    
        // await trackEvent(database, username, email, bannerText, city, state, zipcode, ip);
        ctx.waitUntil(trackEventDB(database, username, email, bannerText, imagePath, city, state, zipcode, ip));
        ctx.waitUntil(trackEventKV(keyvault, username, email, bannerText, imagePath, city, state, zipcode, ip));
        return new Response('Success', statuses.OK);
      } else {
        return new Response('Invalid Request - Inner', statuses.BAD_REQUEST);
      }
    case path === '/api/post-user-split-test': {
        const key = body.key;
        const redirects = body.redirects;

        const savedCorrectly = await trackSplitTestKV(keyvault, key, redirects);
        if (savedCorrectly === true) {
          return new Response('Success', statuses.OK);  
        } else {
          return new Response('User ID not previously saved', statuses.BAD_REQUEST);  
        }
      }
    default:
      return new Response('Invalid Request - Outer', statuses.BAD_REQUEST);
  }
}