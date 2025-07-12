const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const { key } = event.queryStringParameters || {};
    if (!key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Key is required' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const dataFilePath = path.join(__dirname, 'data', 'links.json');
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const links = JSON.parse(fileContent);

    const studentData = links[key];
    if (!studentData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Invalid or expired link!' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(studentData),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('Error retrieving link:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve link' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};