const axios = require("axios").default;
const cheerio = require("cheerio");

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express }) {
    app.post('/v2/fbdl', async (req, res) => {
      try {
        const { url } = req.body;

        if (!url) {
          return res.status(400).send({
            status: 400,
            message: "Invalid request, 'url' parameter is required",
            success: false
          });
        }

        const options = {
          method: "POST",
          url: 'https://fdown.net/download.php',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "insomnia/8.5.1",
          },
          data: {
            URLz: url,
          },
        };

        const response = await axios.request(options);

        // Load the HTML into Cheerio
        const $ = cheerio.load(response.data);

        // Extract the href attribute of the #hdlink element
        const downloadLink = $("#hdlink").attr("href");

        // If downloadLink exists, stringify it, otherwise set it to null
        const urlValue = downloadLink !== undefined ? JSON.stringify(downloadLink) : null;

        const jsonResponse = `{
          "status": 200,
          "developer": "ADONIS JR S:EASY TECH API",
          "url": ${urlValue}
        }`;

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(jsonResponse);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  },
};
