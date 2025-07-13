const { NetlifyAPI } = require('netlify');

exports.handler = async (event) => {
  try {
    const netlify = new NetlifyAPI(process.env.NETLIFY_ACCESS_TOKEN);
    const studentData = JSON.parse(event.body);

    if (!studentData?.name) {
      throw new Error("Student name is required");
    }

    const key = `report_${Date.now()}`;

    // Save to Netlify KV Store
    await netlify.createOrUpdateKVEntry({
      site_id: process.env.SITE_ID,
      key,
      value: JSON.stringify(studentData),
    });

    const shareUrl = `${process.env.URL}/?key=${key}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ url: shareUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};