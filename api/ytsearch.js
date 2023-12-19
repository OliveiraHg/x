module.exports = {
  run: async function ({port ,app ,OpenAI ,bodyParser,express,axios }) {

const yts = require('yt-search');


const { YouTubeSearch } = require('node-tube-dl');


app.use(express.json());

app.get('/api/yt', async (req, res) => {
  try {
    const query = req.query.s; 

      if (!query) {
      return res.status(400).json({ error: 'Search query parameter (q) is required' });
    }

    const { videos } = await yts(query);

      const formattedVideos = videos.map((video) => ({
      title: video.title,
				
      thumbnail: video.thumbnail,
      timestamp: video.timestamp,
      url: video.url,
    }));

    res.json(formattedVideos);
  } catch (error) {
    console.error('Error searching for videos:', error);
    res.status(500).json({ error: 'An error occurred while searching for videos' });
  }
});




		
  },
};