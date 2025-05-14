import { statuses } from './auth.js';

export async function trackEventDB(database, username, email, banner, image, city, state, zipcode, ip) {
  const datetimestamp = (new Date()).toUTCString();

  try {
    await database
      .prepare('INSERT INTO "user-data" (username, datetimestamp, email, banner, image, city, state, zipcode, ip) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)')
      .bind(username, datetimestamp, email, banner, image, city, state, zipcode, ip)
      .run();
  } catch (error) {
    return new Response(error, statuses.INTERNAL_SERVER_ERROR);
  }
}

export async function trackEventKV(keyvault, username, email, banner, image, city, state, zipcode, ip) {
  const datetimestamp = (new Date()).toUTCString();
  const value = JSON.stringify({ username, email, banner, image, city, state, zipcode, ip, datetimestamp });
  const metadata = { username, datetimestamp };
  keyvault.put(username, value, {
    metadata,
  });
}

export async function trackAdminKV(adminKeyvault, redirect, splitTest) {
  await adminKeyvault.put('redirect-on', redirect);
  await adminKeyvault.put('split-test-on', splitTest);
}

export async function trackSplitTestKV(keyvault, key, redirects) {
  const dataString = await keyvault.get(key);
  if (dataString === null) return false;

  const data = JSON.parse(dataString);
  const updatedData = { ...data, redirects };
  await keyvault.put(key, JSON.stringify(updatedData));
  return true;
}
