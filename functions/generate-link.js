const { NetlifyAPI } = require('netlify');

exports.handler = async (event, context) => {
  try {
    // Initialize with Netlify's built-in credentials
    const netlify = new NetlifyAPI(process.env.NETLIFY_ACCESS_TOKEN || context.clientContext.token);

    const studentData = JSON.parse(event.body);
    const key = `report_${Date.now()}`;

    // Save to KV store
    await netlify.createOrUpdateKVEntry({
      site_id: process.env.SITE_ID,
      key,
      value: JSON.stringify(studentData)
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        url: `${process.env.URL}/?key=${key}`
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to generate link",
        details: error.message 
      })
    };
  }
};