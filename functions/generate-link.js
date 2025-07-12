const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  try {
    console.log('Event received:', event);
    const dataFilePath = path.join(__dirname, 'data', 'links.json');
    let links = {};
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf8');
      links = JSON.parse(fileContent);
      console.log('Loaded links:', links);
    } catch (error) {
      console.error('Error reading file:', error);
      await fs.writeFile(dataFilePath, '{}', 'utf8');
      console.log('Created new links.json');
    }

    const shareKey = `s${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
    console.log('Generated key:', shareKey);
    const requestBody = JSON.parse(event.body || '{}');
    console.log('Parsed request body:', requestBody);
    const studentData = {
      name: requestBody.name || 'Unknown',
      class: requestBody.class || 'Unknown',
      scores: requestBody.scores || [],
    };

    links[shareKey] = studentData;
    console.log('Saving data:', { [shareKey]: studentData });
    await fs.writeFile(dataFilePath, JSON.stringify(links, null, 2), 'utf8').catch(err => console.error('Write error:', err));

    const siteUrl = process.env.URL || 'http://localhost:8888';
    const shareableUrl = `${siteUrl}/.netlify/functions/view-link?key=${shareKey}`;
    console.log('Generated URL:', shareableUrl);

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