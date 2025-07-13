const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  try {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'functions', 'data');
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    const dataFilePath = path.join(dataDir, 'links.json');
    let links = {};

    // Try to read existing links
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf8');
      links = JSON.parse(fileContent);
    } catch (err) {
      // File doesn't exist yet - that's okay
    }

    // Generate unique key
    const key = `link_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;

    // Parse and validate input
    const studentData = JSON.parse(event.body);
    if (!studentData.name) {
      throw new Error("Student name is required");
    }

    // Store the data
    links[key] = studentData;
    await fs.writeFile(dataFilePath, JSON.stringify(links));

    // Generate URL
    const siteUrl = process.env.URL || 'https://your-site-name.netlify.app';
    const shareUrl = `${siteUrl}/?key=${key}`;

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