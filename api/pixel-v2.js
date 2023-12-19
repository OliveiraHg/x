const axios = require("axios");
const fs = require("fs");

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express }) {
    app.get("/v2/pixel", async (req, res) => {
      try {
        const query = req.query.q;

        var options = {
          method: "GET",
          url: "https://api.pexels.com/v1/search",
          params: { query },
          headers: {
            Authorization:
              "AinHu3U2mcFNeFD4IOhW3AbYiTWYvGQqACcRGSNl2KP1slEU1l6YmJOo", // Changed to Bearer token
            "User-Agent": "insomnia/8.4.2",
          },
        };

        const response = await axios.request(options);

        const data = response.data.photos.map(({ photographer, src }) => ({
          photographer,
          src,
        }));
        const img = data.map(({ src }) => src); // Extracting the 'src' property directly

        res.json({
          status: "OK",
          data: img,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    });
  },
};
