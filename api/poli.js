const fs = require("fs");
const { PassThrough } = require("stream");

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
    app.get("/api/poli", async (req, res) => {
      try {
        const q = req.query.q;
        var options = {
          method: "GET",
          url: "https://image.pollinations.ai/prompt/" + q,
          headers: { "User-Agent": "insomnia/8.4.5" },
          responseType: "stream", // Set responseType to 'arraybuffer'
        };

        const response = await axios.request(options);

        res.setHeader("Cache-Control", "public, max-age=0"); // Adjust caching as needed

        const stream = new PassThrough();
        response.data.pipe(stream);
        stream.pipe(res);
      } catch (error) {
        console.error(error);
        res.status(500).json({ sucess: false, error: "Internal server error" });
      }
    });
  },
};
