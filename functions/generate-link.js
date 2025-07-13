exports.handler = async (event, context) => {
  try {
    const dataFilePath = path.join(__dirname, 'data', 'links.json');
    let links = {};
    
    try {
      links = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
    } catch (err) {
      await fs.writeFile(dataFilePath, '{}');
    }

    const key = `s${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
    const studentData = JSON.parse(event.body);
    
    links[key] = studentData;
    await fs.writeFile(dataFilePath, JSON.stringify(links));

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