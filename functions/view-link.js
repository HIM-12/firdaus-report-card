const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const { key, api } = event.queryStringParameters || {};
    if (!key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Key is required' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    // Correct path to match your folder structure: functions/data/links.json
    const dataFilePath = path.join(__dirname, 'data', 'links.json');
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const links = JSON.parse(fileContent);

    const studentData = links[key];
    if (!studentData) {
      // If API call, return error JSON
      if (api === 'true') {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Invalid or expired link!' }),
          headers: { 'Content-Type': 'application/json' },
        };
      }
      // If direct access, redirect to main page with error
      return {
        statusCode: 302,
        headers: {
          Location: `/?error=invalid_link`,
        },
      };
    }

    // If API call, return JSON data
    if (api === 'true') {
      return {
        statusCode: 200,
        body: JSON.stringify(studentData),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    // If direct access, redirect to main page with key parameter
    return {
      statusCode: 302,
      headers: {
        Location: `/?key=${key}`,
      },
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