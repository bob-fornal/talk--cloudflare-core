export default {
  async fetch(request, env, ctx) {
    // Clear out Table
    await env.DB
      .prepare('DELETE FROM "user-data" ')
      .run();

      // Clear out Key Vault
    const keys = await getKeys(env.KV);
    const promises = keys.map(async (key) => {
      await env.KV.delete(key.name);
    });
    await Promise.all(promises);

    return new Response('CRON JOB: Cleanup Complete');
  },
};

async function getKeys(keyvault) {
  const list = [];
  let result = await keyvault.list();
  list.push(...result.keys);
  while (result.list_complete === false) {
    let cursor = result.cursor;
    result = await keyvault.list({ cursor });
    list.push(...result.keys);
  }
  return list;
}
