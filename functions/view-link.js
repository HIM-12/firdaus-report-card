const { NetlifyAPI } = require('netlify');

exports.handler = async (event) => {
  try {
    const { key } = event.queryStringParameters || {};
    if (!key) return { statusCode: 400, body: "Missing key" };

    const netlify = new NetlifyAPI(process.env.NETLIFY_ACCESS_TOKEN);
    const entry = await netlify.getKVEntry({
      site_id: process.env.SITE_ID,
      key,
    });

    if (!entry) return { statusCode: 404, body: "Link expired" };

    return {
      statusCode: 200,
      body: entry.value,
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};