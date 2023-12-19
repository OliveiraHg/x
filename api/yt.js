const ytdl = require('ytdl-core');

exports.run = async function({ port, app, OpenAI, bodyParser, express, axios }) {
  app.get('/api/ytdl', async (req, res) => {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
      const info = await ytdl.getInfo(url);

      res.json({ videoInfo: info });
    } catch (error) {
      console.error('Error fetching video info:', error.message);
      res.status(500).json({ error: 'Error fetching video info' });
    }
  });
};
