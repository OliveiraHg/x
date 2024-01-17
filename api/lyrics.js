module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
    const cors = require('cors');

app.get('/v1/lyrics', async (req, res) => {
  const song = req.query.s;

  try {
    const id = await search(song);
    const songDetails = await lyrics(id);

    res.setHeader('Content-Type', 'application/json'); // Set the response header

    const jsonResponse = `{
  "title": "${songDetails.name}",
  "year": ${songDetails.year},
  "cover": "${songDetails.imageUrl}",
  "lyrics": "${songDetails.lyrics.replace(/\n/g, '\\n').replace(/\t/g, '\\t')}"
}`;

    res.send(jsonResponse); // Send the JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


    async function search(s) {
      try {
        const options = {
          method: 'GET',
          url: 'https://songsear.ch/api/search',
          params: { q: s },
          headers: { 'User-Agent': 'insomnia/8.5.1' },
        };

        const response = await axios.request(options);
        return response.data.results[0].id;
      } catch (error) {
        throw error;
      }
    }

    async function lyrics(id) {
      try {
        const options = {
          method: 'GET',
          url: `https://songsear.ch/api/song/${id}`,
          headers: { 'User-Agent': 'insomnia/8.5.1' },
        };

        const response = await axios.request(options);

        const { name, year, image, text_html } = response.data.song;
        const text = text_html.replace(/<br\/>/g, '\n  ').replace(/&#x27;/g, "'");
        
        return { name, year, imageUrl: image.url, lyrics: text };
      } catch (error) {
        throw error;
      }
    }
  },
};
