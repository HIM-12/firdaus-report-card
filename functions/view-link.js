const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  try {
    const { key } = event.queryStringParameters || {};
    if (!key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing key parameter' }),
      };
    }

    const dataFilePath = path.join(process.cwd(), 'functions', 'data', 'links.json');

    // Read links data
    let links = {};
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf8');
      links = JSON.parse(fileContent);
    } catch (err) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Link database not found' }),
      };
    }

    // Find the student data
    const studentData = links[key];
    if (!studentData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Invalid or expired link' }),
      };
    }

    // Return the data
    return {
      statusCode: 200,
      body: JSON.stringify(studentData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};