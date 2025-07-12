const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Correct path to match your folder structure: functions/data/links.json
    const dataFilePath = path.join(__dirname, 'data', 'links.json');
    let links = {};
    
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf8');
      links = JSON.parse(fileContent);
    } catch (error) {
      // Create the file if it doesn't exist
      await fs.writeFile(dataFilePath, '{}', 'utf8');
    }

    const shareKey = `s${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
    const requestBody = JSON.parse(event.body || '{}');
    const studentData = {
      name: requestBody.name || 'Unknown',
      class: requestBody.class || 'Unknown',
      session: requestBody.session || '',
      term: requestBody.term || '',
      position: requestBody.position || '',
      gender: requestBody.gender || '',
      scores: requestBody.scores || [],
    };

    links[shareKey] = studentData;
    await fs.writeFile(dataFilePath, JSON.stringify(links, null, 2), 'utf8');

    const siteUrl = process.env.URL || 'http://localhost:8888';
    const shareableUrl = `${siteUrl}/.netlify/functions/view-link?key=${shareKey}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Shareable link generated', url: shareableUrl }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('Error generating link:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate link' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};