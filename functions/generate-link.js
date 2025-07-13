const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  try {
    console.log("Function started");
    
    // Get the correct path (works both locally and on Netlify)
    const dataDir = path.join(process.cwd(), 'functions', 'data');
    const dataFilePath = path.join(dataDir, 'links.json');
    
    console.log(`Data file path: ${dataFilePath}`);

    // Ensure directory exists
    try {
      await fs.mkdir(dataDir, { recursive: true });
      console.log("Directory created/verified");
    } catch (err) {
      console.error("Directory error:", err);
      if (err.code !== 'EEXIST') throw err;
    }

    // Initialize links object
    let links = {};
    
    // Try to read existing file
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf8');
      links = JSON.parse(fileContent);
      console.log("Existing links loaded");
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log("No existing links file, creating new one");
      } else {
        throw err;
      }
    }

    // Generate unique key
    const key = `link_${Date.now()}`;
    console.log(`Generated key: ${key}`);

    // Parse input data
    const studentData = JSON.parse(event.body);
    console.log("Received student data:", studentData);

    // Validate required fields
    if (!studentData?.name) {
      throw new Error("Student name is required");
    }

    // Store the data
    links[key] = studentData;
    await fs.writeFile(dataFilePath, JSON.stringify(links, null, 2));
    console.log("Data saved successfully");

    // Generate URL
    const siteUrl = process.env.URL || 'https://resplendent-faun-4d1839.netlify.app';
    const shareUrl = `${siteUrl}/?key=${key}`;
    console.log(`Generated URL: ${shareUrl}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: shareUrl }),
    };
  } catch (error) {
    console.error("Full error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
    };
  }
};